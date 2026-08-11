import { Text } from 'tc96/ui'

export function PlannedView({ name }: Readonly<{ name: string }>): React.ReactElement {
  return (
    <section
      aria-labelledby={`planned-${name.toLowerCase()}`}
      className="flex min-h-64 w-[36rem] max-w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-muted/40 p-8 text-center"
    >
      <Text
        family="heading"
        id={`planned-${name.toLowerCase()}`}
        render={<h2>{name}</h2>}
        size="lg"
        weight="semibold"
      />
      <Text foreground="muted">Planned collection view. Public API not defined yet.</Text>
    </section>
  )
}
