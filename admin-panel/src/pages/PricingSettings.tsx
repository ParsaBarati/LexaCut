import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { pricingConfigApi } from '../lib/api'

export default function PricingSettings() {
  const queryClient = useQueryClient()

  const { data: config, isLoading } = useQuery({
    queryKey: ['pricing-config'],
    queryFn: async () => (await pricingConfigApi.getActive()).data,
  })

  const updateMutation = useMutation({
    mutationFn: pricingConfigApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-config'] })
      toast.success('Pricing configuration updated successfully')
    },
    onError: () => toast.error('Failed to update pricing configuration'),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const data = {
      overhead1: parseFloat(formData.get('overhead1') as string) / 100,
      overhead2: parseFloat(formData.get('overhead2') as string) / 100,
      overhead3: parseFloat(formData.get('overhead3') as string) / 100,
      overhead4: parseFloat(formData.get('overhead4') as string) / 100,
      contingency: parseFloat(formData.get('contingency') as string) / 100,
      profitMargin: parseFloat(formData.get('profitMargin') as string) / 100,
    }

    updateMutation.mutate(data)
  }

  if (isLoading) {
    return <div className="text-center py-12 text-gray-400">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Pricing Configuration</h1>

      <div className="max-w-2xl">
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Overhead 1 (%)
              </label>
              <input
                name="overhead1"
                type="number"
                step="0.01"
                required
                defaultValue={(config?.overhead1 || 0) * 100}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">Default: 25%</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Overhead 2 (%)
              </label>
              <input
                name="overhead2"
                type="number"
                step="0.01"
                required
                defaultValue={(config?.overhead2 || 0) * 100}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">Default: 4%</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Overhead 3 (%)
              </label>
              <input
                name="overhead3"
                type="number"
                step="0.01"
                required
                defaultValue={(config?.overhead3 || 0) * 100}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">Default: 2%</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Overhead 4 (%)
              </label>
              <input
                name="overhead4"
                type="number"
                step="0.01"
                required
                defaultValue={(config?.overhead4 || 0) * 100}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">Default: 2%</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Contingency (%)
              </label>
              <input
                name="contingency"
                type="number"
                step="0.01"
                required
                defaultValue={(config?.contingency || 0) * 100}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">Default: 2.5%</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Profit Margin (%)
              </label>
              <input
                name="profitMargin"
                type="number"
                step="0.01"
                required
                defaultValue={(config?.profitMargin || 0) * 100}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">Default: 22%</p>
            </div>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              Save Configuration
            </button>
          </form>
        </div>

        <div className="mt-6 bg-blue-900/20 border border-blue-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-2">Important Note</h3>
          <p className="text-sm text-gray-400">
            Changes to pricing configuration will immediately affect all future cost calculations.
            The system uses these percentages to calculate overheads and profit margins.
          </p>
        </div>
      </div>
    </div>
  )
}

