import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom'
import CompanyAdminNav from './pages/CompanyAdminNav'
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

function Layout({ children }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDark])

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="border-r bg-white dark:bg-zinc-900 dark:text-zinc-100">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 font-semibold">
            <img src="/logo.jpg" alt="GoFast" className="w-8 h-8 rounded-full" />
            <span>Company Outlook</span>
          </div>
        </div>
        <nav className="p-2 space-y-4">
          {/* Main Navigation */}
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide px-3 py-2">Main</p>
            {[
              { to: '/', label: 'Company Hub' },
              { to: '/roadmap', label: 'Product Roadmap' },
              { to: '/company-roadmap', label: 'Company Roadmap' },
              { to: '/tasks', label: 'Task Management' },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 text-sm ${isActive ? 'bg-sky-500 text-white' : 'hover:bg-sky-50'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          
          {/* Tools */}
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide px-3 py-2">Tools</p>
            {[
              { to: '/financial-spends', label: 'Financial Spending' },
              { to: '/financial-projections', label: 'Financial Projections' },
              { to: '/crm', label: 'Company CRM' },
              { to: '/metrics', label: 'User Metrics' },
            ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm ${isActive ? 'bg-sky-500 text-white' : 'hover:bg-sky-50'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 mt-auto">
          <Button variant="outline" className="w-full" onClick={() => setIsDark((v) => !v)}>
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </Button>
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
    </Router>
  )
}

