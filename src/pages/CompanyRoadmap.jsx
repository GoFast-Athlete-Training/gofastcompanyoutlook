import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Map, Plus, ArrowRight, Filter, CheckCircle2, Circle, Clock } from 'lucide-react';
import gfcompanyapi from '../lib/gfcompanyapi';

export default function CompanyRoadmap() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roadmapItems, setRoadmapItems] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRoadmapType, setFilterRoadmapType] = useState('All');

  useEffect(() => {
    loadRoadmapItems();
  }, []);

  const loadRoadmapItems = async () => {
    try {
      setLoading(true);
      console.log('🚀 COMPANY ROADMAP: Loading roadmap items...');

      const response = await gfcompanyapi.get('/api/company/roadmap');

      if (response.data.success) {
        console.log('✅ COMPANY ROADMAP: Loaded', response.data.count, 'items');
        setRoadmapItems(response.data.roadmapItems || []);
      } else {
        console.error('❌ COMPANY ROADMAP: Failed to load items:', response.data.error);
      }
    } catch (error) {
      console.error('❌ COMPANY ROADMAP: Error loading items:', error);
      if (error.response?.status === 404 && error.response?.data?.message?.includes('company')) {
        // Company not found - redirect to settings
        navigate('/company-settings');
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Done':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Circle className="h-4 w-4 text-zinc-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'P0':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'P1':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'P2':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-zinc-100 text-zinc-700';
    }
  };

  const filteredItems = roadmapItems.filter(item => {
    if (filterStatus !== 'All' && item.status !== filterStatus) return false;
    if (filterRoadmapType !== 'All' && item.roadmapType !== filterRoadmapType) return false;
    return true;
  });

  const roadmapTypes = ['All', ...new Set(roadmapItems.map(item => item.roadmapType).filter(Boolean))];
  const statuses = ['All', 'Not Started', 'In Progress', 'Done'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Company Roadmap</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">Strategic company initiatives and goals</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-sky-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Map className="h-8 w-8" />
            Company Roadmap
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Strategic company initiatives and goals
          </p>
        </div>
        <Button onClick={() => navigate('/roadmap')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Roadmap Item
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-zinc-500" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 border rounded-md text-sm"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={filterRoadmapType}
              onChange={(e) => setFilterRoadmapType(e.target.value)}
              className="px-3 py-1.5 border rounded-md text-sm"
            >
              {roadmapTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Roadmap Items */}
      <Card>
        <CardHeader>
          <CardTitle>
            Roadmap Items ({filteredItems.length} of {roadmapItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Map className="h-16 w-16 text-zinc-300 mb-4" />
              <p className="text-zinc-500">No roadmap items found</p>
              <p className="text-sm text-zinc-400 mt-2">
                {roadmapItems.length === 0 
                  ? 'Get started by creating your first roadmap item' 
                  : 'Try adjusting your filters'}
              </p>
              {roadmapItems.length === 0 && (
                <Button 
                  onClick={() => navigate('/roadmap')} 
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Roadmap Item
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(item.status)}
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </span>
                          {item.roadmapType && (
                            <span className="px-2 py-1 rounded text-xs bg-zinc-100 dark:bg-zinc-800">
                              {item.roadmapType}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                          {item.parentArchitecture && (
                            <div>
                              <span className="font-medium">Parent:</span> {item.parentArchitecture}
                            </div>
                          )}
                          {item.category && (
                            <div>
                              <span className="font-medium">Category:</span> {item.category}
                            </div>
                          )}
                          {item.hoursEstimated && (
                            <div>
                              <span className="font-medium">Hours:</span> {item.hoursEstimated}
                            </div>
                          )}
                          {item.targetDate && (
                            <div>
                              <span className="font-medium">Target:</span> {new Date(item.targetDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        {item.whatItDoes && (
                          <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                            <span className="font-medium">What it does:</span> {item.whatItDoes}
                          </p>
                        )}
                        {item.howItHelps && (
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            <span className="font-medium">How it helps:</span> {item.howItHelps}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/roadmap')}
                        className="ml-4"
                      >
                        View <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
