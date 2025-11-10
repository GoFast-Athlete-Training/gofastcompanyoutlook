/**
 * useHydratedStaff - Local-only context reader
 * Reads staff and company context from localStorage
 * No derivation, no fallbacks - just reads what's there
 * Mirrors useHydratedAthlete pattern from gofastfrontend-mvp1
 * 
 * Returns ALL staff fields including:
 * - id, firebaseId, firstName, lastName, email, photoURL
 * - companyId, role, startDate, salary
 * - company (full company object)
 * - createdAt, updatedAt
 */
export default function useHydratedStaff() {
  // Read staff data (full object with all fields)
  const staffStr = localStorage.getItem('gfcompany_staff');
  const staff = staffStr ? JSON.parse(staffStr) : null;
  
  // Extract IDs for quick access
  const staffId = staff?.id || localStorage.getItem('gfcompany_staffId');
  const firebaseId = staff?.firebaseId || localStorage.getItem('gfcompany_firebaseId');
  
  // Role is in staff object, but also stored separately for quick access
  const role = staff?.role || localStorage.getItem('gfcompany_role');
  
  // Read company data
  const companyStr = localStorage.getItem('gfcompany_company');
  const company = companyStr ? JSON.parse(companyStr) : null;
  const companyId = company?.id || localStorage.getItem('gfcompany_companyId');
  const containerId = company?.containerId || localStorage.getItem('gfcompany_containerId');
  
  // Read company HQ (legacy key)
  const companyHQStr = localStorage.getItem('gfcompany_companyHQ');
  const companyHQ = companyHQStr ? JSON.parse(companyHQStr) : null;
  const companyHQId = companyHQ?.id || localStorage.getItem('gfcompany_companyHQId');

  return {
    // Full staff object with ALL fields (role, startDate, salary, etc.)
    staff,
    staffId,
    firebaseId,
    role, // Quick access to role
    // Company data
    company: company || companyHQ || staff?.company, // Use company or fallback to staff.company
    companyId: companyId || companyHQId || staff?.companyId,
    containerId
  };
}

