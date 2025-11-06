import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Building2, User, Briefcase } from 'lucide-react'

const ROLES = [
  { value: 'founder', label: 'Founder', description: 'Company founder with full access' },
  { value: 'admin', label: 'Admin', description: 'Administrative access' },
  { value: 'manager', label: 'Manager', description: 'Department management' },
  { value: 'employee', label: 'Employee', description: 'Standard employee access' },
]

const DEPARTMENTS = [
  'Product',
  'Engineering',
  'GTM',
  'Operations',
  'Finance',
  'Marketing',
  'Sales',
  'Customer Success',
  'HR',
  'Executive'
]

export default function CompanyLogin() {
  const navigate = useNavigate()
  const [companyId, setCompanyId] = useState('')
  const [email, setEmail] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!companyId || !email || !selectedRole || !selectedDepartment) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    // Store company auth data
    const authData = {
      companyId,
      email,
      role: selectedRole,
      department: selectedDepartment,
      loginTime: new Date().toISOString()
    }

    localStorage.setItem('company_auth', JSON.stringify(authData))

    setLoading(false)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-950 flex items-center justify-center px-4 py-12">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="w-20 h-20 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl">Company Outlook</CardTitle>
          <CardDescription>
            Sign in with your company ID and select your role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company ID */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Company ID
              </label>
              <Input
                type="text"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                required
                placeholder="Enter your company ID"
                className="w-full"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@company.com"
                className="w-full"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Role</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedRole === role.value
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20 dark:border-sky-400'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-sky-300 dark:hover:border-sky-700'
                    }`}
                  >
                    <div className="font-semibold">{role.label}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                      {role.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Department Selection */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                required
                className="w-full h-9 px-3 py-1 rounded-md border border-input bg-white dark:bg-zinc-900 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Select your department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
              Demo mode: Enter any credentials to continue
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

