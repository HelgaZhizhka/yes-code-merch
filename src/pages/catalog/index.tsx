import { useParams } from '@tanstack/react-router';
const Catalog = (): React.JSX.Element => {
  const params = useParams({ strict: false });
  return (
    <div>
      <h1 className="text-2xl">Catalog Page</h1>
      <p>This is the Catalog page component.</p>
      <>
        {params.categoryId} {params.subCategoryId}
      </>
    </div>
  );
};

export default Catalog;
