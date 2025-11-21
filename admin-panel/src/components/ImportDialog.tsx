import { useState, useRef, useCallback } from 'react'
import { X, Upload, Download, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import * as XLSX from 'xlsx'

interface TemplateField {
  key: string
  label: string
  required: boolean
  type?: 'string' | 'number'
}

interface ImportDialogProps {
  open: boolean
  onClose: () => void
  onImport: (data: any[]) => Promise<void>
  templateFields: TemplateField[]
  dataType: string
}

interface ValidationError {
  row: number
  field: string
  message: string
}

export default function ImportDialog({
  open,
  onClose,
  templateFields,
  dataType,
  onImport,
}: ImportDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<any[]>([])
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [importing, setImporting] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]

    if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
      alert('Please upload a valid CSV or XLSX file')
      return
    }

    setFile(file)
    parseFile(file)
  }

  const parseFile = (file: File) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(firstSheet)

        if (jsonData.length === 0) {
          alert('The file is empty')
          return
        }

        // Validate and transform data
        const validated = validateData(jsonData as any[])
        setParsedData(validated.data)
        setErrors(validated.errors)
      } catch (err) {
        alert('Error parsing file: ' + (err as Error).message)
      }
    }

    reader.readAsBinaryString(file)
  }

  const validateData = (data: any[]) => {
    const errors: ValidationError[] = []
    const validatedData: any[] = []

    data.forEach((row, index) => {
      const rowNumber = index + 2 // +2 because Excel rows start at 1 and we have a header
      const validatedRow: any = {}
      let hasError = false

      templateFields.forEach((field) => {
        const value = row[field.key]

        // Check required fields
        if (field.required && (value === undefined || value === null || value === '')) {
          errors.push({
            row: rowNumber,
            field: field.key,
            message: `${field.label} is required`,
          })
          hasError = true
          return
        }

        // Type validation
        if (value !== undefined && value !== null && value !== '') {
          if (field.type === 'number') {
            const numValue = Number(value)
            if (isNaN(numValue)) {
              errors.push({
                row: rowNumber,
                field: field.key,
                message: `${field.label} must be a number`,
              })
              hasError = true
              return
            }
            validatedRow[field.key] = numValue
          } else {
            validatedRow[field.key] = String(value).trim()
          }
        } else if (!field.required) {
          // Set default values for non-required fields
          validatedRow[field.key] = field.type === 'number' ? 0 : ''
        }
      })

      if (!hasError) {
        validatedData.push(validatedRow)
      }
    })

    return { data: validatedData, errors }
  }

  const handleImport = async () => {
    if (parsedData.length === 0) {
      alert('No valid data to import')
      return
    }

    if (errors.length > 0) {
      const proceed = window.confirm(
        `There are ${errors.length} validation errors. Only valid rows will be imported. Continue?`
      )
      if (!proceed) return
    }

    setImporting(true)
    try {
      await onImport(parsedData)
      setFile(null)
      setParsedData([])
      setErrors([])
      onClose()
    } catch (err) {
      alert('Import failed: ' + (err as Error).message)
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const headers = templateFields.map((f) => f.key)
    const sampleRow = templateFields.map((f) => {
      if (f.key === 'code') return `${dataType}-1`
      if (f.key === 'description' || f.key === 'name') return 'Sample ' + dataType
      if (f.key === 'unit') return 'عدد'
      if (f.key === 'unitPrice') return '100000'
      if (f.key === 'category') return 'General'
      if (f.key === 'persianNames') return 'نمونه'
      if (f.key === 'qtyPerFitting') return '1'
      return ''
    })

    const worksheet = XLSX.utils.aoa_to_sheet([headers, sampleRow])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template')
    XLSX.writeFile(workbook, `${dataType.toLowerCase()}-template.xlsx`)
  }

  const reset = () => {
    setFile(null)
    setParsedData([])
    setErrors([])
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-bold">Import {dataType}</h2>
            <p className="text-gray-400 text-sm mt-1">Upload CSV or XLSX file to bulk create items</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Download Template */}
          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium mb-1">Download Template</h3>
                <p className="text-sm text-gray-400">
                  Download the template file with the correct column structure
                </p>
              </div>
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                Template
              </button>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Upload File</label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : file
                  ? 'border-green-600 bg-green-600/10'
                  : 'border-gray-700 hover:border-blue-500'
              }`}
            >
              <Upload className={`h-12 w-12 mx-auto mb-3 ${file ? 'text-green-500' : 'text-gray-500'}`} />
              {file ? (
                <div>
                  <p className="text-green-500 font-medium">{file.name}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {parsedData.length} valid rows, {errors.length} errors
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      reset()
                    }}
                    className="text-blue-400 hover:text-blue-300 text-sm mt-2"
                  >
                    Choose different file
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-400">Click to select or drag and drop CSV/XLSX file</p>
                  <p className="text-sm text-gray-500 mt-1">Maximum file size: 10MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Validation Results */}
          {(parsedData.length > 0 || errors.length > 0) && (
            <div className="space-y-4">
              {/* Success Summary */}
              {parsedData.length > 0 && (
                <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-green-500">
                      {parsedData.length} valid {parsedData.length === 1 ? 'row' : 'rows'} ready to import
                    </span>
                  </div>
                </div>
              )}

              {/* Error Summary */}
              {errors.length > 0 && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-red-500 mb-2">
                        {errors.length} validation {errors.length === 1 ? 'error' : 'errors'}
                      </p>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {errors.slice(0, 10).map((err, idx) => (
                          <p key={idx} className="text-sm text-red-400">
                            Row {err.row}: {err.message}
                          </p>
                        ))}
                        {errors.length > 10 && (
                          <p className="text-sm text-red-400">
                            ...and {errors.length - 10} more errors
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview Table */}
              {parsedData.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Preview (first 5 rows)</h3>
                  <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-750 border-b border-gray-700">
                        <tr>
                          {templateFields.map((field) => (
                            <th key={field.key} className="px-4 py-2 text-left font-medium text-gray-400">
                              {field.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.slice(0, 5).map((row, idx) => (
                          <tr key={idx} className="border-b border-gray-700 last:border-0">
                            {templateFields.map((field) => (
                              <td key={field.key} className="px-4 py-2">
                                {String(row[field.key] || '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {parsedData.length > 5 && (
                    <p className="text-sm text-gray-500 mt-2">
                      ...and {parsedData.length - 5} more rows
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 flex gap-3">
          <button
            onClick={onClose}
            disabled={importing}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={importing || parsedData.length === 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {importing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Importing...
              </>
            ) : (
              `Import ${parsedData.length} ${parsedData.length === 1 ? 'Item' : 'Items'}`
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

