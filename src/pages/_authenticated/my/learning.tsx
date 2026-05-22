import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/my/learning')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/my/learning"!</div>
}
