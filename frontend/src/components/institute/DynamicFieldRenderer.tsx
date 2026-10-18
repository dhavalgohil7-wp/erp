import { CustomFieldDef } from '../../store/useInstituteStore'

interface DynamicFieldRendererProps {
  customFields: CustomFieldDef[]
  values: Record<string, any>
  onChange: (fieldTitle: string, val: any) => void
  errors?: Record<string, string>
}

export default function DynamicFieldRenderer({
  customFields,
  values,
  onChange,
  errors = {},
}: DynamicFieldRendererProps) {
  if (!customFields || customFields.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-surface-container-low/50 border border-outline-variant/30 text-center text-xs text-secondary italic">
        No custom fields defined for this role in Master Setup (3.2).
      </div>
    )
  }

  // Parse options string (e.g. "A+, B+, O-, AB+")
  const parseOptions = (optionsStr: string): string[] => {
    if (!optionsStr) return []
    return optionsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
      {customFields.map((field) => {
        const val = values[field.title] ?? ''
        const error = errors[field.title]
        const options = parseOptions(field.optionsString)

        return (
          <div
            key={field.id}
            className={field.fieldType === 'Textarea' ? 'md:col-span-2' : ''}
          >
            <div className="flex items-center justify-between mb-1">
              <label className="text-[13px] font-semibold text-on-surface flex items-center gap-1.5">
                {field.title}
                {field.required && <span className="text-red-500 font-bold">*</span>}
              </label>

              <div className="flex items-center gap-1.5">
                {field.isUnique && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 border border-purple-200">
                    Unique
                  </span>
                )}
                <span className="text-[10px] text-secondary font-mono">
                  {field.fieldType}
                </span>
              </div>
            </div>

            {/* Render input by field type */}
            {field.fieldType === 'Text' && (
              <input
                type="text"
                value={val}
                onChange={(e) => onChange(field.title, e.target.value)}
                placeholder={`Enter ${field.title}`}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[13.5px] border ${
                  error ? 'border-red-500' : 'border-outline-variant/30 focus:border-primary'
                } outline-none transition-all`}
              />
            )}

            {field.fieldType === 'Number' && (
              <input
                type="number"
                value={val}
                onChange={(e) => onChange(field.title, e.target.value)}
                placeholder={`0`}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[13.5px] border ${
                  error ? 'border-red-500' : 'border-outline-variant/30 focus:border-primary'
                } outline-none transition-all`}
              />
            )}

            {field.fieldType === 'Password' && (
              <input
                type="password"
                value={val}
                onChange={(e) => onChange(field.title, e.target.value)}
                placeholder="••••••••"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[13.5px] border ${
                  error ? 'border-red-500' : 'border-outline-variant/30 focus:border-primary'
                } outline-none transition-all`}
              />
            )}

            {field.fieldType === 'Email' && (
              <input
                type="email"
                value={val}
                onChange={(e) => onChange(field.title, e.target.value)}
                placeholder="user@example.com"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[13.5px] border ${
                  error ? 'border-red-500' : 'border-outline-variant/30 focus:border-primary'
                } outline-none transition-all`}
              />
            )}

            {field.fieldType === 'Date' && (
              <input
                type="date"
                value={val}
                onChange={(e) => onChange(field.title, e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[13.5px] border ${
                  error ? 'border-red-500' : 'border-outline-variant/30 focus:border-primary'
                } outline-none transition-all`}
              />
            )}

            {field.fieldType === 'Dropdown' && (
              <select
                value={val}
                onChange={(e) => onChange(field.title, e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[13.5px] border ${
                  error ? 'border-red-500' : 'border-outline-variant/30 focus:border-primary'
                } outline-none transition-all`}
              >
                <option value="">-- Select {field.title} --</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {field.fieldType === 'Radio' && (
              <div className="flex flex-wrap gap-2 pt-1">
                {options.length > 0 ? (
                  options.map((opt) => (
                    <label
                      key={opt}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                        val === opt
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:bg-surface-container'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`radio-${field.id}`}
                        value={opt}
                        checked={val === opt}
                        onChange={() => onChange(field.title, opt)}
                        className="hidden"
                      />
                      <span>{opt}</span>
                    </label>
                  ))
                ) : (
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => onChange(field.title, e.target.value)}
                    placeholder="Enter choice"
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs"
                  />
                )}
              </div>
            )}

            {field.fieldType === 'Checkbox' && (
              <div className="flex flex-wrap gap-2 pt-1">
                {options.length > 0 ? (
                  options.map((opt) => {
                    const currentArr: string[] = Array.isArray(val)
                      ? val
                      : typeof val === 'string' && val
                      ? val.split(', ')
                      : []
                    const isChecked = currentArr.includes(opt)

                    return (
                      <label
                        key={opt}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-primary/10 text-primary border-primary/40 font-bold'
                            : 'bg-surface-container-low text-on-surface border-outline-variant/30'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              onChange(field.title, [...currentArr, opt].join(', '))
                            } else {
                              onChange(
                                field.title,
                                currentArr.filter((x) => x !== opt).join(', ')
                              )
                            }
                          }}
                          className="w-3.5 h-3.5 accent-primary rounded"
                        />
                        <span>{opt}</span>
                      </label>
                    )
                  })
                ) : (
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={Boolean(val)}
                      onChange={(e) => onChange(field.title, e.target.checked)}
                      className="w-4 h-4 accent-primary rounded"
                    />
                    <span>Yes / Enabled</span>
                  </label>
                )}
              </div>
            )}

            {field.fieldType === 'Textarea' && (
              <textarea
                rows={3}
                value={val}
                onChange={(e) => onChange(field.title, e.target.value)}
                placeholder={`Enter ${field.title}...`}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[13.5px] border ${
                  error ? 'border-red-500' : 'border-outline-variant/30 focus:border-primary'
                } outline-none transition-all resize-none`}
              />
            )}

            {error && <p className="text-red-500 text-[11px] mt-1 font-medium">{error}</p>}
          </div>
        )
      })}
    </div>
  )
}
