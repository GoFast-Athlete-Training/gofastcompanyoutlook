import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Plus, Users } from 'lucide-react'

export default function CompanyCrmList() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contact List</h1>
          <p className="text-zinc-600 mt-1">All company CRM contacts</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-16 w-16 text-zinc-300 mb-4" />
            <p className="text-zinc-500">No contacts yet</p>
            <p className="text-sm text-zinc-400 mt-2">Add your first contact</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

