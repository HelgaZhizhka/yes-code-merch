import { Categories } from '@/shared/ui/categories';

export const Home = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-between p-4">
      <h1 className="text-2xl mb-4">Home page</h1>
      <div className="flex flex-col items-center gap-4 w-full">
        <h2 className="text-xl">Shop by category</h2>
        <Categories variant="home" />
      </div>
    </div>
  );
};
