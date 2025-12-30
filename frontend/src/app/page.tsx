'use client'

import { useEffect, useState } from 'react'
import { Package, Printer, CircleDot, Plus, Sun, Moon, Monitor, Search, X, Edit2, Trash2, Save } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Material-Liste
const MATERIALS = ['PLA', 'PETG', 'ABS', 'TPU', 'ASA', 'Nylon', 'HIPS', 'PLA+', 'PETG+']

// Beliebte Hersteller
const BRANDS = [
  'Prusament',
  'eSUN',
  'Polymaker',
  'Overture',
  'ColorFabb',
  'Sunlu',
  'Bambu Lab',
  'Hatchbox',
  'MatterHackers',
  'Fillamentum',
  'Custom'
]

// Vorgeschlagene Farben
const PRESET_COLORS = [
  { name: 'Schwarz', hex: '#000000' },
  { name: 'Weiß', hex: '#FFFFFF' },
  { name: 'Rot', hex: '#E74C3C' },
  { name: 'Blau', hex: '#3498DB' },
  { name: 'Grün', hex: '#2ECC71' },
  { name: 'Gelb', hex: '#F1C40F' },
  { name: 'Orange', hex: '#E67E22' },
  { name: 'Lila', hex: '#9B59B6' },
  { name: 'Grau', hex: '#95A5A6' },
  { name: 'Transparent', hex: '#E8F5F5' },
]

type View = 'dashboard' | 'filaments' | 'printers' | 'nozzles'

interface Filament {
  id: string
  brand: string
  material: string
  colorName: string
  colorHex: string
  diameter: number
  totalWeight: number
  remainingWeight: number
  price: number
  purchaseDate: string
  store?: string
  url?: string
  opened: boolean
  openedDate?: string
  location?: string
  notes?: string
}

export default function Home() {
  const [theme, setTheme] = useState('system')
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [stats, setStats] = useState<any>(null)
  const [materials, setMaterials] = useState<any[]>([])
  const [filaments, setFilaments] = useState<Filament[]>([])
  const [filteredFilaments, setFilteredFilaments] = useState<Filament[]>([])
  const [printers, setPrinters] = useState<any[]>([])
  const [nozzles, setNozzles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDark, setIsDark] = useState(false)
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMaterial, setFilterMaterial] = useState('all')
  const [showOnlyUnopened, setShowOnlyUnopened] = useState(false)
  
  // Modal states
  const [showFilamentModal, setShowFilamentModal] = useState(false)
  const [editingFilament, setEditingFilament] = useState<Filament | null>(null)
  
  // Form states
  const [formData, setFormData] = useState({
    brand: '',
    material: 'PLA',
    colorName: '',
    colorHex: '#3498DB',
    diameter: 1.75,
    totalWeight: 1000,
    remainingWeight: 1000,
    price: 20,
    purchaseDate: new Date().toISOString().split('T')[0],
    store: '',
    url: '',
    opened: false,
    openedDate: '',
    location: '',
    notes: '',
  })

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system'
    setTheme(savedTheme)
    updateTheme(savedTheme)
    fetchData()
  }, [])

  useEffect(() => {
    updateTheme(theme)
  }, [theme])

  useEffect(() => {
    applyFilters()
  }, [filaments, searchQuery, filterMaterial, showOnlyUnopened])

  const updateTheme = (newTheme: string) => {
    const root = document.documentElement
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = newTheme === 'dark' || (newTheme === 'system' && prefersDark)
    
    if (shouldBeDark) {
      root.classList.add('dark')
      setIsDark(true)
    } else {
      root.classList.remove('dark')
      setIsDark(false)
    }
  }

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const fetchData = async () => {
    try {
      const [statsRes, materialsRes, filamentsRes, printersRes, nozzlesRes] = await Promise.all([
        fetch(`${API_URL}/dashboard/summary`),
        fetch(`${API_URL}/dashboard/materials`),
        fetch(`${API_URL}/filaments?limit=100`),
        fetch(`${API_URL}/printers`),
        fetch(`${API_URL}/nozzles`),
      ])

      const statsData = await statsRes.json()
      const materialsData = await materialsRes.json()
      const filamentsData = await filamentsRes.json()
      const printersData = await printersRes.json()
      const nozzlesData = await nozzlesRes.json()

      setStats(statsData)
      setMaterials(materialsData)
      setFilaments(filamentsData.data || [])
      setPrinters(printersData)
      setNozzles(nozzlesData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...filaments]

    if (showOnlyUnopened) {
      filtered = filtered.filter(f => !f.opened)
    }

    if (filterMaterial !== 'all') {
      filtered = filtered.filter(f => f.material === filterMaterial)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(f =>
        f.brand.toLowerCase().includes(query) ||
        f.material.toLowerCase().includes(query) ||
        f.colorName.toLowerCase().includes(query) ||
        (f.notes && f.notes.toLowerCase().includes(query))
      )
    }

    setFilteredFilaments(filtered)
  }

  const openAddModal = () => {
    setEditingFilament(null)
    setFormData({
      brand: '',
      material: 'PLA',
      colorName: '',
      colorHex: '#3498DB',
      diameter: 1.75,
      totalWeight: 1000,
      remainingWeight: 1000,
      price: 20,
      purchaseDate: new Date().toISOString().split('T')[0],
      store: '',
      url: '',
      opened: false,
      openedDate: '',
      location: '',
      notes: '',
    })
    setShowFilamentModal(true)
  }

  const openEditModal = (filament: Filament) => {
    setEditingFilament(filament)
    setFormData({
      brand: filament.brand,
      material: filament.material,
      colorName: filament.colorName,
      colorHex: filament.colorHex,
      diameter: filament.diameter,
      totalWeight: filament.totalWeight,
      remainingWeight: filament.remainingWeight,
      price: filament.price,
      purchaseDate: filament.purchaseDate.split('T')[0],
      store: filament.store || '',
      url: filament.url || '',
      opened: filament.opened,
      openedDate: filament.openedDate ? filament.openedDate.split('T')[0] : '',
      location: filament.location || '',
      notes: filament.notes || '',
    })
    setShowFilamentModal(true)
  }

  const handleSaveFilament = async () => {
    try {
      const url = editingFilament
        ? `${API_URL}/filaments/${editingFilament.id}`
        : `${API_URL}/filaments`

      const method = editingFilament ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchData()
        setShowFilamentModal(false)
      }
    } catch (error) {
      console.error('Failed to save filament:', error)
      alert('Fehler beim Speichern!')
    }
  }

  const handleDeleteFilament = async (id: string) => {
    if (!confirm('Filament wirklich löschen?')) return

    try {
      const response = await fetch(`${API_URL}/filaments/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Failed to delete filament:', error)
      alert('Fehler beim Löschen!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Package size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold">PrintStock</h1>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-blue-500 text-white'
                      : isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('filaments')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === 'filaments'
                      ? 'bg-blue-500 text-white'
                      : isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Filamente
                </button>
                <button
                  onClick={() => setCurrentView('printers')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === 'printers'
                      ? 'bg-blue-500 text-white'
                      : isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Drucker
                </button>
                <button
                  onClick={() => setCurrentView('nozzles')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === 'nozzles'
                      ? 'bg-blue-500 text-white'
                      : isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Düsen
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => changeTheme('light')}
                className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'bg-blue-500 text-white' : isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                <Sun size={18} />
              </button>
              <button
                onClick={() => changeTheme('dark')}
                className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-blue-500 text-white' : isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                <Moon size={18} />
              </button>
              <button
                onClick={() => changeTheme('system')}
                className={`p-2 rounded-lg transition-colors ${theme === 'system' ? 'bg-blue-500 text-white' : isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                <Monitor size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* DASHBOARD VIEW */}
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Dashboard</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Gesamt Spulen', value: stats?.totalSpools || 0, icon: Package, color: 'blue' },
                { label: 'Drucker', value: stats?.totalPrinters || 0, icon: Printer, color: 'purple' },
                { label: 'Düsen', value: stats?.totalNozzles || 0, icon: CircleDot, color: 'green' },
                { label: 'Wenig Bestand', value: stats?.lowStockSpools || 0, icon: Package, color: 'red' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-6 transition-transform hover:scale-105`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
                      <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center`}>
                      <stat.icon className={`text-${stat.color}-500`} size={24} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Materials Summary */}
            <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
              <h3 className="text-xl font-bold mb-6">Filamente nach Material</h3>
              <div className="space-y-4">
                {materials.map((mat) => (
                  <div key={mat.material} className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold">{mat.material}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
                        {mat.count} Spulen
                      </span>
                    </div>
                    <div className="flex gap-4 mb-3">
                      <div>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Gewicht</p>
                        <p className="font-semibold">{mat.totalWeight.toFixed(2)} kg</p>
                      </div>
                      <div>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Wert</p>
                        <p className="font-semibold">€{mat.totalValue.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {mat.colors.map((color: string, i: number) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-lg border-2 border-gray-700"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FILAMENTS VIEW */}
        {currentView === 'filaments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Filamente</h2>
              <button
                onClick={openAddModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-all"
              >
                <Plus size={20} />
                Filament hinzufügen
              </button>
            </div>

            {/* Filters */}
            <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-4 flex flex-wrap gap-4`}>
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Suchen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              </div>
              <select
                value={filterMaterial}
                onChange={(e) => setFilterMaterial(e.target.value)}
                className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">Alle Materialien</option>
                {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyUnopened}
                  onChange={(e) => setShowOnlyUnopened(e.target.checked)}
                  className="w-5 h-5 rounded accent-blue-500"
                />
                <span>Nur ungeöffnet</span>
              </label>
            </div>

            {/* Filaments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFilaments.map((fil) => (
                <div key={fil.id} className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl border-2"
                        style={{ backgroundColor: fil.colorHex, borderColor: isDark ? '#374151' : '#e5e7eb' }}
                      />
                      <div>
                        <h3 className="font-bold">{fil.brand}</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {fil.material} - {fil.colorName}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(fil)}
                        className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteFilament(fil.id)}
                        className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} text-red-500`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Gewicht</span>
                      <span className="font-semibold">{fil.remainingWeight}g / {fil.totalWeight}g</span>
                    </div>
                    <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'} overflow-hidden`}>
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${(fil.remainingWeight / fil.totalWeight) * 100}%` }}
                      />
                    </div>
                    {fil.remainingWeight < 300 && (
                      <p className="text-sm text-red-500 font-semibold">⚠ Wenig Bestand</p>
                    )}
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Preis</span>
                      <span>€{fil.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Status</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${fil.opened ? (isDark ? 'bg-yellow-500/20 text-yellow-500' : 'bg-yellow-100 text-yellow-700') : (isDark ? 'bg-green-500/20 text-green-500' : 'bg-green-100 text-green-700')}`}>
                        {fil.opened ? 'Geöffnet' : 'Versiegelt'}
                      </span>
                    </div>
                    {fil.location && (
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Lager</span>
                        <span>{fil.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRINTERS VIEW */}
        {currentView === 'printers' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Drucker</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {printers.map((printer) => (
                <div key={printer.id} className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
                  <div className="flex items-center gap-3 mb-4">
                    <Printer size={24} className="text-blue-500" />
                    <div>
                      <h3 className="text-xl font-bold">{printer.name}</h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{printer.model}</p>
                    </div>
                  </div>
                  {printer.notes && <p className="text-sm mb-2">{printer.notes}</p>}
                  {printer.currentNozzle && (
                    <div className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <p className="text-sm font-semibold">Aktuelle Düse:</p>
                      <p className="text-sm">{printer.currentNozzle.size}mm {printer.currentNozzle.material}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NOZZLES VIEW */}
        {currentView === 'nozzles' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Düsen</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {nozzles.map((nozzle) => (
                <div key={nozzle.id} className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-4`}>
                  <div className="text-center mb-3">
                    <CircleDot size={32} className="mx-auto mb-2 text-blue-500" />
                    <h3 className="text-2xl font-bold">{nozzle.size}mm</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{nozzle.material}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs text-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    {nozzle.condition}
                  </div>
                  {nozzle.notes && (
                    <p className="text-xs mt-2 text-center">{nozzle.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Filament Modal */}
      {showFilamentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="p-6 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-inherit">
              <h3 className="text-2xl font-bold">
                {editingFilament ? 'Filament bearbeiten' : 'Neues Filament'}
              </h3>
              <button
                onClick={() => setShowFilamentModal(false)}
                className="p-2 rounded-lg hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Hersteller */}
              <div>
                <label className="block text-sm font-medium mb-2">Hersteller *</label>
                <select
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Bitte wählen...</option>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                {formData.brand === 'Custom' && (
                  <input
                    type="text"
                    placeholder="Eigener Hersteller"
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className={`w-full mt-2 px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                )}
              </div>

              {/* Material */}
              <div>
                <label className="block text-sm font-medium mb-2">Material *</label>
                <select
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              {/* Farbe */}
              <div>
                <label className="block text-sm font-medium mb-2">Farbe *</label>
                <input
                  type="text"
                  placeholder="z.B. Galaxy Black"
                  value={formData.colorName}
                  onChange={(e) => setFormData({ ...formData, colorName: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-sm font-medium mb-2">Farbcode *</label>
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="color"
                    value={formData.colorHex}
                    onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                    className="w-16 h-16 rounded-lg cursor-pointer border-2"
                  />
                  <input
                    type="text"
                    value={formData.colorHex}
                    onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                    className={`flex-1 px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c.hex}
                      onClick={() => setFormData({ ...formData, colorHex: c.hex, colorName: c.name })}
                      className="w-8 h-8 rounded-lg border-2 hover:scale-110 transition-transform"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Durchmesser */}
              <div>
                <label className="block text-sm font-medium mb-2">Durchmesser (mm) *</label>
                <select
                  value={formData.diameter}
                  onChange={(e) => setFormData({ ...formData, diameter: parseFloat(e.target.value) })}
                  className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="1.75">1.75mm</option>
                  <option value="2.85">2.85mm</option>
                </select>
              </div>

              {/* Gewicht */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Gesamt (g) *</label>
                  <input
                    type="number"
                    value={formData.totalWeight}
                    onChange={(e) => setFormData({ ...formData, totalWeight: parseInt(e.target.value) })}
                    className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Verbleibend (g) *</label>
                  <input
                    type="number"
                    value={formData.remainingWeight}
                    onChange={(e) => setFormData({ ...formData, remainingWeight: parseInt(e.target.value) })}
                    className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              </div>

              {/* Preis */}
              <div>
                <label className="block text-sm font-medium mb-2">Preis (€) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              {/* Kaufdatum */}
              <div>
                <label className="block text-sm font-medium mb-2">Kaufdatum *</label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              {/* Shop */}
              <div>
                <label className="block text-sm font-medium mb-2">Shop</label>
                <input
                  type="text"
                  placeholder="z.B. Amazon, Prusa Store"
                  value={formData.store}
                  onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              {/* Lagerort */}
              <div>
                <label className="block text-sm font-medium mb-2">Lagerort</label>
                <input
                  type="text"
                  placeholder="z.B. Regal A1"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              {/* Geöffnet */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.opened}
                    onChange={(e) => setFormData({ ...formData, opened: e.target.checked })}
                    className="w-5 h-5 rounded accent-blue-500"
                  />
                  <span>Bereits geöffnet</span>
                </label>
              </div>

              {/* Notizen */}
              <div>
                <label className="block text-sm font-medium mb-2">Notizen</label>
                <textarea
                  rows={3}
                  placeholder="Besondere Hinweise..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-800 flex gap-3">
              <button
                onClick={() => setShowFilamentModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} font-medium transition-colors`}
              >
                Abbrechen
              </button>
              <button
                onClick={handleSaveFilament}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Save size={20} />
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
