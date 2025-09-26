import { Link } from '@tanstack/react-router';
import { cva } from 'class-variance-authority';
import { ChevronDown, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

import { useCategoriesTree } from '@shared/api/categories/hooks';
import type { CategoryTree } from '@shared/api/categories/mapper';
import { ROUTES } from '@shared/config/routes';
import { cn } from '@shared/lib/utils';

type CategoriesTreeProps = {
  variant?: 'default' | 'mobile' | 'sidebar';
  className?: string;
  useFullPath?: boolean;
};

const linkVariants = cva('transition-all', {
  variants: {
    variant: {
      default: '',
      mobile: 'text-2xl text-primary-foreground',
      sidebar: '',
    },
  },
  defaultVariants: { variant: 'default' },
});

const Node = React.memo(
  ({
    node,
    variant,
    useFullPath,
    pathPrefix = '',
  }: {
    node: CategoryTree;
    pathPrefix?: string;
    variant?: CategoriesTreeProps['variant'];
    useFullPath?: boolean;
  }) => {
    const { slug, name } = node;
    const fullPath = [pathPrefix, slug].filter(Boolean).join('/');
    const pathToUse = useFullPath ? fullPath : slug;

    const [open, setOpen] = useState(false);

    return (
      <li>
        <div className="flex items-center gap-1">
          <Link
            to={ROUTES.CATEGORY}
            params={{ _splat: pathToUse }}
            preload="intent"
            className={cn(linkVariants({ variant }))}
            activeProps={{ 'data-active': true, 'aria-current': 'page' }}
          >
            {name}
          </Link>

          {node.children.length > 0 && (
            <button onClick={() => setOpen(!open)} aria-label={'Dropdown menu'}>
              {open ? (
                <ChevronDown className="w-6 h-6" />
              ) : (
                <ChevronRight className="w-6 h-6" />
              )}
            </button>
          )}
        </div>

        {node.children.length > 0 && open && (
          <ul className="flex flex-col pl-5 gap-2 mt-2">
            {node.children.map((child) => (
              <Node
                key={child.id}
                node={child}
                pathPrefix={useFullPath ? fullPath : pathPrefix}
                variant={variant}
                useFullPath={useFullPath}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }
);

Node.displayName = 'CategoryNode';

export const CategoriesTree = ({
  variant = 'default',
  className,
  useFullPath = true,
}: CategoriesTreeProps) => {
  const { data } = useCategoriesTree();
  return (
    <nav className={className} aria-label="All categories">
      <ul className="flex flex-col gap-4">
        {data.map((root) => (
          <Node
            key={root.id}
            node={root}
            variant={variant}
            useFullPath={useFullPath}
          />
        ))}
      </ul>
    </nav>
  );
};
