import { useState, useRef, useEffect } from 'react'
import * as LucideIcons from 'lucide-react'
import { Search, X } from 'lucide-react'

const ICON_LIST = [
  'Monitor', 'Music', 'Building2', 'Presentation', 'PartyPopper', 'Megaphone', 'Tv',
  'Camera', 'Film', 'Mic', 'Speaker', 'Lightbulb', 'Zap', 'Star', 'Heart', 'Award',
  'Target', 'Briefcase', 'Globe', 'Shield', 'Wrench', 'Settings', 'Palette', 'Layers',
  'Grid3X3', 'Box', 'Package', 'Truck', 'MapPin', 'Phone', 'Mail', 'MessageCircle',
  'Users', 'User', 'Calendar', 'Clock', 'Bell', 'Flag', 'Bookmark', 'Tag', 'Hash',
  'Eye', 'Play', 'Volume2', 'Radio', 'Wifi', 'Signal', 'Database', 'Server', 'Cloud',
  'Download', 'Upload', 'Share2', 'Link', 'ChevronRight', 'ArrowRight', 'Check',
  'Plus', 'Minus', 'Info', 'AlertTriangle', 'HelpCircle', 'CircleDot', 'Sparkles',
  'Sun', 'Moon', 'Flame', 'Droplets', 'Wind', 'Mountain', 'Trees', 'Gem',
  'Crown', 'Trophy', 'Medal', 'Rocket', 'Plane', 'Car', 'Headphones',
  'Gamepad2', 'Clapperboard', 'Projector', 'ScreenShare', 'Cast', 'Podcast',
  'PartyPopper', 'Gift', 'Cake', 'GraduationCap', 'Store', 'ShoppingBag',
  'CreditCard', 'Banknote', 'BarChart3', 'PieChart', 'TrendingUp', 'Activity',
  'Cpu', 'Smartphone', 'Tablet', 'Laptop', 'LayoutGrid', 'Image', 'Video',
  'AudioLines', 'Focus', 'Scan', 'QrCode', 'Fingerprint', 'Lock', 'Unlock',
]

const uniqueIcons = [...new Set(ICON_LIST)]

export default function IconPicker({ value, onChange, label = 'İkon' }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const panelRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const filtered = uniqueIcons.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  )

  const SelectedIcon = value ? LucideIcons[value] : null

  return (
    <div className="space-y-1.5" ref={panelRef}>
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-3 py-2.5 bg-[#0f172a] border border-white/10 rounded-xl text-left hover:border-sky-500/30 transition-colors"
      >
        {SelectedIcon ? (
          <span className="w-8 h-8 flex items-center justify-center bg-sky-500/10 rounded-lg">
            <SelectedIcon className="w-5 h-5 text-sky-400" />
          </span>
        ) : (
          <span className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg">
            <LucideIcons.MousePointerClick className="w-5 h-5 text-gray-500" />
          </span>
        )}
        <span className={`flex-1 text-sm ${value ? 'text-white' : 'text-gray-500'}`}>
          {value || 'İkon seçin...'}
        </span>
        {value && (
          <span
            onClick={(e) => { e.stopPropagation(); onChange(''); }}
            className="p-1 rounded hover:bg-white/10 text-gray-500 hover:text-red-400"
          >
            <X className="w-3.5 h-3.5" />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-[340px] bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="İkon ara..."
                className="w-full pl-9 pr-3 py-2 bg-[#0f172a] border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50"
                autoFocus
              />
            </div>
          </div>
          <div className="grid grid-cols-8 gap-1 p-3 max-h-[280px] overflow-y-auto">
            {filtered.map((name) => {
              const Icon = LucideIcons[name]
              if (!Icon) return null
              const isActive = value === name
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => { onChange(name); setOpen(false); setSearch(''); }}
                  title={name}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all
                    ${isActive
                      ? 'bg-sky-500 text-white ring-2 ring-sky-400'
                      : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </button>
              )
            })}
            {filtered.length === 0 && (
              <p className="col-span-8 text-center text-gray-500 py-4 text-xs">Sonuç bulunamadı</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
