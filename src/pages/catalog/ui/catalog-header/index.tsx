import { CATALOG_TEXT } from '@pages/catalog/lib';

import { GridViewToggle } from './grid-view-toggle';

interface CatalogHeaderProps {
  totalCount: number;
}

export const CatalogHeader = ({
  totalCount,
}: CatalogHeaderProps): React.JSX.Element => {
  return (
    <div className="mb-4 flex items-center gap-2">
      <div className="flex-1" />
      <GridViewToggle />
      <span className="whitespace-nowrap text-sm text-muted-foreground">
        {CATALOG_TEXT.header.countLabel(totalCount)}
      </span>
    </div>
  );
};
