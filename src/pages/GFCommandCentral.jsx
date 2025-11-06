import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Link } from 'react-router-dom'
import { Map, Target, ListTodo } from 'lucide-react'

const stats = [
  { label: 'Total Users', value: 0 },
  { label: 'Monthly Burn', value: '$0' },
  { label: 'Runway', value: '--' },
]

const mainNavOptions = [
  {
    title: 'Product Roadmap',
    description: 'Company-wide product roadmap items',
    icon: <Map className="h-8 w-8" />,
    path: '/roadmap',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    title: 'Company Roadmap',
    description: 'Strategic company initiatives and goals',
    icon: <Target className="h-8 w-8" />,
    path: '/company-roadmap',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Task Management',
    description: 'Manage tasks by department and priority',
    icon: <ListTodo className="h-8 w-8" />,
    path: '/tasks',
    color: 'bg-orange-100 text-orange-600'
  },
]

export default function GFCommandCentral() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">GF Command Central</h1>
        <p className="text-zinc-600">Manage GoFast growth, strategy, and execution</p>
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
        {mainNavOptions.map((option) => (
          <Link key={option.path} to={option.path}>
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardHeader>
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${option.color} mb-4`}>
                  {option.icon}
                </div>
                <CardTitle>{option.title}</CardTitle>
                <CardContent>
                  <p className="text-zinc-600 text-sm">{option.description}</p>
                </CardContent>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

