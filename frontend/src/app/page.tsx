'use client'

import { useEffect, useState } from 'react'
import { Package, Printer, CircleDot, Plus, Sun, Moon, Monitor, X, Edit2, Trash2, Save, Menu, Euro, Weight } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const MATERIALS = ['PLA', 'PETG', 'ABS', 'TPU', 'ASA', 'Nylon', 'HIPS', 'PLA+', 'PETG+']
const BRANDS = ['Prusament', 'eSUN', 'Polymaker', 'Overture', 'ColorFabb', 'Sunlu', 'Bambu Lab', 'Hatchbox', 'Andere']
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

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [stats, setStats] = useState<any>(null)
  const [materials, setMaterials] = useState<any[]>([])
  const [filaments, setFilaments] = useState<any[]>([])
  const [filteredFilaments, setFilteredFilaments] = useState<any[]>([])
  const [printers, setPrinters] = useState<any[]>([])
  const [nozzles, setNozzles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [filterMaterial, setFilterMaterial] = useState('all')
  const [showOnlyUnopened, setShowOnlyUnopened] = useState(false)

  const [showFilamentModal, setShowFilamentModal] = useState(false)
  const [showPrinterModal, setShowPrinterModal] = useState(false)
  const [showNozzleModal, setShowNozzleModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  const [filamentForm, setFilamentForm] = useState({
    brand: '',
    material: 'PLA',
    colorName: '',
    colorHex: '#00ae42',
    diameter: 1.75,
    totalWeight: 1000,
    remainingWeight: 1000,
    price: 20,
    purchaseDate: new Date().toISOString().split('T')[0],
    store: '',
    url: '',
    opened: false,
    location: '',
    notes: '',
  })

  const [printerForm, setPrinterForm] = useState({
    name: '',
    model: '',
    notes: '',
  })

  const [nozzleForm, setNozzleForm] = useState({
    size: 0.4,
    material: 'Brass',
    condition: 'New',
    notes: '',
  })

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as any) || 'system'
    setTheme(savedTheme)
    updateTheme(savedTheme)
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    updateTheme(theme)
  }, [theme])

  useEffect(() => {
    applyFilters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filaments, searchQuery, filterMaterial, showOnlyUnopened])

  const updateTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = newTheme === 'dark' || (newTheme === 'system' && prefersDark)

    if (shouldBeDark) root.classList.add('dark')
    else root.classList.remove('dark')
  }

  const changeTheme = (newTheme: 'light' | 'dark' | 'system') => {
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
    if (showOnlyUnopened) filtered = filtered.filter((f) => !f.opened)
    if (filterMaterial !== 'all') filtered = filtered.filter((f) => f.material === filterMaterial)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((f) =>
        (f.brand || '').toLowerCase().includes(query) ||
        (f.material || '').toLowerCase().includes(query) ||
        (f.colorName || '').toLowerCase().includes(query),
      )
    }
    setFilteredFilaments(filtered)
  }

  // Filament CRUD
  const openAddFilament = () => {
    setEditingItem(null)
    setFilamentForm({
      brand: '',
      material: 'PLA',
      colorName: '',
      colorHex: '#00ae42',
      diameter: 1.75,
      totalWeight: 1000,
      remainingWeight: 1000,
      price: 20,
      purchaseDate: new Date().toISOString().split('T')[0],
      store: '',
      url: '',
      opened: false,
      location: '',
      notes: '',
    })
    setShowFilamentModal(true)
  }

  const saveFilament = async () => {
    if (!filamentForm.brand || !filamentForm.colorName) {
      alert('Bitte Hersteller und Farbe ausfüllen!')
      return
    }

    try {
      const url = editingItem ? `${API_URL}/filaments/${editingItem.id}` : `${API_URL}/filaments`
      const method = editingItem ? 'PATCH' : 'POST'

      // ✅ Meta-Felder droppen + Datum Prisma-kompatibel machen
      const { id, createdAt, updatedAt, usages, ...payload } = (filamentForm as any) ?? {}
      if (payload.purchaseDate && /^\d{4}-\d{2}-\d{2}$/.test(payload.purchaseDate)) {
        payload.purchaseDate = `${payload.purchaseDate}T00:00:00.000Z`
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        await fetchData()
        setShowFilamentModal(false)
      } else {
        const error = await response.json().catch(() => ({}))
        alert('Fehler: ' + (error.message || 'Speichern fehlgeschlagen'))
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Fehler beim Speichern!')
    }
  }

  const deleteFilament = async (id: string) => {
    if (!confirm('Wirklich löschen?')) return
    try {
      await fetch(`${API_URL}/filaments/${id}`, { method: 'DELETE' })
      await fetchData()
    } catch {
      alert('Fehler beim Löschen!')
    }
  }

  // Printer CRUD
  const openAddPrinter = () => {
    setEditingItem(null)
    setPrinterForm({ name: '', model: '', notes: '' })
    setShowPrinterModal(true)
  }

  const savePrinter = async () => {
    if (!printerForm.name || !printerForm.model) {
      alert('Bitte Name und Modell ausfüllen!')
      return
    }

    try {
      const url = editingItem ? `${API_URL}/printers/${editingItem.id}` : `${API_URL}/printers`
      const method = editingItem ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(printerForm),
      })

      if (response.ok) {
        await fetchData()
        setShowPrinterModal(false)
      }
    } catch {
      alert('Fehler beim Speichern!')
    }
  }

  const deletePrinter = async (id: string) => {
    if (!confirm('Wirklich löschen?')) return
    try {
      await fetch(`${API_URL}/printers/${id}`, { method: 'DELETE' })
      await fetchData()
    } catch {
      alert('Fehler beim Löschen!')
    }
  }

  // Nozzle CRUD
  const openAddNozzle = () => {
    setEditingItem(null)
    setNozzleForm({ size: 0.4, material: 'Brass', condition: 'New', notes: '' })
    setShowNozzleModal(true)
  }

  const saveNozzle = async () => {
    try {
      const url = editingItem ? `${API_URL}/nozzles/${editingItem.id}` : `${API_URL}/nozzles`
      const method = editingItem ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nozzleForm),
      })

      if (response.ok) {
        await fetchData()
        setShowNozzleModal(false)
      }
    } catch {
      alert('Fehler beim Speichern!')
    }
  }

  const deleteNozzle = async (id: string) => {
    if (!confirm('Wirklich löschen?')) return
    try {
      await fetch(`${API_URL}/nozzles/${id}`, { method: 'DELETE' })
      await fetchData()
    } catch {
      alert('Fehler beim Löschen!')
    }
  }

  const totalCost = filaments.reduce((sum, f) => sum + (Number(f.price) || 0), 0)
  const totalWeight = filaments.reduce((sum, f) => sum + (Number(f.remainingWeight) || 0), 0) / 1000

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="PrintStock Logo"
                className="w-10 h-10 md:w-11 md:h-11 rounded-lg object-contain"
              />
              <h1 className="text-xl md:text-2xl font-bold">PrintStock</h1>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-2">
              {[
                { view: 'dashboard', label: 'Dashboard' },
                { view: 'filaments', label: 'Filamente' },
                { view: 'printers', label: 'Drucker' },
                { view: 'nozzles', label: 'Düsen' },
              ].map((item) => {
                const active = currentView === item.view
                return (
                  <button
                    key={item.view}
                    onClick={() => setCurrentView(item.view as View)}
                    className={[
                      'px-4 py-2 rounded-lg font-medium transition-colors',
                      active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted',
                    ].join(' ')}
                  >
                    {item.label}
                  </button>
                )
              })}
            </nav>

            <div className="flex items-center gap-2">
              {/* Theme Buttons */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => changeTheme('light')}
                  className={['p-2 rounded-lg border border-border', theme === 'light' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'].join(' ')}
                  aria-label="Light"
                >
                  <Sun size={18} />
                </button>
                <button
                  onClick={() => changeTheme('dark')}
                  className={['p-2 rounded-lg border border-border', theme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'].join(' ')}
                  aria-label="Dark"
                >
                  <Moon size={18} />
                </button>
                <button
                  onClick={() => changeTheme('system')}
                  className={['p-2 rounded-lg border border-border', theme === 'system' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'].join(' ')}
                  aria-label="System"
                >
                  <Monitor size={18} />
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg border border-border bg-muted hover:bg-muted/80"
                aria-label="Menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 space-y-2">
              {[
                { view: 'dashboard', label: 'Dashboard' },
                { view: 'filaments', label: 'Filamente' },
                { view: 'printers', label: 'Drucker' },
                { view: 'nozzles', label: 'Düsen' },
              ].map((item) => {
                const active = currentView === item.view
                return (
                  <button
                    key={item.view}
                    onClick={() => {
                      setCurrentView(item.view as View)
                      setMobileMenuOpen(false)
                    }}
                    className={[
                      'w-full px-4 py-3 rounded-lg font-medium text-left transition-colors',
                      active ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80',
                    ].join(' ')}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* DASHBOARD */}
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">Dashboard</h2>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[
                { label: 'Gesamt Spulen', value: stats?.totalSpools || 0, icon: Package },
                { label: 'Drucker', value: stats?.totalPrinters || 0, icon: Printer },
                { label: 'Düsen', value: stats?.totalNozzles || 0, icon: CircleDot },
                { label: 'Wenig Bestand', value: stats?.lowStockSpools || 0, icon: Package },
                { label: 'Gesamtkosten', value: `€${totalCost.toFixed(2)}`, icon: Euro },
                { label: 'Gesamt Gewicht', value: `${totalWeight.toFixed(2)} kg`, icon: Weight },
              ].map((stat, i) => (
                <div key={i} className="card p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-xl md:text-3xl font-bold mt-1 md:mt-2">{stat.value}</p>
                    </div>
                    <stat.icon className="text-primary" size={24} />
                  </div>
                </div>
              ))}
            </div>

            {/* Materials */}
            <div className="card p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Filamente nach Material</h3>
              <div className="space-y-4">
                {materials.map((mat) => (
                  <div key={mat.material} className="rounded-xl border border-border bg-muted p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-base md:text-lg font-semibold">{mat.material}</h4>
                      <span className="px-3 py-1 rounded-full text-xs md:text-sm border border-border bg-surface">
                        {mat.count} Spulen
                      </span>
                    </div>
                    <div className="flex gap-4 mb-3 text-sm md:text-base">
                      <div>
                        <p className="text-muted-foreground">Gewicht</p>
                        <p className="font-semibold">{mat.totalWeight.toFixed(2)} kg</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Wert</p>
                        <p className="font-semibold">€{mat.totalValue.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {mat.colors.map((color: string, idx: number) => (
                        <div key={idx} className="w-6 h-6 md:w-8 md:h-8 rounded-lg border border-border" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FILAMENTS */}
        {currentView === 'filaments' && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold">Filamente</h2>
              <button onClick={openAddFilament} className="btn-primary px-3 py-2 md:px-4 md:py-2 flex items-center gap-2 text-sm md:text-base">
                <Plus size={20} />
                <span className="hidden sm:inline">Hinzufügen</span>
              </button>
            </div>

            {/* Filters */}
            <div className="card p-4 space-y-3">
              <input
                type="text"
                placeholder="Suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input"
              />

              <div className="flex flex-wrap gap-2">
                <select
                  value={filterMaterial}
                  onChange={(e) => setFilterMaterial(e.target.value)}
                  className="select flex-1 min-w-[150px]"
                >
                  <option value="all">Alle Materialien</option>
                  {MATERIALS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>

                <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlyUnopened}
                    onChange={(e) => setShowOnlyUnopened(e.target.checked)}
                    className="w-4 h-4 accent-[rgb(var(--primary))]"
                  />
                  <span className="text-sm text-foreground">Ungeöffnet</span>
                </label>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredFilaments.map((fil) => (
                <div key={fil.id} className="card p-4 md:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-border" style={{ backgroundColor: fil.colorHex }} />
                      <div>
                        <h3 className="font-bold text-sm md:text-base">{fil.brand}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {fil.material} - {fil.colorName}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          const { id, createdAt, updatedAt, usages, ...clean } = fil
                          setEditingItem({ id })
                          setFilamentForm(clean)
                          setShowFilamentModal(true)
                        }}
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
                        aria-label="Edit"
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        onClick={() => deleteFilament(fil.id)}
                        className="p-2 rounded-lg hover:bg-muted text-red-500"
                        aria-label="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Gewicht</span>
                      <span className="font-semibold">{fil.remainingWeight}g / {fil.totalWeight}g</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-muted border border-border overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(fil.remainingWeight / fil.totalWeight) * 100}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Preis</span>
                      <span>€{fil.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRINTERS */}
        {currentView === 'printers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold">Drucker</h2>
              <button onClick={openAddPrinter} className="btn-primary px-3 py-2 md:px-4 md:py-2 flex items-center gap-2">
                <Plus size={20} />
                <span className="hidden sm:inline">Hinzufügen</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {printers.map((printer) => (
                <div key={printer.id} className="card p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Printer size={24} className="text-primary" />
                      <div>
                        <h3 className="text-xl font-bold">{printer.name}</h3>
                        <p className="text-sm text-muted-foreground">{printer.model}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingItem(printer); setPrinterForm(printer); setShowPrinterModal(true) }} className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deletePrinter(printer.id)} className="p-2 rounded-lg hover:bg-muted text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  {printer.notes && <p className="mt-4 text-sm text-foreground">{printer.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NOZZLES */}
        {currentView === 'nozzles' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold">Düsen</h2>
              <button onClick={openAddNozzle} className="btn-primary px-3 py-2 md:px-4 md:py-2 flex items-center gap-2">
                <Plus size={20} />
                <span className="hidden sm:inline">Hinzufügen</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {nozzles.map((nozzle) => (
                <div key={nozzle.id} className="card p-4 text-center relative">
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button onClick={() => { setEditingItem(nozzle); setNozzleForm(nozzle); setShowNozzleModal(true) }} className="p-1 rounded hover:bg-muted text-muted-foreground">
                      <Edit2 size={12} />
                    </button>
                    <button onClick={() => deleteNozzle(nozzle.id)} className="p-1 rounded hover:bg-muted text-red-500">
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <CircleDot size={32} className="mx-auto mb-2 text-primary" />
                  <h3 className="text-2xl font-bold">{nozzle.size}mm</h3>
                  <p className="text-sm text-muted-foreground">{nozzle.material}</p>
                  <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs border border-border bg-muted">
                    {nozzle.condition}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FILAMENT MODAL */}
      {showFilamentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6 border-b border-border flex items-center justify-between sticky top-0 bg-surface/90 backdrop-blur">
              <h3 className="text-xl md:text-2xl font-bold">{editingItem ? 'Bearbeiten' : 'Neues Filament'}</h3>
              <button onClick={() => setShowFilamentModal(false)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Hersteller *</label>
                  <select value={filamentForm.brand} onChange={(e) => setFilamentForm({ ...filamentForm, brand: e.target.value })} className="select">
                    <option value="">Wählen...</option>
                    {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Material *</label>
                  <select value={filamentForm.material} onChange={(e) => setFilamentForm({ ...filamentForm, material: e.target.value })} className="select">
                    {MATERIALS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Farbe *</label>
                  <input type="text" value={filamentForm.colorName} onChange={(e) => setFilamentForm({ ...filamentForm, colorName: e.target.value })} className="input" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Farbcode</label>
                  <div className="flex gap-2">
                    <input type="color" value={filamentForm.colorHex} onChange={(e) => setFilamentForm({ ...filamentForm, colorHex: e.target.value })} className="w-16 h-10 rounded cursor-pointer border border-border bg-muted" />
                    <input type="text" value={filamentForm.colorHex} onChange={(e) => setFilamentForm({ ...filamentForm, colorHex: e.target.value })} className="input" />
                  </div>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => setFilamentForm({ ...filamentForm, colorHex: c.hex })}
                        className="w-6 h-6 rounded border border-border"
                        style={{ backgroundColor: c.hex }}
                        aria-label={c.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Durchmesser</label>
                  <select value={filamentForm.diameter} onChange={(e) => setFilamentForm({ ...filamentForm, diameter: parseFloat(e.target.value) })} className="select">
                    <option value="1.75">1.75mm</option>
                    <option value="2.85">2.85mm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Preis (€)</label>
                  <input type="number" step="0.01" value={filamentForm.price} onChange={(e) => setFilamentForm({ ...filamentForm, price: parseFloat(e.target.value) })} className="input" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Gesamt (g)</label>
                  <input type="number" value={filamentForm.totalWeight} onChange={(e) => setFilamentForm({ ...filamentForm, totalWeight: parseInt(e.target.value) })} className="input" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Verbleibend (g)</label>
                  <input type="number" value={filamentForm.remainingWeight} onChange={(e) => setFilamentForm({ ...filamentForm, remainingWeight: parseInt(e.target.value) })} className="input" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Lagerort</label>
                  <input type="text" value={filamentForm.location} onChange={(e) => setFilamentForm({ ...filamentForm, location: e.target.value })} className="input" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Shop</label>
                  <input type="text" value={filamentForm.store} onChange={(e) => setFilamentForm({ ...filamentForm, store: e.target.value })} className="input" />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filamentForm.opened}
                  onChange={(e) => setFilamentForm({ ...filamentForm, opened: e.target.checked })}
                  className="w-5 h-5 accent-[rgb(var(--primary))]"
                />
                <span className="text-foreground">Geöffnet</span>
              </label>
            </div>

            <div className="p-4 md:p-6 border-t border-border flex gap-3">
              <button onClick={() => setShowFilamentModal(false)} className="flex-1 btn-ghost bg-muted border border-border">
                Abbrechen
              </button>
              <button onClick={saveFilament} className="flex-1 btn-primary flex items-center justify-center gap-2">
                <Save size={20} />
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINTER MODAL */}
      {showPrinterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-2xl font-bold">{editingItem ? 'Bearbeiten' : 'Neuer Drucker'}</h3>
              <button onClick={() => setShowPrinterModal(false)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input type="text" value={printerForm.name} onChange={(e) => setPrinterForm({ ...printerForm, name: e.target.value })} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Modell *</label>
                <input type="text" value={printerForm.model} onChange={(e) => setPrinterForm({ ...printerForm, model: e.target.value })} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Notizen</label>
                <textarea rows={3} value={printerForm.notes} onChange={(e) => setPrinterForm({ ...printerForm, notes: e.target.value })} className="input" />
              </div>
            </div>
            <div className="p-6 border-t border-border flex gap-3">
              <button onClick={() => setShowPrinterModal(false)} className="flex-1 btn-ghost bg-muted border border-border">Abbrechen</button>
              <button onClick={savePrinter} className="flex-1 btn-primary flex items-center justify-center gap-2">
                <Save size={20} />
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOZZLE MODAL */}
      {showNozzleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-2xl font-bold">{editingItem ? 'Bearbeiten' : 'Neue Düse'}</h3>
              <button onClick={() => setShowNozzleModal(false)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Größe (mm)</label>
                <select value={nozzleForm.size} onChange={(e) => setNozzleForm({ ...nozzleForm, size: parseFloat(e.target.value) })} className="select">
                  <option value="0.2">0.2mm</option>
                  <option value="0.3">0.3mm</option>
                  <option value="0.4">0.4mm</option>
                  <option value="0.6">0.6mm</option>
                  <option value="0.8">0.8mm</option>
                  <option value="1.0">1.0mm</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Material</label>
                <select value={nozzleForm.material} onChange={(e) => setNozzleForm({ ...nozzleForm, material: e.target.value })} className="select">
                  <option value="Brass">Brass</option>
                  <option value="Hardened Steel">Hardened Steel</option>
                  <option value="Stainless Steel">Stainless Steel</option>
                  <option value="Ruby">Ruby</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Zustand</label>
                <select value={nozzleForm.condition} onChange={(e) => setNozzleForm({ ...nozzleForm, condition: e.target.value })} className="select">
                  <option value="New">Neu</option>
                  <option value="Used">Benutzt</option>
                  <option value="Worn">Abgenutzt</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Notizen</label>
                <textarea rows={2} value={nozzleForm.notes} onChange={(e) => setNozzleForm({ ...nozzleForm, notes: e.target.value })} className="input" />
              </div>
            </div>
            <div className="p-6 border-t border-border flex gap-3">
              <button onClick={() => setShowNozzleModal(false)} className="flex-1 btn-ghost bg-muted border border-border">Abbrechen</button>
              <button onClick={saveNozzle} className="flex-1 btn-primary flex items-center justify-center gap-2">
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
