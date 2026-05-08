import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { useLocation } from '@tanstack/react-router';
import { Menu, Phone } from 'lucide-react';
import { Suspense, useEffect } from 'react';

import { useCategoriesTree } from '@shared/api';
import { SaleCategoryName } from '@shared/config';
import { Banner } from '@shared/ui/banner';
import { CategoriesTree } from '@shared/ui/categories-tree';
import { ContactWidget } from '@shared/ui/contact-widget';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@shared/ui/sheet';

import { useMobileMenu } from './use-mobile-menu';

const NAV_SKELETON_KEYS = ['nav-1', 'nav-2', 'nav-3', 'nav-4'] as const;

export const MobileMenu = (): React.JSX.Element => {
  const { isOpen, open: openMenu, close: closeMenu } = useMobileMenu();
  const location = useLocation();
  const { data: categoryTree } = useCategoriesTree();

  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(next) => (next ? openMenu() : closeMenu())}
    >
      <SheetTrigger aria-label="Open navigation menu">
        <Menu className="size-7 text-foreground" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex h-screen w-screen sm:max-w-[400px] flex-col p-5"
      >
        <SheetHeader className="p-2">
          <VisuallyHidden.Root>
            <SheetTitle>Navigation menu</SheetTitle>
            <SheetDescription>Navigation menu</SheetDescription>
          </VisuallyHidden.Root>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          <Suspense
            fallback={
              <div className="flex flex-col gap-5">
                {NAV_SKELETON_KEYS.map((key) => (
                  <div
                    key={key}
                    className="h-7 w-36 animate-pulse rounded bg-muted"
                  />
                ))}
              </div>
            }
          >
            <CategoriesTree categoryTree={categoryTree} variant="mobile" />
          </Suspense>
        </div>
        <div className="mt-auto flex flex-col items-center gap-6">
          <Banner category={SaleCategoryName} variant="mobile" />
          <div className="flex items-center gap-2 text-2xl">
            <ContactWidget
              icon={<Phone className="h-8" />}
              label="(+971) 58 8284186"
              href="tel:971588284186"
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
