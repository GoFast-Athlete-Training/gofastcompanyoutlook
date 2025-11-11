import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { X } from 'lucide-react'

export default function RoadmapWeighPointCreator({ isOpen, onClose, onSubmit, editingItem }) {
  const defaultFormData = {
    itemType: 'Dev Work', // Dev Work or Product Milestone
    featureName: '',
    primaryRepo: '',
    category: 'Core Feature',
    whatItDoes: '',
    howItHelps: '',
    quickModelScaffolding: '',
    relationalMapping: '',
    apiIntegration: '',
    prerequisites: '',
    hoursEst: '',
    priority: 'Enhanced User Feature',
    targetDate: '',
    status: 'Not Started'
  }

  const [formData, setFormData] = useState(defaultFormData)

  // Populate form when editing or when modal opens with prefilled data
  useEffect(() => {
    if (editingItem) {
      // Map old field names to new ones for backward compatibility
      const mappedItem = {
        ...defaultFormData,
        ...editingItem,
        // Map old fields to new ones
        primaryRepo: editingItem.primaryRepo || editingItem.parentArchitecture || '',
        quickModelScaffolding: editingItem.quickModelScaffolding || editingItem.fieldsData || '',
        apiIntegration: editingItem.apiIntegration || editingItem.howToGet || '',
        // Keep new fields as-is
        relationalMapping: editingItem.relationalMapping || '',
        // Map priority from old P0/P1/P2 to new values
        priority: editingItem.priority === 'P0' ? 'Critical Path' :
                  editingItem.priority === 'P1' ? 'Enhanced User Feature' :
                  editingItem.priority === 'P2' ? 'Future Release' :
                  editingItem.priority || 'Enhanced User Feature',
        // Map itemType
        itemType: editingItem.itemType === 'Feature' ? 'Dev Work' :
                  editingItem.itemType === 'Milestone' ? 'Product Milestone' :
                  editingItem.itemType || 'Dev Work'
      }
      setFormData(mappedItem)
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
                <option value="Dev Work">Dev Work</option>
                <option value="Product Milestone">Product Milestone</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{formData.itemType === 'Product Milestone' ? 'Milestone Name' : 'Feature Name'}</label>
              <input
                type="text"
                name="featureName"
                value={formData.featureName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
                placeholder={formData.itemType === 'Product Milestone' ? 'e.g., Get on GooglePlay' : 'e.g., Join RunCrew'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Primary Repo</label>
              <input
                type="text"
                name="primaryRepo"
                value={formData.primaryRepo}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., mvp1, eventslanding, companystack"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="Core Feature">Core Feature</option>
                <option value="Frontend Demo">Frontend Demo</option>
                <option value="API Integration">API Integration</option>
                <option value="Backend Scaffolding">Backend Scaffolding</option>
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
                placeholder="What does this feature do for users?"
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
              <label className="block text-sm font-medium mb-1">Quick Model Scaffolding</label>
              <textarea
                name="quickModelScaffolding"
                value={formData.quickModelScaffolding}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="How does this fit into the architecture? What models/data structures are needed?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Relational Mapping</label>
              <textarea
                name="relationalMapping"
                value={formData.relationalMapping}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Does this bolt on to athleteId? What's the relational mapping? (e.g., Athlete -> RunCrewMembership -> RunCrew)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">API Integration</label>
              <textarea
                name="apiIntegration"
                value={formData.apiIntegration}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="API-specific integration (e.g., 'hit garmin backend with a token')"
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
                placeholder="Setup, research, account creation, auth - can include links (e.g., 'apply for token: https://...')"
              />
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
                  <option value="Critical Path">Critical Path</option>
                  <option value="Enhanced User Feature">Enhanced User Feature</option>
                  <option value="Future Release">Future Release</option>
                  <option value="Revenue Builder">Revenue Builder</option>
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
