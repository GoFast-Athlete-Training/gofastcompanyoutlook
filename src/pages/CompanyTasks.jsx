import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Plus, CheckSquare } from 'lucide-react'

export default function CompanyTasks() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Company Tasks</h1>
          <p className="text-zinc-600 mt-1">Manage tasks by department</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckSquare className="h-16 w-16 text-zinc-300 mb-4" />
            <p className="text-zinc-500">No tasks yet</p>
            <p className="text-sm text-zinc-400 mt-2">Create your first company task</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

