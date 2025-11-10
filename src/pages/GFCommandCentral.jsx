import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Link } from 'react-router-dom'
import { Map, Target, ListTodo, Building2, Sparkles } from 'lucide-react'
import useHydratedStaff from '../hooks/useHydratedStaff'
import gfcompanyapi from '../lib/gfcompanyapi'
import { useState, useEffect } from 'react'

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

const settingsOptions = [
  {
    title: 'Company Settings',
    description: 'Manage company details and configuration',
    icon: <Building2 className="h-8 w-8" />,
    path: '/company-settings',
    color: 'bg-sky-100 text-sky-600'
  },
]

export default function GFCommandCentral() {
  const { staff, staffId, company, companyId, role } = useHydratedStaff();
  const [seeding, setSeeding] = useState(false);
  const [hasRoadmapItems, setHasRoadmapItems] = useState(false);
  const [checking, setChecking] = useState(true);
  
  // Debug: Log what we actually have
  console.log('🔍 GFCommandCentral: Staff loaded:', !!staff, 'Staff ID:', staffId);
  console.log('🔍 GFCommandCentral: Company loaded:', !!company, 'Company ID:', companyId);
  console.log('🔍 GFCommandCentral: Role:', role);
  
  // Check if roadmap items exist
  useEffect(() => {
    const checkRoadmapItems = async () => {
      try {
        const response = await gfcompanyapi.get('/api/company/roadmap?roadmapType=Product');
        if (response.data.success) {
          setHasRoadmapItems(response.data.roadmapItems?.length > 0);
        }
      } catch (error) {
        console.error('Error checking roadmap items:', error);
      } finally {
        setChecking(false);
      }
    };
    
    if (companyId) {
      checkRoadmapItems();
    }
  }, [companyId]);
  
  if (company) {
    console.log('🔍 GFCommandCentral: Company Name:', company.companyName);
    console.log('🔍 GFCommandCentral: Contacts:', company.contacts?.length || 0);
    console.log('🔍 GFCommandCentral: Tasks:', company.tasks?.length || 0);
  }

  const seedProductRoadmap = async () => {
    setSeeding(true);
    
    // Just seed the first item to test upsert
    const item = {
      title: 'Join RunCrew',
      itemType: 'Feature',
      parentArchitecture: 'RunCrew',
      roadmapType: 'Product',
      category: 'Core Feature',
      whatItDoes: 'Allow users to join RunCrews and participate in group runs',
      howItHelps: 'Enables community building and group run coordination',
      fieldsData: 'RunCrew ID, User ID, Join Date, Role',
      howToGet: 'GET /api/runcrew/:id, POST /api/runcrew/:id/join',
      prerequisites: 'User must be authenticated, RunCrew must exist',
      visual: 'List',
      priority: 'P1',
      status: 'In Progress',
      hoursEstimated: 40,
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    };

    console.log('🌱 Seeding product roadmap item:', item.title);
    console.log('📋 Fields:', item);

    try {
      const response = await gfcompanyapi.post('/api/company/roadmap', item);
      if (response.data.success) {
        console.log(`✅ Created: ${item.title}`, response.data.roadmapItem);
        alert(`✅ Created roadmap item: ${item.title}\n\nRefresh to see it, then test upsert!`);
        setSeeding(false);
        window.location.reload();
      } else {
        console.error(`❌ Failed:`, response.data.error);
        alert(`❌ Failed to create: ${response.data.error}`);
        setSeeding(false);
      }
    } catch (error) {
      console.error(`❌ Error:`, error.response?.data || error.message);
      alert(`❌ Error: ${error.response?.data?.message || error.message}`);
      setSeeding(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">GF Command Central</h1>
          <p className="text-zinc-600">Manage GoFast growth, strategy, and execution</p>
        </div>
        {/* Show seed button if no roadmap items exist (or while checking) */}
        {!checking && !hasRoadmapItems && (
          <Button 
            onClick={seedProductRoadmap} 
            disabled={seeding}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {seeding ? 'Seeding...' : 'Seed Product Roadmap'}
          </Button>
        )}
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

      {/* Settings Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {settingsOptions.map((option) => (
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
    </div>
  )
}

