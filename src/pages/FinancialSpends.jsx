import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Plus, DollarSign } from 'lucide-react'

export default function FinancialSpends() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Financial Spending</h1>
          <p className="text-zinc-600 mt-1">Track individual spending transactions (items)</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spending Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <DollarSign className="h-16 w-16 text-zinc-300 mb-4" />
            <p className="text-zinc-500">No spending data yet</p>
            <p className="text-sm text-zinc-400 mt-2">Add your first transaction to get started</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

