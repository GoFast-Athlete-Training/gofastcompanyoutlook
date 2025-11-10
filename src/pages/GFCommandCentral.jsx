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
    const items = [
      {
        title: 'Join RunCrew',
        itemType: 'Feature',
        parentArchitecture: 'RunCrew',
        roadmapType: 'Product',
        category: 'Core Feature',
        whatItDoes: 'Allow users to join RunCrews and participate in group runs',
        howItHelps: 'Enables community building and group run coordination',
        priority: 'P1',
        status: 'In Progress',
        hoursEstimated: 40
      },
      {
        title: 'Messaging',
        itemType: 'Feature',
        parentArchitecture: 'Communication',
        roadmapType: 'Product',
        category: 'Core Feature',
        whatItDoes: 'Direct messaging between users and RunCrew members',
        howItHelps: 'Enables communication and coordination for runs and events',
        priority: 'P1',
        status: 'Not Started',
        hoursEstimated: 60
      },
      {
        title: 'Dynamic Leaderboard',
        itemType: 'Feature',
        parentArchitecture: 'Competition',
        roadmapType: 'Product',
        category: 'Engagement',
        whatItDoes: 'Real-time leaderboard showing top performers in RunCrews and challenges',
        howItHelps: 'Increases engagement and competition among runners',
        priority: 'P2',
        status: 'Not Started',
        hoursEstimated: 50
      },
      {
        title: 'Sales Partnership',
        itemType: 'Feature',
        parentArchitecture: 'Business',
        roadmapType: 'Product',
        category: 'Revenue',
        whatItDoes: 'Partnership management and sales tracking system',
        howItHelps: 'Enables tracking of partnerships and revenue opportunities',
        priority: 'P2',
        status: 'Not Started',
        hoursEstimated: 80
      },
      {
        title: 'Ambassador Program',
        itemType: 'Feature',
        parentArchitecture: 'Community',
        roadmapType: 'Product',
        category: 'Growth',
        whatItDoes: 'Ambassador program management and tracking',
        howItHelps: 'Enables community growth through ambassador network',
        priority: 'P2',
        status: 'Not Started',
        hoursEstimated: 70
      }
    ];

    console.log('🌱 Seeding product roadmap items...');
    let created = 0;
    let errors = 0;

    for (const item of items) {
      try {
        const response = await gfcompanyapi.post('/api/company/roadmap', item);
        if (response.data.success) {
          console.log(`✅ Created: ${item.title}`);
          created++;
        } else {
          console.error(`❌ Failed: ${item.title}`, response.data.error);
          errors++;
        }
      } catch (error) {
        console.error(`❌ Error: ${item.title}`, error.response?.data || error.message);
        errors++;
      }
    }

    console.log(`\n✅ Done! Created: ${created}, Errors: ${errors}`);
    setSeeding(false);
    
    if (created > 0) {
      // Reload the page to see the new items
      window.location.reload();
    } else {
      alert(`❌ Failed to seed roadmap items. Check console for errors.`);
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

