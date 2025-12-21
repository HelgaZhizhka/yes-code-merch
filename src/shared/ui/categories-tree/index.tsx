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
    expandedNodes,
    onToggle,
  }: {
    node: CategoryTree;
    pathPrefix?: string;
    variant?: CategoriesTreeProps['variant'];
    useFullPath?: boolean;
    expandedNodes: Set<string>;
    onToggle: (id: string) => void;
  }) => {
    const { slug, name } = node;
    const fullPath = [pathPrefix, slug].filter(Boolean).join('/');
    const pathToUse = useFullPath ? fullPath : slug;

    const isOpen = expandedNodes.has(node.id);

    return (
      <li>
        <div className="flex items-center gap-1">
          <Link
            to={ROUTES.CATEGORY}
            params={{ _splat: pathToUse }}
            preload={variant === 'mobile' ? false : 'intent'}
            className={cn(linkVariants({ variant }))}
            activeProps={{ 'data-active': true, 'aria-current': 'page' }}
          >
            {name}
          </Link>

          {node.children.length > 0 && (
            <button
              onClick={() => onToggle(node.id)}
              aria-label={'Dropdown menu'}
            >
              <ChevronRight className={cn('w-6 h-6', isOpen && 'rotate-90')} />
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
}: CategoriesTreeProps) => {
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
      <ul className="flex flex-col gap-4">
        {categoryTree.map((root) => (
          <Node
            key={root.id}
            node={root}
            variant={variant}
            useFullPath={useFullPath}
            expandedNodes={expandedNodes}
            onToggle={toggleNode}
          />
        ))}
      </ul>
    </nav>
  );
};
