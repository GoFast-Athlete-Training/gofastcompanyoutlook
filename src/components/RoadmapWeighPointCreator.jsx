import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { X } from 'lucide-react'

export default function RoadmapWeighPointCreator({ isOpen, onClose, onSubmit, editingItem }) {
  const defaultFormData = {
    itemType: 'Feature', // Feature or Milestone
    featureName: '',
    parentArchitecture: '',
    featureType: 'Product',
    category: 'Frontend Demo',
    whatItDoes: '',
    howItHelps: '',
    fieldsData: '',
    howToGet: '',
    prerequisites: '',
    visual: 'List', // Default to List
    hoursEst: '',
    priority: 'P1',
    targetDate: '',
    status: 'Not Started'
  }

  const [formData, setFormData] = useState(defaultFormData)

  // Populate form when editing
  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem)
    } else {
      setFormData(defaultFormData)
    }
  }, [editingItem, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData(defaultFormData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{editingItem ? 'Edit Roadmap Item' : 'Add Roadmap Item'}</CardTitle>
            <CardDescription>
              {editingItem ? 'Update the roadmap item details' : 'Create a new roadmap item or milestone'}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Item Type</label>
              <select
                name="itemType"
                value={formData.itemType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="Feature">Feature</option>
                <option value="Milestone">Milestone</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{formData.itemType === 'Milestone' ? 'Milestone Name' : 'Feature Name'}</label>
              <input
                type="text"
                name="featureName"
                value={formData.featureName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Parent Architecture</label>
              <input
                type="text"
                name="parentArchitecture"
                value={formData.parentArchitecture}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., RunCrew, Profile, RunClub, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Feature Type</label>
              <select
                name="featureType"
                value={formData.featureType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="Product">Product</option>
                <option value="GTM">GTM</option>
                <option value="Operations">Operations</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="UX/Design">UX/Design</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="Frontend Demo">Frontend Demo</option>
                <option value="API Integration">API Integration</option>
                <option value="Backend Scaffolding">Backend Scaffolding</option>
                <option value="User Testing">User Testing</option>
                <option value="Release">Release</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">What it does (User value)</label>
              <textarea
                name="whatItDoes"
                value={formData.whatItDoes}
                onChange={handleChange}
                required
                rows="2"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">How it helps the overall build</label>
              <textarea
                name="howItHelps"
                value={formData.howItHelps}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., Enables other features, improves UX, reduces friction, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fields/Data Needed</label>
              <textarea
                name="fieldsData"
                value={formData.fieldsData}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">How to Get (APIs, routes, data sources)</label>
              <textarea
                name="howToGet"
                value={formData.howToGet}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., /api/feature/list, cloud storage API, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Prerequisites/Setup</label>
              <textarea
                name="prerequisites"
                value={formData.prerequisites}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., Research cloud storage, create account, get API key, setup auth"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Visual Presentation</label>
              <select
                name="visual"
                value={formData.visual}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="List">List</option>
                <option value="Timeline">Timeline</option>
                <option value="Kanban">Kanban</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Hours Estimated</label>
                <input
                  type="number"
                  name="hoursEst"
                  value={formData.hoursEst}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Target Date</label>
                <input
                  type="date"
                  name="targetDate"
                  value={formData.targetDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="P0">P0 - Must have</option>
                  <option value="P1">P1 - Should have</option>
                  <option value="P2">P2 - Nice to have</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {editingItem ? 'Update Roadmap Item' : 'Add Roadmap Item'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

