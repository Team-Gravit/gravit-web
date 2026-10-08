import { createFileRoute } from '@tanstack/react-router';

import { UnitDetailPage } from '@/pages/unit-detail';

export const Route = createFileRoute('/_authenticated/_app-shell/learning/units/$unitId/')({
  component: UnitDetailRoute,
});

function UnitDetailRoute() {
  const { unitId } = Route.useParams();

  return <UnitDetailPage unitId={unitId} />;
}
