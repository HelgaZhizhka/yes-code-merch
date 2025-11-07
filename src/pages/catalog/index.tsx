// import { useParams } from '@tanstack/react-router';
// import { Suspense } from 'react';

// import { Breadcrumbs } from '@/shared/ui/breadcrumbs';

import { SideBar } from './ui/sidebar';

export const Catalog = (): React.JSX.Element => {
  // const { _splat } = useParams({ strict: false });
  return (
    <div>
      {/* <Suspense fallback={<div>Loading...</div>}>
        <Breadcrumbs splat={_splat} />
      </Suspense> */}
      <h1 className="text-2xl">Catalog Page</h1>
      <SideBar />
    </div>
  );
};
