"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Navbar } from '@/components/ui/navbar'
import { Plus, Receipt, DollarSign, Calendar, Tag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'

export default function AddTransactionPage() {
  // local form state (all inputs are strings)
  type FormState = {
    amount: string
    merchant: string
    category: string
    date: string
    paymentMethod: string
    notes: string
  }

  const [transactionData, setTransactionData] = useState<FormState>({
    amount: '',
    merchant: '',
    category: '',
    date: '',
    paymentMethod: '',
    notes: ''
  })
  // keep recent transactions untyped (data comes from Supabase)
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const categories = [
    'Food & Dining',
    'Transportation', 
    'Shopping',
    'Bills & Utilities',
    'Entertainment',
    'Healthcare',
    'Education',
    'Savings/Investment'
  ]

  const paymentMethods = [
    'Cash',
    'GCash',
    'PayMaya',
    'Credit Card',
    'Debit Card',
    'Bank Transfer'
  ]

  // Fetch recent transactions
  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true)
      // select explicit columns to be robust against schema differences
      const { data, error } = await supabase
        .from('transactions')
        .select('id, amount, merchant, category, date, payment_method, notes, created_at')
        .order('created_at', { ascending: false })
        .limit(5)
      if (!error && data) setRecentTransactions(data)
      else setRecentTransactions([])
      setLoading(false)
    }
    fetchTransactions()
  }, [])

  // Save transaction to Supabase
  const handleSubmit = async () => {
    setLoading(true)
    const { amount, merchant, category, date, paymentMethod, notes } = transactionData
    const insertData = {
      amount: parseFloat(amount),
      merchant,
      category,
      date,
      payment_method: paymentMethod,
      // attach the authenticated user's id automatically (if available)
      user_id: user?.id ?? null,
      notes
    }
    // cast supabase to any to avoid local TypeScript schema mismatches
    const { error } = await (supabase as any).from('transactions').insert([insertData as any])
    if (error) {
      alert('Error adding transaction: ' + error.message)
    } else {
      alert('Transaction added successfully!')
      setTransactionData({
        amount: '',
        merchant: '',
        category: '',
        date: '',
        paymentMethod: '',
        notes: ''
      })
      // Refetch recent transactions
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      if (data) setRecentTransactions(data)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Expense Log</h1>
            <p className="text-gray-600">Manually track your income and expenses</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div> 
          </div>

          {/* Transaction Form */}
          <Card>
            <CardHeader>
              <CardTitle>Expense Details</CardTitle>
              <CardDescription>Fill in the expense information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium flex items-center space-x-2 mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Amount (₱)</span>
                </label>  
                <Input
                  type="number"
                  placeholder="0.00"
                  value={transactionData.amount}
                  onChange={(e) => setTransactionData({...transactionData, amount: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Input
                  placeholder="Expense reasons (e.g., phone bill, groceries)"
                  value={transactionData.merchant}
                  onChange={(e) => setTransactionData({...transactionData, merchant: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium flex items-center space-x-2 mb-2">
                  <Tag className="w-4 h-4" />
                  <span>Category</span>
                </label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={transactionData.category}
                  onChange={(e) => setTransactionData({...transactionData, category: e.target.value})}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Date</span>
                </label>
                <Input
                  type="date"
                  value={transactionData.date}
                  onChange={(e) => setTransactionData({...transactionData, date: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Payment Method</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={transactionData.paymentMethod}
                  onChange={(e) => setTransactionData({...transactionData, paymentMethod: e.target.value})}
                >
                  <option value="">Select payment method</option>
                  {paymentMethods.map((method) => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
                <Input
                  placeholder="Additional notes about this transaction"
                  value={transactionData.notes}
                  onChange={(e) => setTransactionData({...transactionData, notes: e.target.value})}
                />
              </div>

              <Button className="w-full" onClick={() => setShowConfirmModal(true)}>
                Add Transaction
              </Button>
            </CardContent>
          </Card>

          {showConfirmModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                <h2 className="text-lg font-semibold mb-4">Confirm Submission</h2>
                <p className="mb-6 text-gray-700">Are you sure you want to submit this transaction? You can cancel to edit the details.</p>
                <div className="flex justify-end space-x-3">
                  <button
                    className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                    onClick={() => setShowConfirmModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                    onClick={async () => {
                      setShowConfirmModal(false)
                      await handleSubmit()
                    }}
                  >
                    Yes, submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Recent Transactions Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {loading ? (
                  <p>Loading...</p>
                ) : recentTransactions.length === 0 ? (
                  <p className="text-gray-500">No recent transactions.</p>
                ) : (
                  recentTransactions.map((tx) => {
                    const title = tx.merchant ?? tx.description ?? 'Transaction'
                    const method = tx.payment_method ?? tx.paymentMethod ?? ''
                    const dateRaw = tx.created_at ?? tx.date ?? ''
                    const dateDisplay = dateRaw ? new Date(dateRaw).toLocaleString() : ''
                    const amountNumber = typeof tx.amount === 'number' ? tx.amount : Number(tx.amount) || 0
                    const amountDisplay = amountNumber.toFixed(2)
                    return (
                      <div key={tx.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium text-sm">{title}</p>
                          <p className="text-xs text-gray-600">{tx.category} {method ? `• ${method}` : ''}</p>
                          <p className="text-xs text-gray-400">{dateDisplay}</p>
                          {tx.notes && <p className="text-xs text-gray-400">{tx.notes}</p>}
                        </div>
                        <p className="font-semibold">₱{amountDisplay}</p>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
