import { useParams } from '@tanstack/react-router';

import { useBreadcrumbs } from '@shared/api';
import { Breadcrumbs } from '@shared/ui/breadcrumbs';

import { SideBar } from './ui/sidebar';

export const Catalog = (): React.JSX.Element => {
  const { _splat } = useParams({ strict: false });
  const breadcrumbs = useBreadcrumbs(_splat);
  return (
    <div>
      <Breadcrumbs items={breadcrumbs} className="mb-4" />
      <h1 className="text-2xl">Catalog Page</h1>
      <SideBar />
    </div>
  );
};
