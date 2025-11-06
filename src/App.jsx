import { BrowserRouter as Router, Route, Routes, NavLink, useNavigate } from 'react-router-dom'
import CompanyAdminNav from './pages/CompanyAdminNav'
import Splash from './pages/Splash'
import FinancialSpends from './pages/FinancialSpends'
import FinancialProjections from './pages/FinancialProjections'
import CompanyTasks from './pages/CompanyTasks'
import ProductRoadmap from './pages/ProductRoadmap'
import CompanyRoadmap from './pages/CompanyRoadmap'
import CompanyCrmList from './pages/CompanyCrmList'
import CompanyCrmHub from './pages/CompanyCrmHub'
import UserMetrics from './pages/UserMetrics'
import { Button } from './components/ui/button'
import { useEffect, useState } from 'react'
import { LogOut, User as UserIcon } from 'lucide-react'

function Layout({ children }) {
  const [isDark, setIsDark] = useState(false)
  const [authData, setAuthData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDark])

  useEffect(() => {
    const stored = localStorage.getItem('company_auth')
    if (stored) {
      setAuthData(JSON.parse(stored))
    } else {
      // No auth found, redirect to splash
      navigate('/splash')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('company_auth')
    localStorage.removeItem('company_invite_token')
    setAuthData(null)
    navigate('/splash')
  }

  // Get user role and department
  const userRole = authData?.role || ''
  const userDepartment = authData?.department || ''
  const userEmail = authData?.email || ''

  // Define navigation items based on role
  const getMainNavItems = () => {
    const allItems = [
      { to: '/', label: 'Company Hub', roles: ['founder', 'admin', 'manager', 'employee'] },
      { to: '/roadmap', label: 'Product Roadmap', roles: ['founder', 'admin', 'manager'], departments: ['Product', 'Engineering'] },
      { to: '/company-roadmap', label: 'Company Roadmap', roles: ['founder', 'admin', 'manager'] },
      { to: '/tasks', label: 'Task Management', roles: ['founder', 'admin', 'manager', 'employee'] },
    ]

    return allItems.filter(item => {
      // Check role access
      if (!item.roles.includes(userRole)) return false
      // Check department access if specified
      if (item.departments && !item.departments.includes(userDepartment)) return false
      return true
    })
  }

  const getToolsNavItems = () => {
    const allItems = [
      { to: '/financial-spends', label: 'Financial Spending', roles: ['founder', 'admin', 'manager'], departments: ['Finance', 'Executive'] },
      { to: '/financial-projections', label: 'Financial Projections', roles: ['founder', 'admin'], departments: ['Finance', 'Executive'] },
      { to: '/crm', label: 'Company CRM', roles: ['founder', 'admin', 'manager'], departments: ['Sales', 'GTM', 'Marketing', 'Executive'] },
      { to: '/metrics', label: 'User Metrics', roles: ['founder', 'admin', 'manager'] },
    ]

    return allItems.filter(item => {
      if (!item.roles.includes(userRole)) return false
      if (item.departments && !item.departments.includes(userDepartment)) return false
      return true
    })
  }

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="border-r bg-white dark:bg-zinc-900 dark:text-zinc-100">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 font-semibold mb-2">
            <img src="/logo.jpg" alt="GoFast" className="w-8 h-8 rounded-full" />
            <span>Company Outlook</span>
          </div>
          {authData && (
            <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
              <div className="flex items-center gap-1">
                <UserIcon className="h-3 w-3" />
                <span className="truncate">{userEmail}</span>
              </div>
              <div className="capitalize">{userRole} • {userDepartment}</div>
            </div>
          )}
        </div>
        <nav className="p-2 space-y-4">
          {/* Main Navigation */}
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide px-3 py-2">Main</p>
            {getMainNavItems().map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 text-sm ${isActive ? 'bg-sky-500 text-white' : 'hover:bg-sky-50 dark:hover:bg-zinc-800'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          
          {/* Tools */}
          {getToolsNavItems().length > 0 && (
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide px-3 py-2">Tools</p>
              {getToolsNavItems().map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2 text-sm ${isActive ? 'bg-sky-500 text-white' : 'hover:bg-sky-50 dark:hover:bg-zinc-800'}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}
        </nav>
        <div className="p-4 mt-auto space-y-2">
          <Button variant="outline" className="w-full" onClick={() => setIsDark((v) => !v)}>
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </Button>
          {authData && (
            <Button 
              variant="outline" 
              className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          )}
        </div>
      </aside>
      <main className="p-6 bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-100">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/splash" element={<Splash />} />
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<CompanyAdminNav />} />
                <Route path="/financial-spends" element={<FinancialSpends />} />
                <Route path="/financial-projections" element={<FinancialProjections />} />
                <Route path="/tasks" element={<CompanyTasks />} />
                <Route path="/roadmap" element={<ProductRoadmap />} />
                <Route path="/company-roadmap" element={<CompanyRoadmap />} />
                <Route path="/crm" element={<CompanyCrmHub />} />
                <Route path="/crm/list" element={<CompanyCrmList />} />
                <Route path="/metrics" element={<UserMetrics />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  )
}

