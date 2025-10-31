import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Link } from 'react-router-dom'
import { DollarSign, TrendingUp, CheckSquare, Map, Users, BarChart3 } from 'lucide-react'

const stats = [
  { label: 'Total Users', value: 1247 },
  { label: 'Monthly Burn', value: '$45,000' },
  { label: 'Runway', value: '8 months' },
]

const navOptions = [
  {
    title: 'Financial Spending',
    description: 'Track actual spending transactions (items)',
    icon: <DollarSign className="h-8 w-8" />,
    path: '/financial-spends',
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'Financial Projections',
    description: 'Manage budgets and projections (totals)',
    icon: <TrendingUp className="h-8 w-8" />,
    path: '/financial-projections',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Product Roadmap',
    description: 'Company-wide product roadmap items',
    icon: <Map className="h-8 w-8" />,
    path: '/roadmap',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    title: 'Company Tasks',
    description: 'Manage tasks by department',
    icon: <CheckSquare className="h-8 w-8" />,
    path: '/tasks',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    title: 'Company CRM',
    description: 'BD pipeline - clubs and partnerships',
    icon: <Users className="h-8 w-8" />,
    path: '/crm',
    color: 'bg-pink-100 text-pink-600'
  },
  {
    title: 'User Metrics',
    description: 'Read-only user counts and analytics',
    icon: <BarChart3 className="h-8 w-8" />,
    path: '/metrics',
    color: 'bg-indigo-100 text-indigo-600'
  },
]

export default function CompanyAdminNav() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Company Outlook</h1>
        <p className="text-zinc-600">Manage company growth, financials, and operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader>
              <CardTitle className="text-base text-zinc-500">{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {navOptions.map((option) => (
          <Link key={option.path} to={option.path}>
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardHeader>
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${option.color} mb-4`}>
                  {option.icon}
                </div>
                <CardTitle>{option.title}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-500">Click to view</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

