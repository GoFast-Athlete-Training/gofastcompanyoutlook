import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import gfcompanyapi from '../lib/gfcompanyapi';
import { Save, Building2 } from 'lucide-react';

export default function CompanySettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    city: '',
    state: '',
    website: '',
    description: ''
  });

  useEffect(() => {
    // Check if company exists in localStorage
    const storedCompany = localStorage.getItem('gfcompany_company');
    if (storedCompany) {
      try {
        const companyData = JSON.parse(storedCompany);
        setCompany(companyData);
        setFormData({
          companyName: companyData.companyName || '',
          address: companyData.address || '',
          city: companyData.city || '',
          state: companyData.state || '',
          website: companyData.website || '',
          description: companyData.description || ''
        });
      } catch (error) {
        console.error('Failed to parse stored company data:', error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      console.log('🚀 COMPANY SETTINGS: Creating/updating company...');
      
      const response = await gfcompanyapi.post('/api/company/create', formData);

      if (response.data.success) {
        console.log('✅ COMPANY SETTINGS: Company saved successfully');
        
        // Update localStorage
        const companyData = response.data.company;
        localStorage.setItem('gfcompany_company', JSON.stringify(companyData));
        localStorage.setItem('gfcompany_companyId', companyData.id);
        localStorage.setItem('gfcompany_containerId', companyData.containerId);
        
        setCompany(companyData);
        
        // Navigate to command central
        navigate('/');
      } else {
        console.error('❌ COMPANY SETTINGS: Failed to save company:', response.data.error);
        alert('Failed to save company: ' + (response.data.message || response.data.error));
      }
    } catch (error) {
      console.error('❌ COMPANY SETTINGS: Error saving company:', error);
      alert('Error saving company: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          Company Settings
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          {company ? 'Update your company details' : 'Set up your GoFast company'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium mb-1">
                Company Name *
              </label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="GoFast Inc"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">
                Address
              </label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="2604 N. George Mason Dr."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-1">
                  City
                </label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Arlington"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium mb-1">
                  State
                </label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="VA"
                />
              </div>
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium mb-1">
                Website
              </label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="gofastcrushgoals.com"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Company description..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
              >
                {saving ? (
                  'Saving...'
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {company ? 'Update Company' : 'Create Company'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

