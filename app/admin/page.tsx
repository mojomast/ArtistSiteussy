'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Image, Calendar, DollarSign, ShoppingCart, Download, Upload } from 'lucide-react'
import { useState } from 'react'

export default function AdminDashboard() {
  const [isImporting, setIsImporting] = useState(false)
  const [importMessage, setImportMessage] = useState('')

  const handleExport = () => {
    window.open('/api/admin/export', '_blank')
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/import', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setImportMessage('Import successful! Please refresh the page to see changes.')
      } else {
        setImportMessage(`Import failed: ${result.error}`)
      }
    } catch (error) {
      setImportMessage('Import failed: Network error')
    } finally {
      setIsImporting(false)
    }
  }

  const stats = [
    {
      title: 'Site Meta',
      description: 'Manage biography, contact info, and site settings',
      icon: FileText,
      href: '/admin/site-meta',
    },
    {
      title: 'Portfolio',
      description: 'Edit featured works and art collections',
      icon: Image,
      href: '/admin/portfolio',
    },
    {
      title: 'Events',
      description: 'Manage upcoming exhibitions and live painting events',
      icon: Calendar,
      href: '/admin/events',
    },
    {
      title: 'Commissions',
      description: 'Update commission types, pricing, and process information',
      icon: DollarSign,
      href: '/admin/commissions',
    },
    {
      title: 'Store',
      description: 'Manage products, pricing, and availability',
      icon: ShoppingCart,
      href: '/admin/store',
    },
    {
      title: 'Data Management',
      description: 'Export or import all site data and images',
      icon: Download,
      href: '#',
      isDataManagement: true,
    },
  ]

  return (
    <div className="space-y-6 text-gray-900">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage your website content and settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          if (stat.isDataManagement) {
            return (
              <Card key={stat.title} className="bg-white">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-accent rounded-lg">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900">{stat.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-gray-600 mb-4">
                    {stat.description}
                  </CardDescription>
                  <div className="space-y-3">
                    <Button
                      onClick={handleExport}
                      className="w-full"
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <div>
                      <label htmlFor="import-file">
                        <Button
                          asChild
                          className="w-full"
                          variant="outline"
                          disabled={isImporting}
                        >
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            {isImporting ? 'Importing...' : 'Import Data'}
                          </span>
                        </Button>
                      </label>
                      <input
                        id="import-file"
                        type="file"
                        accept=".zip"
                        onChange={handleImport}
                        className="hidden"
                      />
                    </div>
                    {importMessage && (
                      <p className={`text-sm ${importMessage.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                        {importMessage}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          }
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow cursor-pointer bg-white">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-accent rounded-lg">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900">{stat.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-600">
                  {stat.description}
                </CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-gray-900">Quick Actions</CardTitle>
          <CardDescription className="text-gray-600">
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-2 text-gray-900">Content Management</h3>
              <p className="text-sm text-gray-700 mb-3">
                Update text content, images, and metadata across all sections
              </p>
              <p className="text-xs text-gray-500">
                All changes are saved automatically to JSON files in the /data directory
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-2 text-gray-900">Data Structure</h3>
              <p className="text-sm text-gray-700 mb-3">
                Bilingual support (_en and _fr) for all content
              </p>
              <p className="text-xs text-gray-500">
                Add/remove items, validate required fields, and maintain data integrity
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}