import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/my/social')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/my/social"!</div>
}
