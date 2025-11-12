import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { X, Info } from 'lucide-react'
import { getRepoOptions } from '../config/repoConfig'

export default function RoadmapWeighPointCreator({ isOpen, onClose, onSubmit, editingItem }) {
  const defaultFormData = {
    itemType: 'Dev Work',
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
      const mappedItem = {
        ...defaultFormData,
        ...editingItem,
        primaryRepo: editingItem.primaryRepo || editingItem.parentArchitecture || '',
        quickModelScaffolding: editingItem.quickModelScaffolding || editingItem.fieldsData || '',
        apiIntegration: editingItem.apiIntegration || editingItem.howToGet || '',
        relationalMapping: editingItem.relationalMapping || '',
        priority: editingItem.priority === 'P0' ? 'Critical Path' :
                  editingItem.priority === 'P1' ? 'Enhanced User Feature' :
                  editingItem.priority === 'P2' ? 'Future Release' :
                  editingItem.priority || 'Enhanced User Feature',
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

  const isApiCategory = formData.category === 'API Integration'

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto mx-4">
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Classification Section */}
            <div className="space-y-4 border-b pb-4">
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Classification</h3>
              
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {formData.itemType === 'Product Milestone' ? 'Milestone Name' : 'Feature Name'}
                </label>
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
                <select
                  name="primaryRepo"
                  value={formData.primaryRepo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select repository...</option>
                  {getRepoOptions().map((repo) => (
                    <option key={repo.value} value={repo.value}>
                      {repo.label} - {repo.description}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-zinc-500 mt-1">Which repository does this work live in?</p>
              </div>
            </div>

            {/* Core Details Section */}
            <div className="space-y-4 border-b pb-4">
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Core Details</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">What it does (User value)</label>
                <textarea
                  name="whatItDoes"
                  value={formData.whatItDoes}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="What does this feature do for users? What problem does it solve?"
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
            </div>

            {/* Architecture Section */}
            <div className="space-y-4 border-b pb-4">
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Architecture & Data</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Data Model Structure
                </label>
                <textarea
                  name="quickModelScaffolding"
                  value={formData.quickModelScaffolding}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-md font-mono text-sm"
                  placeholder="RunCrewMembership (junction table)&#10;  - athleteId (FK)&#10;  - runCrewId (FK)&#10;  - joinedAt (DateTime)"
                />
                <p className="text-xs text-zinc-500 mt-1">What models, tables, or data structures are needed for this feature?</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Database Relationships
                </label>
                <textarea
                  name="relationalMapping"
                  value={formData.relationalMapping}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Athlete → RunCrewMembership → RunCrew (many-to-many)"
                />
                <div className="mt-1 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                  <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>How does this connect to the existing data model? What's the relationship chain?</span>
                </div>
              </div>
            </div>

            {/* API Integration Section - Conditional */}
            {isApiCategory && (
              <div className="space-y-4 border-b pb-4 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                  <span>API Integration Details</span>
                  <span className="text-xs font-normal text-blue-600 dark:text-blue-400">(Required for API Integration)</span>
                </h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1">API Endpoint & Method</label>
                  <textarea
                    name="apiIntegration"
                    value={formData.apiIntegration}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border rounded-md font-mono text-sm"
                    placeholder="POST /api/garmin/sync&#10;GET /api/garmin/activities&#10;Headers: Authorization Bearer {token}"
                  />
                  <p className="text-xs text-zinc-500 mt-1">What endpoints, methods, and auth are needed?</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Prerequisites & Setup</label>
                  <textarea
                    name="prerequisites"
                    value={formData.prerequisites}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="1. Apply for API access: https://developer.garmin.com/...&#10;2. Get OAuth credentials&#10;3. Set up token refresh flow"
                  />
                  <p className="text-xs text-zinc-500 mt-1">What needs to be set up first? Include links if applicable.</p>
                </div>
              </div>
            )}

            {/* Prerequisites Section - Only show if NOT API Integration */}
            {!isApiCategory && (
              <div className="space-y-4 border-b pb-4">
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Prerequisites</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Setup & Dependencies</label>
                  <textarea
                    name="prerequisites"
                    value={formData.prerequisites}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="What needs to be in place first? Setup, research, account creation, auth, etc. Include links if applicable."
                  />
                </div>
              </div>
            )}

            {/* Planning Section */}
            <div className="space-y-4 border-b pb-4">
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Planning</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Hours Estimated</label>
                  <input
                    type="number"
                    name="hoursEst"
                    value={formData.hoursEst}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="40"
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
