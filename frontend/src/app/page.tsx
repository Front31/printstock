'use client'

import { useEffect, useState } from 'react'
import { Package, Printer, CircleDot, Plus, Sun, Moon, Monitor, Search } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function Home() {
  const [theme, setTheme] = useState('system')
  const [stats, setStats] = useState<any>(null)
  const [materials, setMaterials] = useState<any[]>([])
  const [filaments, setFilaments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system'
    setTheme(savedTheme)
    applyTheme(savedTheme)
    fetchData()
  }, [])

  const applyTheme = (newTheme: string) => {
    const root = document.documentElement
    if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  const fetchData = async () => {
    try {
      const [statsRes, materialsRes, filamentsRes] = await Promise.all([
        fetch(`${API_URL}/dashboard/summary`),
        fetch(`${API_URL}/dashboard/materials`),
        fetch(`${API_URL}/filaments?limit=10`),
      ])

      const statsData = await statsRes.json()
      const materialsData = await materialsRes.json()
      const filamentsData = await filamentsRes.json()

      setStats(statsData)
      setMaterials(materialsData)
      setFilaments(filamentsData.data || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Package size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold">PrintStock</h1>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-6 mb-8`}>
          <h2 className="text-xl font-bold mb-6">Filamente nach Material</h2>
          <div className="space-y-4">
            {materials.map((mat) => (
              <div key={mat.material} className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">{mat.material}</h3>
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
                      title={color}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Filaments */}
        <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
          <h2 className="text-xl font-bold mb-6">Aktuelle Filamente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filaments.map((fil) => (
              <div
                key={fil.id}
                className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-lg border-2"
                    style={{ backgroundColor: fil.colorHex, borderColor: isDark ? '#374151' : '#e5e7eb' }}
                  />
                  <div>
                    <h3 className="font-bold">{fil.brand}</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {fil.material} - {fil.colorName}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Gewicht</span>
                    <span className="font-semibold">
                      {fil.remainingWeight}g / {fil.totalWeight}g
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${(fil.remainingWeight / fil.totalWeight) * 100}%` }}
                    />
                  </div>
                  {fil.remainingWeight < 300 && (
                    <p className="text-sm text-red-500 font-semibold">⚠ Wenig Bestand</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
            PrintStock v1.0 - 3D Druck Inventarverwaltung
          </p>
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
            API: {API_URL}
          </p>
        </div>
      </main>
    </div>
  )
}
