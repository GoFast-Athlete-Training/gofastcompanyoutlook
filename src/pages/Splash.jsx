import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Building2, Mail, AlertCircle, CheckCircle2, Loader } from 'lucide-react'

export default function Splash() {
  const navigate = useNavigate()
  const [inviteToken, setInviteToken] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [verifiedInvite, setVerifiedInvite] = useState(null)

  // Check for invite token in URL or localStorage on mount
  useEffect(() => {
    // Check localStorage first
    const storedToken = localStorage.getItem('company_invite_token')
    if (storedToken) {
      setInviteToken(storedToken)
      // Auto-verify stored token
      verifyInvite(storedToken)
    } else {
      // Check URL params
      const params = new URLSearchParams(window.location.search)
      const token = params.get('token')
      if (token) {
        setInviteToken(token)
        localStorage.setItem('company_invite_token', token)
        verifyInvite(token)
      }
    }
  }, [])

  const verifyInvite = async (token) => {
    if (!token) return
    
    setLoading(true)
    setError('')

    try {
      // TODO: Replace with actual backend endpoint
      // const response = await fetch(`/api/company/invite/verify?token=${token}`)
      // const data = await response.json()
      
      // DEMO: Mock verification
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock successful verification
      const mockInvite = {
        companyId: 'company_123',
        companyName: 'GoFast Company',
        email: 'adam@example.com',
        role: 'founder',
        department: 'Executive',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
      
      setVerifiedInvite(mockInvite)
      
      // Pre-fill email from invite if available
      if (mockInvite.email) {
        setEmail(mockInvite.email)
      }
    } catch (err) {
      setError('Invalid or expired invitation. Please contact your administrator.')
    } finally {
      setLoading(false)
    }
  }

  const handleTokenSubmit = (e) => {
    e.preventDefault()
    if (inviteToken.trim()) {
      localStorage.setItem('company_invite_token', inviteToken.trim())
      verifyInvite(inviteToken.trim())
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!email || !inviteToken) {
      setError('Email and invitation token are required')
      return
    }

    setLoading(true)
    setError('')

    try {
      // TODO: Replace with actual backend endpoint
      // const response = await fetch('/api/company/invite/accept', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, token: inviteToken })
      // })
      // const data = await response.json()
      
      // DEMO: Mock login
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Store auth data
      const authData = {
        companyId: verifiedInvite.companyId || 'company_123',
        companyName: verifiedInvite.companyName || 'GoFast Company',
        email,
        role: verifiedInvite.role || 'employee',
        department: verifiedInvite.department || 'General',
        inviteToken,
        loginTime: new Date().toISOString()
      }

      localStorage.setItem('company_auth', JSON.stringify(authData))
      
      // Navigate to main app
      navigate('/')
    } catch (err) {
      setError('Login failed. Please check your email and invitation token.')
    } finally {
      setLoading(false)
    }
  }

  // Show verified invite login form
  if (verifiedInvite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-950 flex items-center justify-center px-4 py-12">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl">Welcome to Company Outlook</CardTitle>
            <CardDescription>
              {verifiedInvite.companyName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-lg p-3 mb-4">
                <div className="text-xs text-sky-600 dark:text-sky-400 mb-2">Your Invitation</div>
                <div className="text-sm font-medium capitalize">
                  {verifiedInvite.role} • {verifiedInvite.department}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@company.com"
                  className="w-full"
                />
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show invitation entry form
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-950 flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-20 h-20 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl">Company Outlook</CardTitle>
          <CardDescription>
            Enter your invitation to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Invitation Token
              </label>
              <Input
                type="text"
                value={inviteToken}
                onChange={(e) => setInviteToken(e.target.value)}
                required
                placeholder="Enter invitation code"
                className="w-full"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                You should have received an invitation email with a unique code
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
              <strong>Invitation Required</strong><br />
              Company Outlook is invite-only. If you don't have an invitation, please contact your company administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
