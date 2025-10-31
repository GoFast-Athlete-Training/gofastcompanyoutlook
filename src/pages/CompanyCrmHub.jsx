import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'

export default function CompanyCrmHub() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Company CRM</h1>
        <p className="text-zinc-600 mt-1">Business development pipeline - clubs and partnerships</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-zinc-500">Total Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-zinc-500">Prospects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-zinc-500">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <Link to="/crm/list">
        <Card className="hover:shadow-lg transition cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-zinc-600" />
              <CardTitle>View Contact List</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-600">Manage all company CRM contacts</p>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}

