'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import {
  LayoutDashboard,
  FileText,
  Image,
  Calendar,
  DollarSign,
  ShoppingCart,
  LogOut
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Site Meta', href: '/admin/site-meta', icon: FileText },
  { name: 'Portfolio', href: '/admin/portfolio', icon: Image },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Commissions', href: '/admin/commissions', icon: DollarSign },
  { name: 'Store', href: '/admin/store', icon: ShoppingCart },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [currentPath, setCurrentPath] = useState('/admin')
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        toast({
          title: 'Logged out successfully',
          description: 'Redirecting to login page...',
        })
        router.push('/admin/login')
      } else {
        toast({
          title: 'Logout failed',
          description: 'Please try again',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Logout failed',
        description: 'An error occurred',
        variant: 'destructive',
      })
    }
  }

  const handleNavigation = (href: string) => {
    setCurrentPath(href)
    router.push(href)
  }

  return (
    <div className="min-h-screen bg-primary-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-primary-800 shadow-lg">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-16 px-4 bg-primary-700">
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = currentPath === item.href

                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-accent text-white'
                        : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </button>
                )
              })}
            </nav>

            <div className="p-4">
              <Separator className="mb-4 bg-primary-600" />
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start text-primary-100 hover:bg-primary-700 hover:text-white"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6">
            <Card className="h-full bg-white">
              <CardContent className="p-6 admin-content">
                {children}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}