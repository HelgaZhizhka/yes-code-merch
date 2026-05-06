import { Link } from '@tanstack/react-router';
import { cva } from 'class-variance-authority';
import { ChevronRight } from 'lucide-react';
import React, { useCallback, useState } from 'react';

import type { CategoryTree } from '@shared/api';
import { ROUTES } from '@shared/config/routes';
import { cn } from '@shared/lib/utils';

type CategoriesTreeProps = {
  categoryTree: CategoryTree[];
  variant?: 'default' | 'mobile' | 'sidebar';
  className?: string;
  useFullPath?: boolean;
};

const linkVariants = cva('transition-all', {
  variants: {
    variant: {
      default: '',
      mobile: 'text-2xl text-foreground hover:text-primary',
      sidebar:
        'block w-full py-1 pl-3 text-sm text-muted-foreground border-l-2 border-transparent hover:text-foreground hover:border-border data-[active]:border-primary data-[active]:text-primary data-[active]:font-medium',
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
    expandedNodes,
    onToggle,
    rootIndex,
  }: {
    node: CategoryTree;
    pathPrefix?: string;
    variant?: CategoriesTreeProps['variant'];
    useFullPath?: boolean;
    expandedNodes: Set<string>;
    onToggle: (id: string) => void;
    rootIndex?: number;
  }): React.JSX.Element => {
    const { slug, name } = node;
    const fullPath = [pathPrefix, slug].filter(Boolean).join('/');
    const pathToUse = useFullPath ? fullPath : slug;

    const isOpen = expandedNodes.has(node.id);

    return (
      <li
        className={cn(variant === 'mobile' && 'animate-menu-item')}
        style={
          variant === 'mobile'
            ? { animationDelay: `${(rootIndex ?? 0) * 60}ms` }
            : undefined
        }
      >
        <div className="flex items-center gap-1">
          <Link
            to={ROUTES.CATEGORY}
            params={{ _splat: pathToUse }}
            preload={variant === 'mobile' ? false : 'intent'}
            search={() => ({})}
            className={cn(linkVariants({ variant }))}
            activeProps={{ 'data-active': true, 'aria-current': 'page' }}
          >
            {name}
          </Link>

          {node.children.length > 0 && (
            <button
              type="button"
              onClick={() => onToggle(node.id)}
              aria-label={`Toggle ${name} subcategories`}
              aria-expanded={isOpen}
              className={cn(
                'ml-auto p-0.5 text-muted-foreground transition-colors hover:text-foreground',
                variant === 'sidebar' && 'mr-1'
              )}
            >
              <ChevronRight
                className={cn(
                  'transition-transform',
                  variant === 'sidebar' ? 'h-3.5 w-3.5' : 'h-6 w-6',
                  isOpen && 'rotate-90'
                )}
              />
            </button>
          )}
        </div>

        {node.children.length > 0 && isOpen && (
          <ul className="flex flex-col pl-5 gap-2 mt-2">
            {node.children.map((child) => (
              <Node
                key={child.id}
                node={child}
                pathPrefix={useFullPath ? fullPath : pathPrefix}
                variant={variant}
                useFullPath={useFullPath}
                expandedNodes={expandedNodes}
                onToggle={onToggle}
                rootIndex={rootIndex}
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
  categoryTree,
  variant = 'default',
  className,
  useFullPath = true,
}: CategoriesTreeProps): React.JSX.Element => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = useCallback((id: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  return (
    <nav className={className} aria-label="All categories">
      <ul
        className={cn(
          'flex flex-col',
          variant === 'sidebar' ? 'gap-0.5' : 'gap-4'
        )}
      >
        {categoryTree.map((root, index) => (
          <Node
            key={root.id}
            node={root}
            variant={variant}
            useFullPath={useFullPath}
            expandedNodes={expandedNodes}
            onToggle={toggleNode}
            rootIndex={variant === 'mobile' ? index : undefined}
          />
        ))}
      </ul>
    </nav>
  );
};
