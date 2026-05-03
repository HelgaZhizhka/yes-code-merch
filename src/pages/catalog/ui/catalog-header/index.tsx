import { GridViewToggle } from './grid-view-toggle';

export const CatalogHeader = (): React.JSX.Element => {
  return (
    <div className="mb-4 flex items-center justify-end gap-2">
      <GridViewToggle />
    </div>
  );
};
