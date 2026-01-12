interface CreditBadgeProps {
  score: number
}

export function CreditBadge({ score }: CreditBadgeProps) {
  let bgColor = "bg-red-500/20 border-red-500/40"
  let textColor = "text-red-400"
  let label = "Building"

  if (score >= 80) {
    bgColor = "bg-green-500/20 border-green-500/40"
    textColor = "text-green-400"
    label = "Excellent"
  } else if (score >= 60) {
    bgColor = "bg-blue-500/20 border-blue-500/40"
    textColor = "text-blue-400"
    label = "Good"
  } else if (score >= 40) {
    bgColor = "bg-amber-500/20 border-amber-500/40"
    textColor = "text-amber-400"
    label = "Fair"
  }

  return (
    <div className={`px-3 py-1 rounded-full border ${bgColor}`}>
      <p className={`text-xs font-semibold ${textColor}`}>{label}</p>
    </div>
  )
}
