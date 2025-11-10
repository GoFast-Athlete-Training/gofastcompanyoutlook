import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Plus, Map, Edit2, Trash2, Filter, Calendar, Grid, List as ListIcon, CheckCircle2, Circle, Clock } from 'lucide-react'
import RoadmapWeighPointCreator from '../components/RoadmapWeighPointCreator'
import gfcompanyapi from '../lib/gfcompanyapi'

export default function ProductRoadmap() {
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [roadmapItems, setRoadmapItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [viewMode, setViewMode] = useState('List')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [filterFeatureType, setFilterFeatureType] = useState('All')
  const [sortBy, setSortBy] = useState('priority')

  // Load items from backend on mount
  useEffect(() => {
    loadRoadmapItems()
  }, [])

  const loadRoadmapItems = async () => {
    try {
      setLoading(true)
      console.log('🚀 PRODUCT ROADMAP: Loading roadmap items...')

      const response = await gfcompanyapi.get('/api/company/roadmap')

      if (response.data.success) {
        console.log('✅ PRODUCT ROADMAP: Loaded', response.data.count, 'items')
        // Map backend fields to frontend fields
        const mappedItems = (response.data.roadmapItems || []).map(item => ({
          ...item,
          featureName: item.title, // Map title to featureName for frontend
          featureType: item.roadmapType, // Map roadmapType to featureType
          hoursEst: item.hoursEstimated // Map hoursEstimated to hoursEst
        }))
        setRoadmapItems(mappedItems)
      } else {
        console.error('❌ PRODUCT ROADMAP: Failed to load items:', response.data.error)
      }
    } catch (error) {
      console.error('❌ PRODUCT ROADMAP: Error loading items:', error)
      if (error.response?.status === 404 && error.response?.data?.message?.includes('company')) {
        navigate('/company-settings')
        return
      }
    } finally {
      setLoading(false)
    }
  }

  // Map frontend fields to backend fields
  const mapItemToBackend = (item) => {
    return {
      title: item.featureName || item.title,
      itemType: item.itemType || 'Feature',
      parentArchitecture: item.parentArchitecture || null,
      roadmapType: item.featureType || item.roadmapType || 'Product',
      category: item.category || 'Frontend Demo',
      whatItDoes: item.whatItDoes || null,
      howItHelps: item.howItHelps || null,
      fieldsData: item.fieldsData || null,
      howToGet: item.howToGet || null,
      prerequisites: item.prerequisites || null,
      visual: item.visual || 'List',
      hoursEstimated: item.hoursEst ? parseInt(item.hoursEst) : null,
      targetDate: item.targetDate || null,
      priority: item.priority || 'P1',
      status: item.status || 'Not Started'
    }
  }

  const handleEditItem = (item) => {
    setEditingItem(item)
    setModalOpen(true)
  }

  const handleDeleteItem = async (id) => {
    if (!confirm('Are you sure you want to delete this roadmap item?')) {
      return
    }

    try {
      console.log('🚀 PRODUCT ROADMAP: Deleting item:', id)
      const response = await gfcompanyapi.delete(`/api/company/roadmap/${id}`)

      if (response.data.success) {
        console.log('✅ PRODUCT ROADMAP: Item deleted')
        await loadRoadmapItems() // Reload items
      } else {
        console.error('❌ PRODUCT ROADMAP: Failed to delete item:', response.data.error)
        alert('Failed to delete item: ' + (response.data.message || response.data.error))
      }
    } catch (error) {
      console.error('❌ PRODUCT ROADMAP: Error deleting item:', error)
      alert('Error deleting item: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleSubmit = async (item) => {
    setSaving(true)
    try {
      const backendData = mapItemToBackend(item)

      if (editingItem) {
        // Update existing item
        console.log('🚀 PRODUCT ROADMAP: Updating item:', editingItem.id)
        const response = await gfcompanyapi.put(`/api/company/roadmap/${editingItem.id}`, backendData)

        if (response.data.success) {
          console.log('✅ PRODUCT ROADMAP: Item updated')
          await loadRoadmapItems() // Reload items
        } else {
          console.error('❌ PRODUCT ROADMAP: Failed to update item:', response.data.error)
          alert('Failed to update item: ' + (response.data.message || response.data.error))
          return
        }
      } else {
        // Create new item
        console.log('🚀 PRODUCT ROADMAP: Creating item...')
        const response = await gfcompanyapi.post('/api/company/roadmap', backendData)

        if (response.data.success) {
          console.log('✅ PRODUCT ROADMAP: Item created')
          await loadRoadmapItems() // Reload items
        } else {
          console.error('❌ PRODUCT ROADMAP: Failed to create item:', response.data.error)
          alert('Failed to create item: ' + (response.data.message || response.data.error))
          return
        }
      }

      setModalOpen(false)
      setEditingItem(null)
    } catch (error) {
      console.error('❌ PRODUCT ROADMAP: Error saving item:', error)
      alert('Error saving item: ' + (error.response?.data?.message || error.message))
    } finally {
      setSaving(false)
    }
  }

  const handleCloseModal = () => {
    if (!saving) {
      setModalOpen(false)
      setEditingItem(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Product Roadmap</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">Strategic product roadmap items</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-sky-500"></div>
        </div>
      </div>
    )
  }

  // Filter and sort items
  const filteredItems = roadmapItems
    .filter(item => {
      if (filterStatus !== 'All' && item.status !== filterStatus) return false
      if (filterPriority !== 'All' && item.priority !== filterPriority) return false
      if (filterFeatureType !== 'All' && item.featureType !== filterFeatureType) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { 'P0': 0, 'P1': 1, 'P2': 2 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        case 'targetDate':
          return (a.targetDate || '').localeCompare(b.targetDate || '')
        case 'status':
          const statusOrder = { 'Not Started': 0, 'In Progress': 1, 'Done': 2 }
          return statusOrder[a.status] - statusOrder[b.status]
        case 'name':
          return (a.featureName || '').localeCompare(b.featureName || '')
        default:
          return 0
      }
    })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Done':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Circle className="h-4 w-4 text-zinc-400" />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'P0':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      case 'P1':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
      case 'P2':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
      default:
        return 'bg-zinc-100 text-zinc-700'
    }
  }

  const renderListView = () => {
    if (filteredItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Map className="h-16 w-16 text-zinc-300 mb-4" />
          <p className="text-zinc-500">No roadmap items found</p>
          <p className="text-sm text-zinc-400 mt-2">
            {roadmapItems.length === 0 
              ? 'Add your first product roadmap item' 
              : 'Try adjusting your filters'}
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(item.status)}
                    <h3 className="font-semibold text-lg">{item.featureName}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                    <span className="px-2 py-1 rounded text-xs bg-zinc-100 dark:bg-zinc-800">
                      {item.featureType}
                    </span>
                    {item.itemType === 'Milestone' && (
                      <span className="px-2 py-1 rounded text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                        Milestone
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                    <div>
                      <span className="font-medium">Category:</span> {item.category}
                    </div>
                    {item.parentArchitecture && (
                      <div>
                        <span className="font-medium">Parent:</span> {item.parentArchitecture}
                      </div>
                    )}
                    {item.hoursEst && (
                      <div>
                        <span className="font-medium">Hours:</span> {item.hoursEst}
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
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditItem(item)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const renderKanbanView = () => {
    const columns = [
      { status: 'Not Started', label: 'Not Started' },
      { status: 'In Progress', label: 'In Progress' },
      { status: 'Done', label: 'Done' }
    ]

    if (filteredItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Map className="h-16 w-16 text-zinc-300 mb-4" />
          <p className="text-zinc-500">No roadmap items found</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-3 gap-4">
        {columns.map((column) => {
          const columnItems = filteredItems.filter(item => item.status === column.status)
          return (
            <div key={column.status} className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-zinc-500 mb-3">
                {column.label} ({columnItems.length})
              </h3>
              {columnItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm flex-1">{item.featureName}</h4>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1 mb-2">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                      <span className="inline-block px-2 py-0.5 rounded text-xs bg-zinc-100 dark:bg-zinc-800 ml-1">
                        {item.featureType}
                      </span>
                    </div>
                    {item.whatItDoes && (
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                        {item.whatItDoes}
                      </p>
                    )}
                    {item.targetDate && (
                      <p className="text-xs text-zinc-500 mt-2">
                        Target: {new Date(item.targetDate).toLocaleDateString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        })}
      </div>
    )
  }

  const renderTimelineView = () => {
    if (filteredItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Map className="h-16 w-16 text-zinc-300 mb-4" />
          <p className="text-zinc-500">No roadmap items found</p>
        </div>
      )
    }

    // Group items by target date
    const groupedByDate = filteredItems.reduce((acc, item) => {
      const date = item.targetDate || 'No Date'
      if (!acc[date]) acc[date] = []
      acc[date].push(item)
      return acc
    }, {})

    const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
      if (a === 'No Date') return 1
      if (b === 'No Date') return -1
      return a.localeCompare(b)
    })

    return (
      <div className="space-y-6">
        {sortedDates.map((date) => (
          <div key={date}>
            <h3 className="font-semibold text-lg mb-3 text-zinc-700 dark:text-zinc-300">
              {date === 'No Date' ? 'No Target Date' : new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <div className="space-y-3">
              {groupedByDate[date].map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(item.status)}
                          <h4 className="font-semibold">{item.featureName}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </span>
                        </div>
                        {item.whatItDoes && (
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.whatItDoes}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Product Roadmap</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            {roadmapItems.length} {roadmapItems.length === 1 ? 'item' : 'items'} total
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} disabled={saving}>
          <Plus className="h-4 w-4 mr-2" />
          Add Roadmap Item
        </Button>
      </div>

      {/* Filters and Controls */}
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
              <option value="All">All Status</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-1.5 border rounded-md text-sm"
            >
              <option value="All">All Priorities</option>
              <option value="P0">P0 - Must have</option>
              <option value="P1">P1 - Should have</option>
              <option value="P2">P2 - Nice to have</option>
            </select>

            <select
              value={filterFeatureType}
              onChange={(e) => setFilterFeatureType(e.target.value)}
              className="px-3 py-1.5 border rounded-md text-sm"
            >
              <option value="All">All Types</option>
              <option value="Product">Product</option>
              <option value="GTM">GTM</option>
              <option value="Operations">Operations</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="UX/Design">UX/Design</option>
            </select>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 border rounded-md text-sm"
              >
                <option value="priority">Priority</option>
                <option value="targetDate">Target Date</option>
                <option value="status">Status</option>
                <option value="name">Name</option>
              </select>
            </div>

            <div className="flex items-center gap-1 border-l pl-4 ml-2">
              <Button
                variant={viewMode === 'List' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('List')}
              >
                <ListIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'Kanban' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('Kanban')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'Timeline' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('Timeline')}
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roadmap Items Display */}
      <Card>
        <CardHeader>
          <CardTitle>
            {viewMode} View {filteredItems.length !== roadmapItems.length && 
              `(${filteredItems.length} of ${roadmapItems.length})`
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === 'List' && renderListView()}
          {viewMode === 'Kanban' && renderKanbanView()}
          {viewMode === 'Timeline' && renderTimelineView()}
        </CardContent>
      </Card>

      <RoadmapWeighPointCreator 
        isOpen={modalOpen} 
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingItem={editingItem}
        disabled={saving}
      />
    </div>
  )
}

