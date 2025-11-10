import { BrowserRouter as Router, Route, Routes, NavLink, useNavigate, Outlet, Navigate } from 'react-router-dom'
import GFSplash from './pages/GFSplash'
import GFCommandCentral from './pages/GFCommandCentral'
import GFCompanySignin from './pages/gfcompanysignin'
import GFCompanySignup from './pages/gfcompanysignup'
import GFCompanyWelcome from './pages/gfcompanywelcome'
import FinancialSpends from './pages/FinancialSpends'
import FinancialProjections from './pages/FinancialProjections'
import CompanyTasks from './pages/CompanyTasks'
import ProductRoadmap from './pages/ProductRoadmap'
import CompanyRoadmap from './pages/CompanyRoadmap'
import CompanyCrmList from './pages/CompanyCrmList'
import CompanyCrmHub from './pages/CompanyCrmHub'
import UserMetrics from './pages/UserMetrics'
import CompanySettings from './pages/CompanySettings'
import { Button } from './components/ui/button'
import { useEffect, useState } from 'react'
import { LogOut, User as UserIcon, Settings } from 'lucide-react'
import { signOutUser } from './config/firebaseConfig'
import { getAuth } from 'firebase/auth'
import useHydratedStaff from './hooks/useHydratedStaff'

function Layout() {
  const [isDark, setIsDark] = useState(false)
  const navigate = useNavigate()
  const { staff, staffId, company, companyId, role, firebaseId } = useHydratedStaff()

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDark])

  useEffect(() => {
    // Always check if we have Firebase auth - if not, redirect to signin
    const auth = getAuth()
    const firebaseUser = auth.currentUser

    if (!firebaseUser && !firebaseId) {
      console.log('❌ GFCompany Layout: No Firebase user → redirecting to signin')
      navigate('/gfcompanysignin', { replace: true })
      return
    }

    // If we don't have staff data, redirect to welcome to hydrate
    // BUT allow access to company-settings page (it can create company)
    const currentPath = window.location.pathname
    const isCompanySettings = currentPath.includes('/company-settings')
    
    if (!staff || !staffId) {
      if (!isCompanySettings) {
        console.log('⚠️ GFCompany Layout: No staff data → redirecting to welcome for hydration')
        navigate('/gfcompanywelcome', { replace: true })
        return
      }
    }

    console.log('✅ GFCompany Layout: Staff data loaded via hook')
  }, [navigate, staff, staffId, firebaseId])

  const handleLogout = async () => {
    try {
      await signOutUser()
    } catch (error) {
      console.error('GFCompany: Logout error:', error)
    }
    
    // Clear all GFCompany auth data
    localStorage.removeItem('gfcompany_staff')
    localStorage.removeItem('gfcompany_staffId')
    localStorage.removeItem('gfcompany_firebaseId')
    localStorage.removeItem('gfcompany_firebaseToken')
    localStorage.removeItem('gfcompany_email')
    localStorage.removeItem('gfcompany_companyHQId')
    localStorage.removeItem('gfcompany_companyHQ')
    localStorage.removeItem('gfcompany_companies')
    localStorage.removeItem('gfcompany_role')
    
    navigate('/gfcompanysignin')
  }

  // Get staff info from hook
  const staffName = staff ? `${staff.firstName || ''} ${staff.lastName || ''}`.trim() : ''
  const staffEmail = staff?.email || ''
  const companyName = company?.companyName || 'GoFast Company'
  const staffRole = role || staff?.role || 'founder'

  // Define navigation items (all owners have access for now)
  // Routes are nested under /command-central, so use relative paths
  const getMainNavItems = () => {
    return [
      { to: '/command-central', label: 'GF Command Central' },
      { to: '/command-central/roadmap', label: 'Product Roadmap' },
      { to: '/command-central/company-roadmap', label: 'Company Roadmap' },
      { to: '/command-central/tasks', label: 'Task Management' },
    ]
  }

  const getToolsNavItems = () => {
    return [
      { to: '/command-central/financial-spends', label: 'Financial Spending' },
      { to: '/command-central/financial-projections', label: 'Financial Projections' },
      { to: '/command-central/crm', label: 'Company CRM' },
      { to: '/command-central/metrics', label: 'User Metrics' },
    ]
  }

  const getSettingsNavItems = () => {
    return [
      { to: '/command-central/company-settings', label: 'Company Settings', icon: Settings },
    ]
  }

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="border-r bg-white dark:bg-zinc-900 dark:text-zinc-100">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 font-semibold mb-2">
            <img src="/logo.jpg" alt="GoFast" className="w-8 h-8 rounded-full" />
            <span>GF Company</span>
          </div>
          {staff && (
            <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
              <div className="flex items-center gap-1">
                <UserIcon className="h-3 w-3" />
                <span className="truncate">{staffEmail}</span>
              </div>
              <div className="truncate capitalize">{staffRole} • {companyName}</div>
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

          {/* Settings */}
          {getSettingsNavItems().length > 0 && (
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide px-3 py-2">Settings</p>
              {getSettingsNavItems().map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${isActive ? 'bg-sky-500 text-white' : 'hover:bg-sky-50 dark:hover:bg-zinc-800'}`
                    }
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {item.label}
                  </NavLink>
                )
              })}
            </div>
          )}
        </nav>
        <div className="p-4 mt-auto space-y-2 border-t">
          <Button variant="outline" className="w-full" onClick={() => setIsDark((v) => !v)}>
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </Button>
          {staff && (
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
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default function App() {
  const NotFound = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-100">
      <img src="/logo.jpg" alt="GoFast Company" className="h-16 w-16 rounded-full mb-6" />
      <h1 className="text-3xl font-bold mb-2">Page not found</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
        This route isn’t set up yet. Double-check the URL or wire up the page.
      </p>
      <NavLink
        to="/command-central"
        className="px-4 py-2 rounded-md bg-sky-500 text-white hover:bg-sky-600 transition"
      >
        Go to Command Central
      </NavLink>
    </div>
  )

  return (
    <Router>
      <Routes>
        {/* GFCompany Auth Pages */}
        <Route path="/splash" element={<GFSplash />} />
        <Route path="/gfsplash" element={<GFSplash />} />
        <Route path="/gfcompanysignin" element={<GFCompanySignin />} />
        <Route path="/gfcompanysignup" element={<GFCompanySignup />} />
        <Route path="/gfcompanywelcome" element={<GFCompanyWelcome />} />
        
        {/* Root redirect - go to splash first */}
        <Route path="/" element={<Navigate to="/gfsplash" replace />} />
        
        {/* Protected Routes with Layout */}
        <Route path="/command-central" element={<Layout />}>
          <Route index element={<GFCommandCentral />} />
          <Route path="financial-spends" element={<FinancialSpends />} />
          <Route path="financial-projections" element={<FinancialProjections />} />
          <Route path="tasks" element={<CompanyTasks />} />
          <Route path="roadmap" element={<ProductRoadmap />} />
          <Route path="company-roadmap" element={<CompanyRoadmap />} />
          <Route path="company-settings" element={<CompanySettings />} />
          <Route path="crm" element={<CompanyCrmHub />} />
          <Route path="crm/list" element={<CompanyCrmList />} />
          <Route path="metrics" element={<UserMetrics />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

