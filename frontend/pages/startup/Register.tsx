import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SECTIONS = [
  'Company Profile',
  'Founder Information',
  'Ownership & Structure',
  'Startup Stage & Maturity',
  'Industry / Sector',
  'Problem & Solution',
  'Product & Technology',
  'Market & Traction',
  'Funding Application',
  'Programme & Ecosystem Matching',
  'Mentorship Preferences',
  'Growth Plans',
  'Collaboration Interests',
  'Documents Upload'
];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Comprehensive form state
  const [formData, setFormData] = useState({
    // 1. Company Profile
    companyName: '', ssm: '', incorporationDate: '', entityType: '', website: '', address: '', country: '',
    // 2. Founder Info
    founderName: '', nationality: '', residency: '', role: '', linkedin: '', email: '', phone: '',
    // 3. Ownership
    myOwnershipPct: '', directorsCount: '', majorShareholder: '', employeesCount: '', myEmployeesPct: '',
    // 4. Stage
    stage: '', launchYear: '', monthlyRevenue: '', totalFunding: '',
    // 5. Industry
    industry: '', otherIndustry: '', productDescription: '',
    // 6. Problem & Solution
    problem: '', targetCustomers: '', solution: '', uniqueValue: '',
    // 7. Product & Tech
    ownIp: '', licenseIp: '', techStack: '', hasPrototype: '',
    // 8. Market & Traction
    userCount: '', revenueGenerated: '', partnerships: '', marketSize: '',
    // 9. Funding
    fundingType: '', fundingAmount: '', useOfFunds: [] as string[],
    // 10. Ecosystem
    supportNeeded: [] as string[], biggestChallenges: [] as string[],
    // 11. Mentorship
    mentorType: '', meetingFrequency: '', preferredLanguage: '',
    // 12. Growth
    goals12m: '', regionalExpansion: '', targetCountries: '', milestones: '',
    // 13. Collaboration
    collabCorporate: false, collabGov: false, collabUni: false, collabInvestor: false,
    // 14. Documents
    pitchDeck: '', ssmDoc: '', demoDoc: '', financials: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    // Clear error when user starts typing
    if (validationError) setValidationError('');
  };

  const handleArrayChange = (field: 'useOfFunds' | 'supportNeeded' | 'biggestChallenges', value: string) => {
    setFormData(prev => {
      const currentArray = prev[field];
      if (currentArray.includes(value)) {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...currentArray, value] };
      }
    });
    if (validationError) setValidationError('');
  };

  const validateCurrentStep = () => {
    switch (step) {
      case 0: // Company Profile
        return !!(formData.companyName && formData.ssm && formData.entityType && formData.country);
      case 1: // Founder Info
        return !!(formData.founderName && formData.email && formData.role);
      case 2: // Ownership
        return !!(formData.myOwnershipPct && formData.directorsCount && formData.majorShareholder);
      case 3: // Stage
        return !!formData.stage;
      case 4: // Industry
        return !!(formData.industry && (formData.industry !== 'Other' || formData.otherIndustry));
      case 5: // Problem & Solution
        return !!(formData.problem && formData.solution);
      case 6: // Product & Tech
        return !!(formData.ownIp && formData.hasPrototype);
      case 7: // Market & Traction
        return !!formData.marketSize;
      case 8: // Funding
        return !!(formData.fundingType && formData.fundingAmount);
      case 9: // Ecosystem
        return formData.supportNeeded.length > 0;
      case 10: // Mentorship
        return !!formData.mentorType;
      case 11: // Growth
        return !!(formData.goals12m && formData.regionalExpansion);
      case 12: // Collaboration
        return true; // Optional
      case 13: // Documents
        return !!formData.pitchDeck;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      setValidationError('Please fill in all required fields before proceeding.');
      return;
    }
    setValidationError('');
    if (step < SECTIONS.length - 1) setStep(s => s + 1);
    window.scrollTo(0, 0);
  };

  const handlePrev = () => {
    setValidationError('');
    if (step > 0) setStep(s => s - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) {
      setValidationError('Please fill in all required fields before submitting.');
      return;
    }
    
    setValidationError('');
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center animate-fade-in-up border border-gray-100">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Application Submitted!</h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Thank you for applying to MariJoin. Cradle admins will review your application and match you with the best mentors and programmes shortly.
          </p>
          <Link
            to="/"
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-[#603ADE] hover:bg-[#4d2eaf] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#603ADE] transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (step) {
      case 0: // Company Profile
        return (
          <div className="space-y-4 animate-fade-in">
            <div><label className="block text-sm font-medium text-gray-700">Startup / Company Name <span className="text-red-500">*</span></label><input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" required /></div>
            <div><label className="block text-sm font-medium text-gray-700">Company Registration Number (SSM) <span className="text-red-500">*</span></label><input type="text" name="ssm" value={formData.ssm} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" required /></div>
            <div><label className="block text-sm font-medium text-gray-700">Date of Incorporation</label><input type="date" name="incorporationDate" value={formData.incorporationDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" /></div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Legal Entity Type <span className="text-red-500">*</span></label>
              <select name="entityType" value={formData.entityType} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border bg-white" required>
                <option value="">Select type</option>
                <option value="Sdn Bhd">Sdn Bhd</option>
                <option value="LLP">LLP</option>
                <option value="Enterprise">Enterprise</option>
                <option value="University spin-off">University spin-off</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700">Website / App link</label><input type="url" name="website" value={formData.website} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Registered Address</label><textarea name="address" value={formData.address} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Operating Country <span className="text-red-500">*</span></label><input type="text" name="country" value={formData.country} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" required /></div>
          </div>
        );
      case 1: // Founder Information
        return (
          <div className="space-y-4 animate-fade-in">
            <div><label className="block text-sm font-medium text-gray-700">Full Name of Founders <span className="text-red-500">*</span></label><input type="text" name="founderName" value={formData.founderName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" required /></div>
            <div><label className="block text-sm font-medium text-gray-700">Nationality</label><input type="text" name="nationality" value={formData.nationality} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" /></div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Residency status</label>
              <select name="residency" value={formData.residency} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border bg-white">
                <option value="">Select status</option>
                <option value="Malaysia resident">Malaysia resident</option>
                <option value="Non-Malaysia resident">Non-Malaysia resident</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700">Role in company <span className="text-red-500">*</span></label><input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="e.g. CEO, CTO" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" required /></div>
            <div><label className="block text-sm font-medium text-gray-700">LinkedIn profile</label><input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Contact email <span className="text-red-500">*</span></label><input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" required /></div>
            <div><label className="block text-sm font-medium text-gray-700">Contact number</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" /></div>
          </div>
        );
      case 2: // Ownership & Structure
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-blue-50 p-4 rounded-md mb-4 border border-blue-100">
              <p className="text-sm text-blue-800 font-medium">Note: Ownership structure is highly important for Cradle grant eligibility.</p>
            </div>
            <div><label className="block text-sm font-medium text-gray-700">% Malaysian ownership <span className="text-red-500">*</span></label><input type="number" name="myOwnershipPct" value={formData.myOwnershipPct} onChange={handleChange} min="0" max="100" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" required /></div>
            <div><label className="block text-sm font-medium text-gray-700">Number of directors <span className="text-red-500">*</span></label><input type="number" name="directorsCount" value={formData.directorsCount} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" required /></div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Is any single shareholder owning ≥25%? <span className="text-red-500">*</span></label>
              <div className="mt-2 space-x-4">
                <label className="inline-flex items-center"><input type="radio" name="majorShareholder" value="Yes" checked={formData.majorShareholder === 'Yes'} onChange={handleChange} className="text-[#603ADE] focus:ring-[#603ADE]" /><span className="ml-2 text-sm text-gray-700">Yes</span></label>
                <label className="inline-flex items-center"><input type="radio" name="majorShareholder" value="No" checked={formData.majorShareholder === 'No'} onChange={handleChange} className="text-[#603ADE] focus:ring-[#603ADE]" /><span className="ml-2 text-sm text-gray-700">No</span></label>
              </div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700">Number of employees</label><input type="number" name="employeesCount" value={formData.employeesCount} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" /></div>
            <div><label className="block text-sm font-medium text-gray-700">% Malaysian employees</label><input type="number" name="myEmployeesPct" value={formData.myEmployeesPct} onChange={handleChange} min="0" max="100" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" /></div>
          </div>
        );
      case 3: // Stage & Maturity
        return (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-700">What stage is your startup in? <span className="text-red-500">*</span></label>
              <select name="stage" value={formData.stage} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border bg-white" required>
                <option value="">Select stage</option>
                <option value="Idea">Idea</option>
                <option value="Prototype">Prototype</option>
                <option value="MVP">MVP</option>
                <option value="Early revenue">Early revenue</option>
                <option value="Growth stage">Growth stage</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700">Year of first product launch</label><input type="number" name="launchYear" value={formData.launchYear} onChange={handleChange} placeholder="YYYY" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Current monthly revenue (if any)</label><input type="text" name="monthlyRevenue" value={formData.monthlyRevenue} onChange={handleChange} placeholder="RM" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Total funding raised so far</label><input type="text" name="totalFunding" value={formData.totalFunding} onChange={handleChange} placeholder="RM" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" /></div>
          </div>
        );
      case 4: // Industry / Sector
        return (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-700">What industry best describes your startup? <span className="text-red-500">*</span></label>
              <select name="industry" value={formData.industry} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border bg-white" required>
                <option value="">Select industry</option>
                <option value="AI / Machine Learning">AI / Machine Learning</option>
                <option value="FinTech">FinTech</option>
                <option value="HealthTech">HealthTech</option>
                <option value="ClimateTech">ClimateTech</option>
                <option value="EdTech">EdTech</option>
                <option value="E-commerce">E-commerce</option>
                <option value="SaaS">SaaS</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {formData.industry === 'Other' && (
              <div><label className="block text-sm font-medium text-gray-700">Please specify <span className="text-red-500">*</span></label><input type="text" name="otherIndustry" value={formData.otherIndustry} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" required /></div>
            )}
            <div><label className="block text-sm font-medium text-gray-700">Brief description of product/service</label><textarea name="productDescription" value={formData.productDescription} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" /></div>
          </div>
        );
      case 5: // Problem & Solution
        return (
          <div className="space-y-4 animate-fade-in">
            <div><label className="block text-sm font-medium text-gray-700">What problem are you solving? <span className="text-red-500">*</span></label><textarea name="problem" value={formData.problem} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" required /></div>
            <div><label className="block text-sm font-medium text-gray-700">Who are your target customers?</label><textarea name="targetCustomers" value={formData.targetCustomers} onChange={handleChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" /></div>
            <div><label className="block text-sm font-medium text-gray-700">What is your solution? <span className="text-red-500">*</span></label><textarea name="solution" value={formData.solution} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" required /></div>
            <div><label className="block text-sm font-medium text-gray-700">What makes your solution unique?</label><textarea name="uniqueValue" value={formData.uniqueValue} onChange={handleChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" /></div>
          </div>
        );
      case 6: // Product & Technology
        return (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-700">Do you own the IP? <span className="text-red-500">*</span></label>
              <div className="mt-2 space-x-4">
                <label className="inline-flex items-center"><input type="radio" name="ownIp" value="Yes" checked={formData.ownIp === 'Yes'} onChange={handleChange} className="text-[#603ADE] focus:ring-[#603ADE]" /><span className="ml-2 text-sm text-gray-700">Yes</span></label>
                <label className="inline-flex items-center"><input type="radio" name="ownIp" value="No" checked={formData.ownIp === 'No'} onChange={handleChange} className="text-[#603ADE] focus:ring-[#603ADE]" /><span className="ml-2 text-sm text-gray-700">No</span></label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Do you have licensing rights for IP?</label>
              <div className="mt-2 space-x-4">
                <label className="inline-flex items-center"><input type="radio" name="licenseIp" value="Yes" checked={formData.licenseIp === 'Yes'} onChange={handleChange} className="text-[#603ADE] focus:ring-[#603ADE]" /><span className="ml-2 text-sm text-gray-700">Yes</span></label>
                <label className="inline-flex items-center"><input type="radio" name="licenseIp" value="No" checked={formData.licenseIp === 'No'} onChange={handleChange} className="text-[#603ADE] focus:ring-[#603ADE]" /><span className="ml-2 text-sm text-gray-700">No</span></label>
                <label className="inline-flex items-center"><input type="radio" name="licenseIp" value="N/A" checked={formData.licenseIp === 'N/A'} onChange={handleChange} className="text-[#603ADE] focus:ring-[#603ADE]" /><span className="ml-2 text-sm text-gray-700">N/A</span></label>
              </div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700">Describe your technology stack</label><textarea name="techStack" value={formData.techStack} onChange={handleChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" /></div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Do you have a working prototype? <span className="text-red-500">*</span></label>
              <div className="mt-2 space-x-4">
                <label className="inline-flex items-center"><input type="radio" name="hasPrototype" value="Yes" checked={formData.hasPrototype === 'Yes'} onChange={handleChange} className="text-[#603ADE] focus:ring-[#603ADE]" /><span className="ml-2 text-sm text-gray-700">Yes</span></label>
                <label className="inline-flex items-center"><input type="radio" name="hasPrototype" value="No" checked={formData.hasPrototype === 'No'} onChange={handleChange} className="text-[#603ADE] focus:ring-[#603ADE]" /><span className="ml-2 text-sm text-gray-700">No</span></label>
              </div>
            </div>
          </div>
        );
      case 7: // Market & Traction
        return (
          <div className="space-y-4 animate-fade-in">
            <div><label className="block text-sm font-medium text-gray-700">Number of users/customers</label><input type="text" name="userCount" value={formData.userCount} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Revenue generated (if any)</label><input type="text" name="revenueGenerated" value={formData.revenueGenerated} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Key partnerships (if any)</label><textarea name="partnerships" value={formData.partnerships} onChange={handleChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Market size / target geography <span className="text-red-500">*</span></label><input type="text" name="marketSize" value={formData.marketSize} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" required /></div>
          </div>
        );
      case 8: // Funding Application
        return (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-700">Which funding are you applying for? <span className="text-red-500">*</span></label>
              <select name="fundingType" value={formData.fundingType} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border bg-white" required>
                <option value="">Select programme</option>
                <option value="CIP Spark">CIP Spark (early stage / MVP)</option>
                <option value="CIP Sprint">CIP Sprint (commercialisation / scaling)</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700">Funding amount requested <span className="text-red-500">*</span></label><input type="text" name="fundingAmount" value={formData.fundingAmount} onChange={handleChange} placeholder="RM" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" required /></div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">How will funds be used?</label>
              <div className="space-y-2">
                {['Product development', 'Commercialisation', 'Marketing', 'Hiring', 'Expansion'].map(item => (
                  <label key={item} className="inline-flex items-center w-full sm:w-1/2">
                    <input type="checkbox" checked={formData.useOfFunds.includes(item)} onChange={() => handleArrayChange('useOfFunds', item)} className="rounded border-gray-300 text-[#603ADE] focus:ring-[#603ADE]" />
                    <span className="ml-2 text-sm text-gray-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      case 9: // Programme & Ecosystem Matching
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-indigo-50 p-4 rounded-md border border-indigo-100">
              <p className="text-sm text-indigo-800 font-medium">This section helps our AI match you with the perfect mentors and programmes.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What support do you need? (select at least one) <span className="text-red-500">*</span></label>
              <div className="space-y-2">
                {['Mentorship', 'Funding', 'Market access', 'Technical support', 'Legal / IP support', 'Partnerships'].map(item => (
                  <label key={item} className="inline-flex items-center w-full sm:w-1/2">
                    <input type="checkbox" checked={formData.supportNeeded.includes(item)} onChange={() => handleArrayChange('supportNeeded', item)} className="rounded border-gray-300 text-[#603ADE] focus:ring-[#603ADE]" />
                    <span className="ml-2 text-sm text-gray-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What are your biggest current challenges?</label>
              <div className="space-y-2">
                {['Fundraising', 'Product development', 'Customer acquisition', 'Scaling', 'Hiring talent', 'Regulatory issues'].map(item => (
                  <label key={item} className="inline-flex items-center w-full sm:w-1/2">
                    <input type="checkbox" checked={formData.biggestChallenges.includes(item)} onChange={() => handleArrayChange('biggestChallenges', item)} className="rounded border-gray-300 text-[#603ADE] focus:ring-[#603ADE]" />
                    <span className="ml-2 text-sm text-gray-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      case 10: // Mentorship Preferences
        return (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-700">What type of mentor do you need? <span className="text-red-500">*</span></label>
              <select name="mentorType" value={formData.mentorType} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border bg-white" required>
                <option value="">Select type</option>
                <option value="Technical expert">Technical expert</option>
                <option value="Industry expert">Industry expert</option>
                <option value="Fundraising / VC">Fundraising / VC</option>
                <option value="Market expansion advisor">Market expansion advisor</option>
                <option value="Startup operator">Startup operator</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700">Preferred meeting frequency</label><input type="text" name="meetingFrequency" value={formData.meetingFrequency} onChange={handleChange} placeholder="e.g. Bi-weekly, Monthly" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Preferred language / region</label><input type="text" name="preferredLanguage" value={formData.preferredLanguage} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" /></div>
          </div>
        );
      case 11: // Growth Plans
        return (
          <div className="space-y-4 animate-fade-in">
            <div><label className="block text-sm font-medium text-gray-700">Next 12-month goals <span className="text-red-500">*</span></label><textarea name="goals12m" value={formData.goals12m} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" required /></div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Are you planning regional expansion? <span className="text-red-500">*</span></label>
              <div className="mt-2 space-x-4">
                <label className="inline-flex items-center"><input type="radio" name="regionalExpansion" value="Yes" checked={formData.regionalExpansion === 'Yes'} onChange={handleChange} className="text-[#603ADE] focus:ring-[#603ADE]" /><span className="ml-2 text-sm text-gray-700">Yes</span></label>
                <label className="inline-flex items-center"><input type="radio" name="regionalExpansion" value="No" checked={formData.regionalExpansion === 'No'} onChange={handleChange} className="text-[#603ADE] focus:ring-[#603ADE]" /><span className="ml-2 text-sm text-gray-700">No</span></label>
              </div>
            </div>
            {formData.regionalExpansion === 'Yes' && (
              <div><label className="block text-sm font-medium text-gray-700">Which countries are you targeting?</label><input type="text" name="targetCountries" value={formData.targetCountries} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" /></div>
            )}
            <div><label className="block text-sm font-medium text-gray-700">Expected milestones</label><textarea name="milestones" value={formData.milestones} onChange={handleChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#603ADE] focus:ring-[#603ADE] sm:text-sm py-2 px-3 border" /></div>
          </div>
        );
      case 12: // Collaboration Interests
        return (
          <div className="space-y-4 animate-fade-in">
            <label className="block text-sm font-medium text-gray-700 mb-2">Check all that apply:</label>
            <div className="space-y-3">
              <label className="flex items-center"><input type="checkbox" name="collabCorporate" checked={formData.collabCorporate} onChange={handleChange} className="rounded border-gray-300 text-[#603ADE] focus:ring-[#603ADE] h-4 w-4" /><span className="ml-3 text-sm text-gray-700">Interested in corporate partnerships?</span></label>
              <label className="flex items-center"><input type="checkbox" name="collabGov" checked={formData.collabGov} onChange={handleChange} className="rounded border-gray-300 text-[#603ADE] focus:ring-[#603ADE] h-4 w-4" /><span className="ml-3 text-sm text-gray-700">Interested in government programmes?</span></label>
              <label className="flex items-center"><input type="checkbox" name="collabUni" checked={formData.collabUni} onChange={handleChange} className="rounded border-gray-300 text-[#603ADE] focus:ring-[#603ADE] h-4 w-4" /><span className="ml-3 text-sm text-gray-700">Interested in university collaboration?</span></label>
              <label className="flex items-center"><input type="checkbox" name="collabInvestor" checked={formData.collabInvestor} onChange={handleChange} className="rounded border-gray-300 text-[#603ADE] focus:ring-[#603ADE] h-4 w-4" /><span className="ml-3 text-sm text-gray-700">Interested in investor introductions?</span></label>
            </div>
          </div>
        );
      case 13: // Documents Upload
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100 mb-4">
              <p className="text-sm text-yellow-800 font-medium">Please upload the required documents. PDF format is preferred.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pitch deck (PDF) <span className="text-red-500">*</span></label>
              <input type="file" name="pitchDeck" onChange={(e) => { setFormData({...formData, pitchDeck: e.target.value}); setValidationError(''); }} accept=".pdf,.ppt,.pptx" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-[#603ADE] hover:file:bg-indigo-100" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Business registration certificate (SSM)</label>
              <input type="file" accept=".pdf,.jpg,.png" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-[#603ADE] hover:file:bg-indigo-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Product demo / screenshots</label>
              <input type="file" multiple accept=".pdf,.jpg,.png,.mp4" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-[#603ADE] hover:file:bg-indigo-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Financial statements (if any)</label>
              <input type="file" accept=".pdf,.xls,.xlsx" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-[#603ADE] hover:file:bg-indigo-100" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const progressPercentage = ((step + 1) / SECTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg flex items-center justify-center shadow-md">
            <img 
              src="https://cdn.prod.website-files.com/68368ce832f0c7a60f7a272b/6a08d5fadbad56f54f3c16a6_network-topology.png" 
              alt="MariJoin Logo" 
              className="w-8 h-8 object-contain"
            />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">MariJoin</h1>
          </div>
          <Link to="/" className="text-sm font-medium text-[#603ADE] hover:text-[#4d2eaf]">
            Cancel & Return
          </Link>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          
          {/* Progress Bar & Title */}
          <div className="bg-[#603ADE] px-6 py-8 sm:px-10">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-indigo-200 text-sm font-medium mb-1">Step {step + 1} of {SECTIONS.length}</p>
                <h2 className="text-2xl font-bold text-white">{SECTIONS[step]}</h2>
              </div>
              <div className="text-indigo-200 text-sm font-medium hidden sm:block">
                {Math.round(progressPercentage)}% Completed
              </div>
            </div>
            <div className="w-full bg-indigo-900/50 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="px-6 py-8 sm:p-10">
            
            <div className="min-h-[300px]">
              {renderStepContent()}
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{validationError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrev}
                disabled={step === 0 || isSubmitting}
                className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#603ADE] transition-colors ${
                  step === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              
              {step < SECTIONS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#603ADE] hover:bg-[#4d2eaf] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#603ADE] transition-colors"
                >
                  Next
                  <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}