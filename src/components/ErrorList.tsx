export function ErrorList({ errors }: { errors: string[] }) {
  if (!errors.length) return null
  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      {errors.map((e, i) => (
        <p key={i} className="text-xs text-red-700">{e}</p>
      ))}
    </div>
  )
}
