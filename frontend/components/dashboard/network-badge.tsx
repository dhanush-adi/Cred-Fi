import { Zap } from "lucide-react"

export function NetworkBadge() {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border/40">
      <div className="flex items-center gap-1">
        <Zap className="h-4 w-4 text-accent" />
        <span className="text-xs font-medium text-foreground">Shardeum</span>
      </div>
      <span className="text-xs text-muted-foreground">8119</span>
    </div>
  )
}
