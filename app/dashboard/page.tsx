'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/ui/navbar'
import { useAuth } from '@/lib/auth'
import { PlusCircle, Calculator, TrendingUp, PieChart, Target, Trophy, BookOpen, PiggyBank, Search, Globe, MessageCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const [spent, setSpent] = useState<number | null>(null)
  const [spentLoading, setSpentLoading] = useState(false)

  useEffect(() => {
    async function fetchSpent() {
      setSpentLoading(true)
      try {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10)

        if (!user?.id) {
          setSpent(0)
          return
        }

        const { data, error } = await supabase
          .from('transactions')
          .select('amount, date')
          .eq('user_id', user.id)
          .gte('date', start)
          .lte('date', end)

        if (error) {
          console.warn('Error fetching transactions for spent:', error)
          setSpent(0)
        } else if (!data) {
          setSpent(0)
        } else {
          const total = data.reduce((acc: number, row: any) => {
            const n = Number(row.amount)
            return acc + (Number.isFinite(n) ? n : 0)
          }, 0)
          setSpent(total)
        }
      } catch (e) {
        console.error(e)
        setSpent(0)
      } finally {
        setSpentLoading(false)
      }
    }

    fetchSpent()
  }, [user])
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage="dashboard" />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Header */}
        <div className="mb-8 bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-2xl p-6 border border-primary/20">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            Welcome back, {user?.name || user?.email?.split('@')[0] || 'there'}! 
          </h1>
          <p className="text-gray-600 text-lg">Ready to level up your financial game today?</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">₱0</p>
                  <p className="text-sm text-gray-600 font-medium">Total Saved</p>
                </div>
                <PiggyBank className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-600">0</p>
                  <p className="text-sm text-gray-600 font-medium">Active Goals</p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-emerald-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-emerald-600">₱0</p>
                  <p className="text-sm text-gray-600 font-medium">This Month</p>
                </div>
                <ArrowUpRight className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-orange-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {spentLoading ? '...' : `₱${(spent ?? 0).toFixed(2)}`}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">Spent</p>
                </div>
                <ArrowDownRight className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant Highlight */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-primary to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Search className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">AI Assistant with Web Search</h3>
                    <p className="text-blue-100">
                      Ask me to search for current prices, bank rates, or any financial info!
                    </p>
                  </div>
                </div>
                <Link href="/ai-assistant">
                  <Button variant="secondary">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Insights */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Learning Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2"></div>
                <div className="text-sm text-gray-600 mb-4">modules completed</div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">Great progress! 0 modules remaining</p>
              </div>
            </CardContent>
          </Card>

          {/* Spending Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-blue-500" />
                Spending Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm">Food & Dining</span>
                  </div>
                  <span className="text-sm font-medium">₱0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">Transportation</span>
                  </div>
                  <span className="text-sm font-medium">₱0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-sm">Entertainment</span>
                  </div>
                  <span className="text-sm font-medium">₱0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-sm">Others</span>
                  </div>
                  <span className="text-sm font-medium">₱0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goal Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-500" />
                Goal Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>iPhone 15 Pro</span>
                    <span>₱8,450 / ₱65,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '13%' }}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">13% complete</p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Emergency Fund</span>
                    <span>₱6,200 / ₱15,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '41%' }}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">41% complete</p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Graduation Trip</span>
                    <span>₱12,500 / ₱25,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">50% complete</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cashflow Analysis */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <TrendingUp className="w-6 h-6 mr-3 text-emerald-500" />
                Monthly Cashflow Overview
              </CardTitle>
              <CardDescription className="text-base">Track your income vs expenses and see your financial flow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8">
                {/* Total Income */}
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 bg-green-500 rounded-full">
                      <ArrowUpRight className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">₱18,750</div>
                  <div className="text-sm text-green-700 font-semibold mb-4">Total Income</div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Salary</span>
                      <span className="font-medium">₱15,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Freelance</span>
                      <span className="font-medium">₱2,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Allowance</span>
                      <span className="font-medium">₱1,250</span>
                    </div>
                  </div>
                </div>

                {/* Total Expenses */}
                <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 bg-red-500 rounded-full">
                      <ArrowDownRight className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-red-600 mb-2">₱12,800</div>
                  <div className="text-sm text-red-700 font-semibold mb-4">Total Expenses</div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Food & Dining</span>
                      <span className="font-medium">₱4,200</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transportation</span>
                      <span className="font-medium">₱2,800</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Others</span>
                      <span className="font-medium">₱5,800</span>
                    </div>
                  </div>
                </div>

                {/* Net Cashflow */}
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 bg-blue-500 rounded-full">
                      <PiggyBank className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">₱5,950</div>
                  <div className="text-sm text-blue-700 font-semibold mb-4">Net Cashflow</div>
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-3">
                      {((5950 / 18750) * 100).toFixed(1)}% of income saved
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: '32%' }}></div>
                    </div>
                  </div>
                  <p className="text-sm text-blue-600 font-semibold">Excellent savings rate! 🎯</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Main Navigation */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/learning">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <BookOpen className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Financial Learning</CardTitle>
                <CardDescription>
                  Master financial literacy with structured lessons and practical tips
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-blue-600 font-medium">7 Topics Available</p>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Start Learning</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/goals">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Target className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>My Financial Goals</CardTitle>
                <CardDescription>
                  Track savings goals created manually or by AI assistant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-green-600 font-medium">AI-powered planning</p>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">3 Active</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/challenges">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Trophy className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Financial Challenges</CardTitle>
                <CardDescription>
                  Student and graduate challenges for building money habits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-purple-600 font-medium">Community challenges</p>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">7 Completed</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/add-transaction">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <PlusCircle className="w-12 h-12 text-orange-600 mb-4" />
                <CardTitle>Add Transaction</CardTitle>
                <CardDescription>
                  Manually track your income and expenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-orange-600 font-medium">Quick expense entry</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/digital-tools">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Calculator className="w-12 h-12 text-red-600 mb-4" />
                <CardTitle>Financial Tools</CardTitle>
                <CardDescription>
                  Budget calculator, savings tracker, and more tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-600 font-medium">Philippine peso optimized</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/resource-hub">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Globe className="w-12 h-12 text-teal-600 mb-4" />
                <CardTitle>Resource Hub</CardTitle>
                <CardDescription>
                  Filipino financial educators, banks, and educational content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-teal-600 font-medium">Curated resources</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest income and expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-medium text-sm">-</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Jollibee Dinner</p>
                      <p className="text-xs text-gray-600">Food & Dining • Today</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-red-600">-₱285</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-medium text-sm">+</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Freelance Payment</p>
                      <p className="text-xs text-gray-600">Income • Yesterday</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-green-600">+₱2,500</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-medium text-sm">-</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Jeepney Fare</p>
                      <p className="text-xs text-gray-600">Transportation • Yesterday</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-red-600">-₱24</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-medium text-sm">-</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Netflix Subscription</p>
                      <p className="text-xs text-gray-600">Entertainment • Aug 27</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-red-600">-₱549</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Link href="/add-transaction">
                  <Button className="w-full" variant="outline">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add New Transaction
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expense Categories This Month</CardTitle>
              <CardDescription>Where your money is going</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Food & Dining</p>
                      <p className="text-xs text-gray-600">15 transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">₱4,200</p>
                    <p className="text-xs text-gray-600">32.8%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Transportation</p>
                      <p className="text-xs text-gray-600">22 transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">₱2,800</p>
                    <p className="text-xs text-gray-600">21.9%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Entertainment</p>
                      <p className="text-xs text-gray-600">8 transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">₱1,950</p>
                    <p className="text-xs text-gray-600">15.2%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Others</p>
                      <p className="text-xs text-gray-600">12 transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">₱3,850</p>
                    <p className="text-xs text-gray-600">30.1%</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Monthly Budget: ₱15,000</p>
                  <p className="text-xs text-green-600">₱2,200 remaining</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
