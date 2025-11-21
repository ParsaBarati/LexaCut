import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { materialsApi, type Material } from '../lib/api'
import { cn } from '../lib/utils'
import ImportDialog from '../components/ImportDialog'

export default function Materials() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()

  const { data: materials, isLoading } = useQuery({
    queryKey: ['materials'],
    queryFn: async () => (await materialsApi.getAll()).data,
  })

  const createMutation = useMutation({
    mutationFn: materialsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] })
      toast.success('Material created successfully')
      setIsModalOpen(false)
    },
    onError: () => toast.error('Failed to create material'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      materialsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] })
      toast.success('Material updated successfully')
      setIsModalOpen(false)
      setEditingMaterial(null)
    },
    onError: () => toast.error('Failed to update material'),
  })

  const deleteMutation = useMutation({
    mutationFn: materialsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] })
      toast.success('Material deleted successfully')
    },
    onError: () => toast.error('Failed to delete material'),
  })

  const bulkImportMutation = useMutation({
    mutationFn: materialsApi.bulkCreate,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['materials'] })
      toast.success(`Successfully imported ${response.data.count} materials`)
      setShowImport(false)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to import materials')
    },
  })

  const materialTemplateFields = [
    { key: 'code', label: 'Code', required: true },
    { key: 'description', label: 'Description', required: true },
    { key: 'unit', label: 'Unit', required: true },
    { key: 'unitPrice', label: 'Unit Price', required: true, type: 'number' as const },
    { key: 'category', label: 'Category', required: false },
    { key: 'persianNames', label: 'Persian Names', required: false },
  ]

  const handleBulkImport = async (data: any[]) => {
    const formattedData = data.map(item => ({
      ...item,
      isActive: true,
      persianNames: item.persianNames ? item.persianNames.split(',').map((n: string) => n.trim()) : [],
    }))
    await bulkImportMutation.mutateAsync(formattedData)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const persianNames = formData.get('persianNames') as string
    
    const data = {
      code: formData.get('code') as string,
      description: formData.get('description') as string,
      unit: formData.get('unit') as string,
      unitPrice: parseFloat(formData.get('unitPrice') as string),
      category: formData.get('category') as string,
      persianNames: persianNames.split(',').map(n => n.trim()).filter(Boolean),
      isActive: true,
    }

    if (editingMaterial) {
      updateMutation.mutate({ id: editingMaterial.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const filteredMaterials = materials?.filter(m =>
    m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.persianNames.some(n => n.includes(searchQuery))
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Materials Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Upload className="h-5 w-5" />
            Import
          </button>
          <button
            onClick={() => {
              setEditingMaterial(null)
              setIsModalOpen(true)
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Material
          </button>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search materials..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : (
        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold">Code</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Description</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Category</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Unit Price</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Unit</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Status</th>
                <th className="text-right px-6 py-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredMaterials?.map((material) => (
                <tr key={material.id} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 text-sm font-mono">{material.code}</td>
                  <td className="px-6 py-4 text-sm">{material.description}</td>
                  <td className="px-6 py-4 text-sm">{material.category}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {material.unitPrice.toLocaleString()} Rials
                  </td>
                  <td className="px-6 py-4 text-sm">{material.unit}</td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                        material.isActive
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-red-900/30 text-red-400'
                      )}
                    >
                      {material.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setEditingMaterial(material)
                        setIsModalOpen(true)
                      }}
                      className="text-blue-400 hover:text-blue-300 mr-3"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this material?')) {
                          deleteMutation.mutate(material.id)
                        }
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold">
                {editingMaterial ? 'Edit Material' : 'Add New Material'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingMaterial(null)
                }}
                className="text-gray-400 hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Code</label>
                  <input
                    name="code"
                    required
                    defaultValue={editingMaterial?.code}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <input
                    name="category"
                    required
                    defaultValue={editingMaterial?.category}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <input
                  name="description"
                  required
                  defaultValue={editingMaterial?.description}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Unit Price (Rials)</label>
                  <input
                    name="unitPrice"
                    type="number"
                    step="0.01"
                    required
                    defaultValue={editingMaterial?.unitPrice}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Unit</label>
                  <input
                    name="unit"
                    required
                    defaultValue={editingMaterial?.unit}
                    placeholder="e.g., m², piece"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Persian Names (comma-separated)
                </label>
                <input
                  name="persianNames"
                  required
                  defaultValue={editingMaterial?.persianNames.join(', ')}
                  placeholder="ام دی اف, MDF, mdf"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Used for matching materials from CSV files
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingMaterial(null)
                  }}
                  className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  {editingMaterial ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ImportDialog
        open={showImport}
        onClose={() => setShowImport(false)}
        onImport={handleBulkImport}
        templateFields={materialTemplateFields}
        dataType="Material"
      />
    </div>
  )
}

