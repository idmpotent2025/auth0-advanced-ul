export function Field({
  id,
  label,
  type = 'text',
  autoComplete,
  defaultValue,
  required = true,
}: {
  id: string
  label: string
  type?: string
  autoComplete?: string
  defaultValue?: string
  required?: boolean
}) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        required={required}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow"
      />
    </div>
  )
}
