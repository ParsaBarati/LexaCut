import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Package, Ruler, Wrench, Settings, Grid, Moon, Calculator } from 'lucide-react'
import Materials from './pages/Materials'
import EdgeBanding from './pages/EdgeBanding'
import CNCOperations from './pages/CNCOperations'
import Fittings from './pages/Fittings'
import PricingSettings from './pages/PricingSettings'
import Dashboard from './pages/Dashboard'
import CalculatorPage from './pages/Calculator'

function App() {
  const location = useLocation()
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Grid },
    { name: 'Calculator', href: '/calculator', icon: Calculator },
    { name: 'Materials', href: '/materials', icon: Package },
    { name: 'Edge Banding', href: '/edge-banding', icon: Ruler },
    { name: 'CNC Operations', href: '/cnc-operations', icon: Wrench },
    { name: 'Fittings', href: '/fittings', icon: Grid },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 dark">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800">
        <div className="flex items-center gap-2 h-16 px-6 border-b border-gray-800">
          <Moon className="h-6 w-6 text-blue-500" />
          <span className="text-xl font-bold">LexaCut Admin</span>
        </div>
        
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <div className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/edge-banding" element={<EdgeBanding />} />
            <Route path="/cnc-operations" element={<CNCOperations />} />
            <Route path="/fittings" element={<Fittings />} />
            <Route path="/settings" element={<PricingSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
