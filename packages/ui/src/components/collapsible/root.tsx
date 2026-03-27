import { Collapsible as CollapsiblePrimitive } from "radix-ui"

export function Root({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}
