interface CatalogHeaderProps {
  totalCount: number;
  pageSize: number;
}

export const CatalogHeader = ({
  totalCount,
  pageSize,
}: CatalogHeaderProps): React.JSX.Element => {
  if (totalCount === 0) {
    return <p>No products found</p>;
  }

  return (
    <div className="flex justify-between items-center mb-6">
      <p className="text-sm text-gray-600">Display {pageSize} per page</p>
    </div>
  );
};
