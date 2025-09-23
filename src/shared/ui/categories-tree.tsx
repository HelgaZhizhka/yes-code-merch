import { Link } from '@tanstack/react-router';
import { cva } from 'class-variance-authority';
import React from 'react';

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
    variant: { default: '', mobile: '', sidebar: '' },
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

    return (
      <li>
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
          <ul>
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
      <ul>
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
