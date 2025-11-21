import { useQuery } from '@tanstack/react-query'
import { Package, Ruler, Wrench, Grid, Calculator } from 'lucide-react'
import { materialsApi, edgeBandingApi, cncOperationsApi, fittingsApi } from '../lib/api'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { data: materials } = useQuery({
    queryKey: ['materials'],
    queryFn: async () => (await materialsApi.getAll()).data,
  })

  const { data: edgeBanding } = useQuery({
    queryKey: ['edge-banding'],
    queryFn: async () => (await edgeBandingApi.getAll()).data,
  })

  const { data: cncOperations } = useQuery({
    queryKey: ['cnc-operations'],
    queryFn: async () => (await cncOperationsApi.getAll()).data,
  })

  const { data: fittings } = useQuery({
    queryKey: ['fittings'],
    queryFn: async () => (await fittingsApi.getAll()).data,
  })

  const stats = [
    {
      name: 'Materials',
      value: materials?.filter(m => m.isActive).length || 0,
      total: materials?.length || 0,
      icon: Package,
      color: 'bg-blue-600',
    },
    {
      name: 'Edge Banding',
      value: edgeBanding?.filter(e => e.isActive).length || 0,
      total: edgeBanding?.length || 0,
      icon: Ruler,
      color: 'bg-green-600',
    },
    {
      name: 'CNC Operations',
      value: cncOperations?.filter(c => c.isActive).length || 0,
      total: cncOperations?.length || 0,
      icon: Wrench,
      color: 'bg-purple-600',
    },
    {
      name: 'Fittings',
      value: fittings?.filter(f => f.isActive).length || 0,
      total: fittings?.length || 0,
      icon: Grid,
      color: 'bg-orange-600',
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Featured: Cost Calculator */}
      <Link
        to="/calculator"
        className="block mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-lg">
              <Calculator className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Cost Calculator</h2>
              <p className="text-blue-100">Upload CSV files and calculate project costs instantly</p>
            </div>
          </div>
          <div className="text-white text-3xl">→</div>
        </div>
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="bg-gray-900 rounded-lg border border-gray-800 p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm text-gray-400">
                  {stat.value} active / {stat.total} total
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-100">{stat.name}</h3>
              <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-8 bg-gray-900 rounded-lg border border-gray-800 p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/calculator"
            className="bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 p-4 rounded-lg border-2 border-blue-500 hover:border-blue-400 transition-all"
          >
            <Calculator className="h-6 w-6 text-white mb-2" />
            <p className="font-medium text-white">Cost Calculator</p>
            <p className="text-sm text-blue-100 mt-1">Calculate project costs</p>
          </Link>
          <a
            href="/materials"
            className="bg-gray-800 hover:bg-gray-750 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-all"
          >
            <Package className="h-6 w-6 text-blue-500 mb-2" />
            <p className="font-medium">Manage Materials</p>
            <p className="text-sm text-gray-400 mt-1">Add or edit materials</p>
          </a>
          <a
            href="/edge-banding"
            className="bg-gray-800 hover:bg-gray-750 p-4 rounded-lg border border-gray-700 hover:border-green-500 transition-all"
          >
            <Ruler className="h-6 w-6 text-green-500 mb-2" />
            <p className="font-medium">Manage Edge Banding</p>
            <p className="text-sm text-gray-400 mt-1">Configure edge types</p>
          </a>
          <a
            href="/cnc-operations"
            className="bg-gray-800 hover:bg-gray-750 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-all"
          >
            <Wrench className="h-6 w-6 text-purple-500 mb-2" />
            <p className="font-medium">CNC Operations</p>
            <p className="text-sm text-gray-400 mt-1">Set operation prices</p>
          </a>
        </div>
      </div>

      <div className="mt-8 bg-blue-900/20 border border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">System Information</h3>
        <p className="text-gray-400 text-sm">
          LexaCut Cost Calculation API is running. All pricing data is stored in PostgreSQL database.
          Changes made here will immediately affect calculation results.
        </p>
      </div>
    </div>
  )
}

