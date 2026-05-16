import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { saveRelationship } from '../../services/firebaseService';
import { STARTUPS, PROGRAMMES } from '../../constants/mockData';

// Map STARTUPS to the format needed for the table, adding mock scores and summaries
export const MOCK_APPLICANTS = STARTUPS.map((startup, index) => {
  // Generate random unique scores
  // Use a seeded random approach based on index to keep it consistent across renders
  // but varied across the list.
  const baseScore = 30 + (index * 7) % 70; // Distribute scores between 30 and 100
  const score = Math.min(100, Math.max(0, baseScore));

  let risk = 'No risk';
  let summary = 'Legit documents with average portfolio.';

  if (score >= 80) {
    risk = 'No risk';
    summary = 'Great portfolio. Legit documents. No risk.';
  } else if (score >= 50) {
    risk = 'Medium risk';
    summary = 'Missing some financial history. Good product.';
  } else {
    risk = 'High risk';
    summary = 'Incomplete application. High market competition.';
  }

  // Assign a mock programme based on index
  const programmeObj = PROGRAMMES[index % PROGRAMMES.length];

  return {
    id: startup.id,
    name: startup.name,
    summary,
    score,
    risk,
    programmeId: programmeObj.id,
    programmeName: programmeObj.name
  };
});

const FILTERS = ['All applicants', 'No risk', 'Medium risk', 'High risk'];
const ROWS_PER_PAGE = 10;

export default function Applicants() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All applicants');
  const [searchQuery, setSearchQuery] = useState('');
  const [applicants, setApplicants] = useState(MOCK_APPLICANTS);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter logic
  const filteredApplicants = applicants.filter(app => {
    const matchesFilter = activeFilter === 'All applicants' || app.risk === activeFilter;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.programmeName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredApplicants.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const paginatedApplicants = filteredApplicants.slice(startIndex, startIndex + ROWS_PER_PAGE);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  // Helper for score dot color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleApprove = async (applicantId: string, applicantName: string) => {
    setApprovingId(applicantId);
    try {
      const appData = applicants.find(a => a.id === applicantId);
      const score = appData ? appData.score : 85;
      const progId = appData ? appData.programmeId : 'p1';
      
      // Save the relationship with the specific programme and score
      await saveRelationship(applicantId, 'pending_mentor', progId, 'approved', score);
      
      // Remove the approved applicant from the list
      setApplicants(prev => prev.filter(app => app.id !== applicantId));
      
      alert(`${applicantName} has been approved and added to Review for monitoring.`);
    } catch (error) {
      console.error("Failed to approve applicant:", error);
      alert("Failed to approve applicant. Please try again.");
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="p-10 max-w-6xl mx-auto">
        
        {/* Filters */}
        <div className="flex gap-3 mb-6">
          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                activeFilter === filter 
                  ? 'bg-[#603ADE] text-white border-[#603ADE]' 
                  : 'bg-white text-gray-700 border-gray-400 hover:bg-gray-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search an applicant or programme"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#603ADE] focus:border-[#603ADE] sm:text-sm transition-colors"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-neutral-100">
                <tr>
                  <th className="py-4 pr-4 text-sm font-medium text-neutral-600 border-b border-neutral-200 w-12"></th>
                  <th className="py-4 px-4 text-sm font-medium text-neutral-600 border-b border-neutral-200 w-1/4">Name</th>
                  <th className="py-4 px-4 text-sm font-medium text-neutral-600 border-b border-neutral-200 w-1/3">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#603ADE]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Summary
                    </div>
                  </th>
                  <th className="py-4 px-4 text-sm font-medium text-neutral-600 border-b border-neutral-200">Programme</th>
                  <th className="py-4 px-4 text-sm font-medium text-neutral-600 border-b border-neutral-200">Score</th>
                  <th className="py-4 pl-4 text-sm font-medium text-neutral-600 border-b border-neutral-200 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedApplicants.length > 0 ? (
                  paginatedApplicants.map((app, index) => (
                    <tr key={app.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-4 pr-4 text-sm text-gray-500 pl-4">{startIndex + index + 1}</td>
                      <td className="py-4 px-4 text-sm text-gray-800 font-medium">{app.name}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{app.summary}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-[#603ADE] border border-indigo-100">
                          {app.programmeName}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-800">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${getScoreColor(app.score)}`}></span>
                          {app.score}%
                        </div>
                      </td>
                      <td className="py-4 pl-4 text-right pr-4">
                        <div className="flex items-center justify-end gap-4">
                          <button 
                            onClick={() => handleApprove(app.id, app.name)}
                            disabled={approvingId === app.id}
                            title="Quick Approve"
                            className={`border rounded-full px-4 py-1 transition-colors focus:outline-none flex items-center justify-center ${
                              approvingId === app.id 
                                ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
                                : 'border-[#603ADE] text-[#603ADE] hover:bg-[#603ADE] hover:text-white'
                            }`}
                          >
                            {approvingId === app.id ? (
                              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          <button 
                            onClick={() => navigate(`/admin/applicants/${app.id}`)}
                            title="View Details & AI Analysis"
                            className="text-gray-400 hover:text-gray-800 transition-colors focus:outline-none"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No applicants found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredApplicants.length > 0 && (
          <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
            <div>
              {startIndex + 1}-{Math.min(startIndex + ROWS_PER_PAGE, filteredApplicants.length)} of {filteredApplicants.length}
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span>Rows per page: {ROWS_PER_PAGE}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`focus:outline-none ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'hover:text-gray-800'}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span>{currentPage}/{totalPages}</span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`focus:outline-none ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'hover:text-gray-800'}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
