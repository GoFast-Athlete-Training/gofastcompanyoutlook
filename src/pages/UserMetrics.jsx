import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { BarChart3 } from 'lucide-react'

export default function UserMetrics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Metrics</h1>
        <p className="text-zinc-600 mt-1">Read-only user counts and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-zinc-500">Total Athletes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,247</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-zinc-500">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">892</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-zinc-500">Growth Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12.5%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BarChart3 className="h-16 w-16 text-zinc-300 mb-4" />
            <p className="text-zinc-500">Detailed analytics coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

