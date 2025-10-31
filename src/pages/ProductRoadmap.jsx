import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Plus, Map } from 'lucide-react'

export default function ProductRoadmap() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Product Roadmap</h1>
          <p className="text-zinc-600 mt-1">Company-wide product roadmap items</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Roadmap Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roadmap Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Map className="h-16 w-16 text-zinc-300 mb-4" />
            <p className="text-zinc-500">No roadmap items yet</p>
            <p className="text-sm text-zinc-400 mt-2">Add your first product roadmap item</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

