import { useState, useRef } from 'react'
import { Upload, Calculator as CalcIcon, FileText, ChevronDown, ChevronUp, Package, X, Wrench, Ruler, Grid, Edit2, Save, XCircle } from 'lucide-react'

interface ProjectData {
  projectName: string
  clientName: string
  contractDate: string
  wastePercentage: number
}

interface CalculationResult {
  project: {
    name: string
    client: string
    date: string
  }
  costs: {
    material: { totalCost: number; items: any[] }
    boreshKari: { totalCost: number }
    cnc: { totalCost: number }
    navarShiar: { totalCost: number }
    fittings: { totalCost: number }
    painting: { totalCost: number }
    plate: { totalCost: number }
    woodTools: { totalCost: number }
  }
  financialSummary: {
    subtotal: number
    overheads: {
      overhead1: number
      overhead2: number
      overhead3: number
      overhead4: number
      contingency: number
      totalOverheads: number
    }
    totalWithOverheads: number
    profitAmount: number
    finalPrice: number
    breakdown: any
  }
}

export default function Calculator() {
  const [file, setFile] = useState<File | null>(null)
  const [importFormat, setImportFormat] = useState<'auto' | 'lexacut' | 'legacy'>('auto')
  const [projectData, setProjectData] = useState<ProjectData>({
    projectName: '',
    clientName: '',
    contractDate: new Date().toISOString().split('T')[0],
    wastePercentage: 0.15,
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showJson, setShowJson] = useState(false)
  const [showMaterialBreakdown, setShowMaterialBreakdown] = useState(false)
  const [showCNCBreakdown, setShowCNCBreakdown] = useState(false)
  const [showEdgeBandingBreakdown, setShowEdgeBandingBreakdown] = useState(false)
  const [showFittingsBreakdown, setShowFittingsBreakdown] = useState(false)
  const [editingItem, setEditingItem] = useState<{type: string, id?: string, code: string, currentPrice: number} | null>(null)
  const [editPrice, setEditPrice] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [needsRecalculation, setNeedsRecalculation] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) {
      setError('Please select a CSV file')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('projectData', JSON.stringify(projectData))
    formData.append('importFormat', importFormat)

    try {
      const response = await fetch('http://localhost:4492/api/v1/calculate/csv', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Calculation failed')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' Rial'
  }

  const handleEditPrice = (type: string, id: string | undefined, code: string, currentPrice: number) => {
    setEditingItem({ type, id, code, currentPrice })
    setEditPrice(currentPrice.toString())
  }

  const handleSavePrice = async () => {
    if (!editingItem) return

    setSaving(true)
    try {
      const newPrice = parseFloat(editPrice)
      if (isNaN(newPrice) || newPrice < 0) {
        alert('Please enter a valid price')
        setSaving(false)
        return
      }

      let endpoint = ''
      let lookupEndpoint = ''
      let updateData: any = { unitPrice: newPrice }

      // If we have an ID, use it directly
      if (editingItem.id) {
        switch (editingItem.type) {
          case 'material':
            endpoint = `http://localhost:4492/api/v1/materials/${editingItem.id}`
            break
          case 'cnc':
            endpoint = `http://localhost:4492/api/v1/cnc-operations/${editingItem.id}`
            break
          case 'edgeBanding':
            endpoint = `http://localhost:4492/api/v1/edge-banding/${editingItem.id}`
            break
          case 'fitting':
            endpoint = `http://localhost:4492/api/v1/fittings/${editingItem.id}`
            break
        }

        const response = await fetch(endpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to update price')
        }

        setEditingItem(null)
        setNeedsRecalculation(true)
        alert(`✅ Price updated successfully!\n\nItem: ${editingItem.code}\nOld Price: ${formatCurrency(editingItem.currentPrice)}\nNew Price: ${formatCurrency(newPrice)}\n\nUpload your file and click "Calculate Cost" again to see updated results.`)
        setSaving(false)
        return
      }

      // Otherwise, lookup by CODE only
      switch (editingItem.type) {
        case 'material':
          lookupEndpoint = `http://localhost:4492/api/v1/materials`
          break
        case 'cnc':
          lookupEndpoint = `http://localhost:4492/api/v1/cnc-operations`
          break
        case 'edgeBanding':
          lookupEndpoint = `http://localhost:4492/api/v1/edge-banding`
          break
        case 'fitting':
          lookupEndpoint = `http://localhost:4492/api/v1/fittings`
          break
        default:
          setSaving(false)
          return
      }

      const fetchResponse = await fetch(lookupEndpoint)
      if (!fetchResponse.ok) {
        throw new Error('Failed to fetch items')
      }
      const items = await fetchResponse.json()
      
      // Find item by CODE only (strict matching)
      const item = items.find((i: any) => i.code === editingItem.code)
      
      if (!item) {
        console.error('Available items:', items.map((i: any) => ({ code: i.code, description: i.description })))
        throw new Error(`Item with code "${editingItem.code}" not found in database.\n\nMake sure the CSV file uses the correct material codes from the database.`)
      }

      endpoint = `${lookupEndpoint}/${item.id}`
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update price')
      }

      setEditingItem(null)
      setNeedsRecalculation(true)
      alert(`✅ Price updated successfully!\n\nItem: ${item.code}\nOld Price: ${formatCurrency(editingItem.currentPrice)}\nNew Price: ${formatCurrency(newPrice)}\n\nUpload your file and click "Calculate Cost" again to see updated results.`)
    } catch (err: any) {
      alert(`❌ Error: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setEditPrice('')
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cost Calculator</h1>
        <p className="text-gray-400">Upload a CSV file to calculate project costs</p>
      </div>

      {/* Upload Form */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">CSV File</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
            >
              <Upload className="h-12 w-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">
                {file ? (
                  <span className="text-blue-500 font-medium">✅ {file.name}</span>
                ) : (
                  'Click to select CSV file or drag and drop'
                )}
              </p>
              <p className="text-sm text-gray-500 mt-1">Supports .csv and .xlsx files</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Import Format Selection */}
            {file && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Import Format</label>
                <select
                  value={importFormat}
                  onChange={(e) => setImportFormat(e.target.value as 'auto' | 'lexacut' | 'legacy')}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="auto">Auto-detect (Recommended)</option>
                  <option value="lexacut">LexaCut Optimized Format</option>
                  <option value="legacy">Legacy Format (333.csv)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {importFormat === 'auto' && 'Automatically detects the CSV format'}
                  {importFormat === 'lexacut' && 'For files exported from LexaCut plugin with optimized preset'}
                  {importFormat === 'legacy' && 'For older 333.csv format files'}
                </p>
              </div>
            )}
          </div>

          {/* Project Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Project Name</label>
              <input
                type="text"
                value={projectData.projectName}
                onChange={(e) => setProjectData({ ...projectData, projectName: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="e.g., Kitchen Cabinet Project"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Client Name</label>
              <input
                type="text"
                value={projectData.clientName}
                onChange={(e) => setProjectData({ ...projectData, clientName: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="e.g., John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contract Date</label>
              <input
                type="date"
                value={projectData.contractDate}
                onChange={(e) => setProjectData({ ...projectData, contractDate: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Waste Percentage</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={projectData.wastePercentage}
                onChange={(e) => setProjectData({ ...projectData, wastePercentage: parseFloat(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">e.g., 0.15 for 15%</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <CalcIcon className="h-5 w-5" />
            {loading ? 'Calculating...' : 'Calculate Cost'}
          </button>
        </form>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Processing your request... Please wait</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-400">❌ Error: {error}</p>
        </div>
      )}

      {/* Needs Recalculation Banner */}
      {needsRecalculation && (
        <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalcIcon className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-yellow-500 font-medium">Prices Updated!</p>
              <p className="text-yellow-400/80 text-sm">Upload your file and click "Calculate Cost" again to see updated results.</p>
            </div>
          </div>
          <button
            onClick={() => setNeedsRecalculation(false)}
            className="text-yellow-500 hover:text-yellow-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Project Info */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Project Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Project Name:</span>
                <span className="font-medium">{result.project.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Client:</span>
                <span className="font-medium">{result.project.client}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date:</span>
                <span className="font-medium">{result.project.date}</span>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CalcIcon className="h-5 w-5" />
              Cost Breakdown
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(() => {
                const categories = [
                  { name: 'Material', cost: result.costs.material.totalCost, items: (result.costs.material as any).items, handler: setShowMaterialBreakdown, icon: Package },
                  { name: 'BoreshKari', cost: result.costs.boreshKari.totalCost, items: (result.costs.boreshKari as any).items, handler: null, icon: null },
                  { name: 'CNC', cost: result.costs.cnc.totalCost, items: (result.costs.cnc as any).items, handler: setShowCNCBreakdown, icon: Wrench },
                  { name: 'NavarShiar', cost: result.costs.navarShiar.totalCost, items: (result.costs.navarShiar as any).items, handler: setShowEdgeBandingBreakdown, icon: Ruler },
                  { name: 'Fittings', cost: result.costs.fittings.totalCost, items: (result.costs.fittings as any).items, handler: setShowFittingsBreakdown, icon: Grid },
                  { name: 'Painting', cost: result.costs.painting.totalCost, items: (result.costs.painting as any).items, handler: null, icon: null },
                  { name: 'Plate', cost: result.costs.plate.totalCost, items: (result.costs.plate as any).items, handler: null, icon: null },
                  { name: 'WoodTools', cost: result.costs.woodTools.totalCost, items: (result.costs.woodTools as any).items, handler: null, icon: null },
                ];

                return categories.map(({ name, cost, items, handler, icon: Icon }) => {
                  const isClickable = handler && items?.length > 0;
                  return (
                    <div 
                      key={name} 
                      className={`bg-gray-800 rounded-lg p-4 ${isClickable ? 'cursor-pointer hover:bg-gray-750 hover:border-blue-500 border border-transparent transition-all' : ''}`}
                      onClick={() => isClickable && handler(true)}
                    >
                      <h4 className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                        {name}
                        {isClickable && Icon && <Icon className="h-3 w-3" />}
                      </h4>
                      <p className="text-lg font-bold">{formatCurrency(cost)}</p>
                      {isClickable && (
                        <p className="text-xs text-blue-400 mt-1">Click for details →</p>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Grid className="h-5 w-5" />
              Financial Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-lg">
                <span className="text-gray-400">Subtotal:</span>
                <span className="font-medium">{formatCurrency(result.financialSummary.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Overhead 1 (25%):</span>
                <span>{formatCurrency(result.financialSummary.overheads.overhead1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Overhead 2 (4%):</span>
                <span>{formatCurrency(result.financialSummary.overheads.overhead2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Overhead 3 (2%):</span>
                <span>{formatCurrency(result.financialSummary.overheads.overhead3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Overhead 4 (2%):</span>
                <span>{formatCurrency(result.financialSummary.overheads.overhead4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Contingency (2.5%):</span>
                <span>{formatCurrency(result.financialSummary.overheads.contingency)}</span>
              </div>
              <div className="flex justify-between text-lg border-t border-gray-700 pt-3">
                <span className="text-gray-400 font-medium">Total Overheads:</span>
                <span className="font-bold">{formatCurrency(result.financialSummary.overheads.totalOverheads)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-400 font-medium">Total with Overheads:</span>
                <span className="font-bold">{formatCurrency(result.financialSummary.totalWithOverheads)}</span>
              </div>
              <div className="flex justify-between text-lg border-t border-gray-700 pt-3">
                <span className="text-gray-400 font-medium">Profit (22%):</span>
                <span className="font-bold text-green-500">{formatCurrency(result.financialSummary.profitAmount)}</span>
              </div>
            </div>
          </div>

          {/* Final Price */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
              <CalcIcon className="h-6 w-6" />
              Final Price
            </h2>
            <div className="text-5xl font-black">{formatCurrency(result.financialSummary.finalPrice)}</div>
          </div>

          {/* JSON View Toggle */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <button
              onClick={() => setShowJson(!showJson)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-lg font-medium flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Full JSON Response
              </span>
              {showJson ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {showJson && (
              <pre className="mt-4 bg-gray-950 rounded-lg p-4 overflow-x-auto text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Material Breakdown Modal */}
      {showMaterialBreakdown && result && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Material Breakdown</h2>
                  <p className="text-gray-400 text-sm">Detailed material costs and quantities</p>
                </div>
              </div>
              <button
                onClick={() => setShowMaterialBreakdown(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {result.costs.material.items && result.costs.material.items.length > 0 ? (
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-400">Total Material Cost</p>
                        <p className="text-3xl font-bold">{formatCurrency(result.costs.material.totalCost)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Total Items</p>
                        <p className="text-3xl font-bold">{result.costs.material.items.filter((item: any) => {
                          const totalCost = item.totalCost || item.cost || item.materialCost || 0;
                          const quantity = item.quantity || item.totalQuantity || 0;
                          return totalCost > 0 || quantity > 0;
                        }).length}</p>
                      </div>
                    </div>
                  </div>

                  {/* Material List */}
                  <div className="space-y-3">
                    {result.costs.material.items
                      .filter((item: any) => {
                        // Filter out items with 0 cost AND 0 quantity (likely misplaced edge banding)
                        const totalCost = item.totalCost || item.cost || item.materialCost || 0;
                        const quantity = item.quantity || item.totalQuantity || 0;
                        return totalCost > 0 || quantity > 0;
                      })
                      .map((item: any, index: number) => {
                      // Extract material name from various possible fields
                      const materialName = item.materialName 
                        || item.material 
                        || item.name 
                        || item.description
                        || item.materialType
                        || `Material #${index + 1}`;
                      
                      // Calculate unit price if not provided
                      const quantity = item.quantity || item.totalQuantity || 0;
                      const totalCost = item.totalCost || item.cost || item.materialCost || 0;
                      const unitPrice = item.unitPrice || item.pricePerUnit || (quantity > 0 ? totalCost / quantity : 0);
                      
                      // Get area/quantity
                      const area = item.area || item.totalArea || item.surfaceArea || quantity;
                      
                      return (
                        <div
                          key={index}
                          className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">
                                {materialName}
                              </h3>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                {(item.materialCode || item.code) && (
                                  <span className="flex items-center gap-1">
                                    <span className="text-gray-500">Code:</span>
                                    <span className="font-mono text-blue-400">{item.materialCode || item.code}</span>
                                  </span>
                                )}
                                {item.thickness && (
                                  <span className="flex items-center gap-1">
                                    <span className="text-gray-500">Thickness:</span>
                                    <span>{item.thickness} mm</span>
                                  </span>
                                )}
                                {item.category && (
                                  <span className="flex items-center gap-1">
                                    <span className="text-gray-500">Category:</span>
                                    <span>{item.category}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right flex items-start gap-2">
                              <button
                                onClick={() => {
                                  // Use ID if available, otherwise use code
                                  const itemId = item.id
                                  const itemCode = item.materialCode || item.code
                                  
                                  console.log('Edit Material:', { 
                                    id: itemId,
                                    code: itemCode,
                                    fullItem: item 
                                  })
                                  
                                  if (!itemCode) {
                                    alert('❌ Error: This material has no code. Cannot edit.')
                                    return
                                  }
                                  
                                  handleEditPrice('material', itemId, itemCode, unitPrice)
                                }}
                                className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                                title="Edit unit price"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <div>
                                <p className="text-xl font-bold text-blue-400">
                                  {formatCurrency(totalCost)}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-gray-700">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Quantity</p>
                              <p className="font-semibold">
                                {quantity.toFixed(2)} {item.unit || 'متر مربع'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Unit Price</p>
                              <p className="font-semibold">
                                {formatCurrency(unitPrice)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Total Area</p>
                              <p className="font-semibold">
                                {area.toFixed(2)} m²
                              </p>
                            </div>
                          </div>

                          {/* Additional Details */}
                          {(item.length || item.width || item.componentCount || item.components) && (
                            <div className="mt-3 pt-3 border-t border-gray-700">
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                {item.length && (
                                  <div>
                                    <p className="text-xs text-gray-500">Length</p>
                                    <p className="text-gray-300">{item.length} mm</p>
                                  </div>
                                )}
                                {item.width && (
                                  <div>
                                    <p className="text-xs text-gray-500">Width</p>
                                    <p className="text-gray-300">{item.width} mm</p>
                                  </div>
                                )}
                                {(item.componentCount || item.components) && (
                                  <div>
                                    <p className="text-xs text-gray-500">Components</p>
                                    <p className="text-gray-300">{item.componentCount || item.components}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Cost Breakdown */}
                          {(item.baseCost || item.wasteAmount) && (
                            <div className="mt-3 pt-3 border-t border-gray-700 space-y-1">
                              {item.baseCost && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-400">Base Cost:</span>
                                  <span className="text-gray-300">{formatCurrency(item.baseCost)}</span>
                                </div>
                              )}
                              {item.wasteAmount > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-400">Waste Added:</span>
                                  <span className="text-orange-400">
                                    {formatCurrency(item.wasteAmount)} ({((item.wastePercentage || 0) * 100).toFixed(0)}%)
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Debug: Show raw data structure in development */}
                          {typeof window !== 'undefined' && (window as any).location?.hostname === 'localhost' && (
                            <details className="mt-3 pt-3 border-t border-gray-700">
                              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400">
                                Debug: Raw Data
                              </summary>
                              <pre className="text-xs text-gray-400 mt-2 overflow-x-auto">
                                {JSON.stringify(item, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                        );
                      })}
                  </div>

                  {/* Filtered Items Note */}
                  {result.costs.material.items.length > result.costs.material.items.filter((item: any) => {
                    const totalCost = item.totalCost || item.cost || item.materialCost || 0;
                    const quantity = item.quantity || item.totalQuantity || 0;
                    return totalCost > 0 || quantity > 0;
                  }).length && (
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-sm text-gray-400 text-center flex items-center justify-center gap-2">
                      <FileText className="h-4 w-4" />
                      {result.costs.material.items.length - result.costs.material.items.filter((item: any) => {
                        const totalCost = item.totalCost || item.cost || item.materialCost || 0;
                        const quantity = item.quantity || item.totalQuantity || 0;
                        return totalCost > 0 || quantity > 0;
                      }).length} empty items filtered out (likely edge banding operations in wrong category)
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No material details available</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-800 bg-gray-900/50">
              <button
                onClick={() => setShowMaterialBreakdown(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CNC Operations Breakdown Modal */}
      {showCNCBreakdown && result && (result.costs.cnc as any).items && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="bg-purple-600 p-2 rounded-lg">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">CNC Operations Breakdown</h2>
                  <p className="text-gray-400 text-sm">Detailed CNC machining costs</p>
                </div>
              </div>
              <button onClick={() => setShowCNCBreakdown(false)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Total CNC Cost</p>
                      <p className="text-3xl font-bold">{formatCurrency(result.costs.cnc.totalCost)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Total Operations</p>
                      <p className="text-3xl font-bold">{((result.costs.cnc as any).items || []).filter((item: any) => (item.totalCost || item.cost || 0) > 0 || (item.quantity || 0) > 0).length}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {((result.costs.cnc as any).items || [])
                    .filter((item: any) => (item.totalCost || item.cost || 0) > 0 || (item.quantity || 0) > 0)
                    .map((item: any, index: number) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">
                              {item.operationName || item.operation || item.name || item.description || `CNC Operation #${index + 1}`}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                              {(item.operationCode || item.code) && (
                                <span>Code: <span className="font-mono text-purple-400">{item.operationCode || item.code}</span></span>
                              )}
                              {item.operationType && <span>Type: {item.operationType}</span>}
                            </div>
                          </div>
                          <div className="text-right flex items-start gap-2">
                            <button
                              onClick={() => handleEditPrice('cnc', item.id, item.operationCode || item.code, item.unitPrice || item.pricePerUnit || ((item.quantity || 0) > 0 ? (item.totalCost || item.cost || 0) / (item.quantity || 1) : 0))}
                              className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-purple-400 hover:text-purple-300"
                              title="Edit unit price"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <p className="text-xl font-bold text-purple-400">{formatCurrency(item.totalCost || item.cost || 0)}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-gray-700">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Quantity</p>
                            <p className="font-semibold">{(item.quantity || 0).toFixed(2)} {item.unit || 'عدد'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Unit Price</p>
                            <p className="font-semibold">{formatCurrency(item.unitPrice || item.pricePerUnit || ((item.quantity || 0) > 0 ? (item.totalCost || item.cost || 0) / (item.quantity || 1) : 0))}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Components</p>
                            <p className="font-semibold">{item.componentCount || item.components || '-'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-800 bg-gray-900/50">
              <button onClick={() => setShowCNCBreakdown(false)} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edge Banding Breakdown Modal */}
      {showEdgeBandingBreakdown && result && (result.costs.navarShiar as any).items && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="bg-green-600 p-2 rounded-lg">
                  <Ruler className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Edge Banding Breakdown</h2>
                  <p className="text-gray-400 text-sm">Detailed edge banding costs</p>
                </div>
              </div>
              <button onClick={() => setShowEdgeBandingBreakdown(false)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-600/20 to-teal-600/20 border border-green-500/30 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Total Edge Banding Cost</p>
                      <p className="text-3xl font-bold">{formatCurrency(result.costs.navarShiar.totalCost)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Total Items</p>
                      <p className="text-3xl font-bold">{((result.costs.navarShiar as any).items || []).filter((item: any) => (item.totalCost || item.cost || 0) > 0 || (item.quantity || item.length || 0) > 0).length}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {((result.costs.navarShiar as any).items || [])
                    .filter((item: any) => (item.totalCost || item.cost || 0) > 0 || (item.quantity || item.length || 0) > 0)
                    .map((item: any, index: number) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-green-500 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">
                              {item.edgeBandingName || item.edgeBanding || item.name || item.description || item.type || `Edge Banding #${index + 1}`}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                              {(item.edgeBandingCode || item.code) && (
                                <span>Code: <span className="font-mono text-green-400">{item.edgeBandingCode || item.code}</span></span>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex items-start gap-2">
                            <button
                              onClick={() => handleEditPrice('edgeBanding', item.id, item.edgeBandingCode || item.code, item.pricePerMeter || item.unitPrice || ((item.length || item.quantity || 0) > 0 ? (item.totalCost || item.cost || 0) / (item.length || item.quantity || 1) : 0))}
                              className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-green-400 hover:text-green-300"
                              title="Edit price per meter"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <p className="text-xl font-bold text-green-400">{formatCurrency(item.totalCost || item.cost || 0)}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-gray-700">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Length</p>
                            <p className="font-semibold">{(item.length || item.quantity || 0).toFixed(2)} {item.unit || 'متر'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Price per Meter</p>
                            <p className="font-semibold">{formatCurrency(item.pricePerMeter || item.unitPrice || ((item.length || item.quantity || 0) > 0 ? (item.totalCost || item.cost || 0) / (item.length || item.quantity || 1) : 0))}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Edges</p>
                            <p className="font-semibold">{item.edgeCount || item.edges || '-'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-800 bg-gray-900/50">
              <button onClick={() => setShowEdgeBandingBreakdown(false)} className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fittings Breakdown Modal */}
      {showFittingsBreakdown && result && (result.costs.fittings as any).items && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="bg-orange-600 p-2 rounded-lg">
                  <Grid className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Fittings Breakdown</h2>
                  <p className="text-gray-400 text-sm">Detailed hardware and fittings costs</p>
                </div>
              </div>
              <button onClick={() => setShowFittingsBreakdown(false)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Total Fittings Cost</p>
                      <p className="text-3xl font-bold">{formatCurrency(result.costs.fittings.totalCost)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Total Items</p>
                      <p className="text-3xl font-bold">{((result.costs.fittings as any).items || []).filter((item: any) => (item.totalCost || item.cost || 0) > 0 || (item.quantity || 0) > 0).length}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {((result.costs.fittings as any).items || [])
                    .filter((item: any) => (item.totalCost || item.cost || 0) > 0 || (item.quantity || 0) > 0)
                    .map((item: any, index: number) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-orange-500 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">
                              {item.fittingName || item.fitting || item.name || item.description || `Fitting #${index + 1}`}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                              {(item.fittingCode || item.code) && (
                                <span>Code: <span className="font-mono text-orange-400">{item.fittingCode || item.code}</span></span>
                              )}
                              {item.category && <span>Category: {item.category}</span>}
                            </div>
                          </div>
                          <div className="text-right flex items-start gap-2">
                            <button
                              onClick={() => handleEditPrice('fitting', item.id, item.fittingCode || item.code, item.unitPrice || item.pricePerUnit || ((item.quantity || 0) > 0 ? (item.totalCost || item.cost || 0) / (item.quantity || 1) : 0))}
                              className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-orange-400 hover:text-orange-300"
                              title="Edit unit price"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <p className="text-xl font-bold text-orange-400">{formatCurrency(item.totalCost || item.cost || 0)}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-gray-700">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Quantity</p>
                            <p className="font-semibold">{(item.quantity || 0).toFixed(0)} {item.unit || 'عدد'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Unit Price</p>
                            <p className="font-semibold">{formatCurrency(item.unitPrice || item.pricePerUnit || ((item.quantity || 0) > 0 ? (item.totalCost || item.cost || 0) / (item.quantity || 1) : 0))}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Per Component</p>
                            <p className="font-semibold">{item.qtyPerComponent || item.perComponent || '-'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-800 bg-gray-900/50">
              <button onClick={() => setShowFittingsBreakdown(false)} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Price Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-gray-900 rounded-lg border border-gray-800 max-w-md w-full">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Edit2 className="h-5 w-5 text-blue-500" />
                Edit Price
              </h3>
              <p className="text-gray-400 text-sm mt-1">Update unit price for: {editingItem.code}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Price</label>
                <div className="bg-gray-800 rounded-lg px-4 py-2 text-gray-400">
                  {formatCurrency(editingItem.currentPrice)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">New Price (Rial)</label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Enter new price"
                  autoFocus
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-800 flex gap-3">
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSavePrice}
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

