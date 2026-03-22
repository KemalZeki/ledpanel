export function Input({ label, required, ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>}
      <input {...props} className={`w-full px-3 py-2.5 bg-[#0f172a] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-sky-500/50 transition-colors ${props.className || ''}`} />
    </div>
  )
}

export function Select({ label, required, options = [], children, ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>}
      <select {...props} className={`w-full px-3 py-2.5 bg-[#0f172a] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-sky-500/50 transition-colors appearance-none ${props.className || ''}`}>
        {children || options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

export function Textarea({ label, required, ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>}
      <textarea {...props} className={`w-full px-3 py-2.5 bg-[#0f172a] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-sky-500/50 transition-colors resize-none ${props.className || ''}`} />
    </div>
  )
}

export function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-sky-500' : 'bg-gray-600'}`} onClick={() => onChange(!checked)}>
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </div>
      {label && <span className="text-sm text-gray-300">{label}</span>}
    </label>
  )
}
