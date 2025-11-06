import { BrowserRouter as Router, Route, Routes, NavLink, useNavigate } from 'react-router-dom'
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
import { Button } from './components/ui/button'
import { useEffect, useState } from 'react'
import { LogOut, User as UserIcon } from 'lucide-react'
import { signOutUser } from './config/firebaseConfig'

function Layout({ children }) {
  const [isDark, setIsDark] = useState(false)
  const [ownerData, setOwnerData] = useState(null)
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
    // Check for GFCompany staff data
    const storedStaff = localStorage.getItem('gfcompany_staff')
    const staffId = localStorage.getItem('gfcompany_staffId')
    
    if (storedStaff && staffId) {
      setOwnerData(JSON.parse(storedStaff))  // Keep as ownerData for now (will update later)
    } else {
      // No auth found, redirect to signin
      navigate('/gfcompanysignin')
    }
  }, [navigate])

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
    
    setOwnerData(null)
    navigate('/gfcompanysignin')
  }

  // Get staff info
  const staffName = ownerData?.name || ''
  const staffEmail = ownerData?.email || ''
  const companyName = ownerData?.companyRoles?.[0]?.company?.name || 
                      JSON.parse(localStorage.getItem('gfcompany_company') || '{}')?.name || 
                      'GoFast Company'
  const staffRole = localStorage.getItem('gfcompany_role') || 'founder'

  // Define navigation items (all owners have access for now)
  const getMainNavItems = () => {
    return [
      { to: '/', label: 'GF Command Central' },
      { to: '/roadmap', label: 'Product Roadmap' },
      { to: '/company-roadmap', label: 'Company Roadmap' },
      { to: '/tasks', label: 'Task Management' },
    ]
  }

  const getToolsNavItems = () => {
    return [
      { to: '/financial-spends', label: 'Financial Spending' },
      { to: '/financial-projections', label: 'Financial Projections' },
      { to: '/crm', label: 'Company CRM' },
      { to: '/metrics', label: 'User Metrics' },
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
          {ownerData && (
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
        </nav>
        <div className="p-4 mt-auto space-y-2">
          <Button variant="outline" className="w-full" onClick={() => setIsDark((v) => !v)}>
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </Button>
          {ownerData && (
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
        {/* GFCompany Auth Pages */}
        <Route path="/gfsplash" element={<GFSplash />} />
        <Route path="/gfcompanysignin" element={<GFCompanySignin />} />
        <Route path="/gfcompanysignup" element={<GFCompanySignup />} />
        <Route path="/gfcompanywelcome" element={<GFCompanyWelcome />} />
        
        {/* Protected Routes with Layout */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<GFCommandCentral />} />
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
        
        {/* Redirect root to splash (checks auth state) */}
        <Route path="/" element={<GFSplash />} />
      </Routes>
    </Router>
  )
}

