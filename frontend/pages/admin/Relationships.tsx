import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Relationship } from '../../types';
import { getRelationships } from '../../services/firebaseService';
import { STARTUPS, PROGRAMMES } from '../../constants/mockData';
import { MOCK_APPLICANTS } from './Applicants';

// Extended relationship type for the UI to include mock AI scores and feedback
interface ReviewItem extends Relationship {
  aiScore: number;
  feedback: number; // 0-5 stars
}

export default function Relationships() {
  const [relationships, setRelationships] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    const fetchRelationships = async () => {
      setIsLoading(true);
      try {
        // Call the placeholder service
        const data = await getRelationships();
        
        // Map the data and add mock AI scores and initial feedback
        let reviewData: ReviewItem[] = data.map(rel => {
          // Fallback to MOCK_APPLICANTS if aiScore is missing
          let score = rel.aiScore;
          if (score === undefined) {
            const applicant = MOCK_APPLICANTS.find(a => a.id === rel.startupId);
            score = applicant ? applicant.score : 85;
          }
          return {
            ...rel,
            aiScore: score,
            feedback: 0
          };
        });

        // For styling demonstration purposes, if the service returns empty, 
        // we inject some mock approved relationships.
        if (reviewData.length === 0) {
          reviewData = [
            {
              id: 'rel_1',
              startupId: 's1',
              mentorId: 'm1',
              programmeId: 'p1',
              status: 'approved',
              aiScore: 95,
              feedback: 4
            },
            {
              id: 'rel_2',
              startupId: 's3',
              mentorId: 'm3',
              programmeId: 'p2',
              status: 'approved',
              aiScore: 82,
              feedback: 0
            },
            {
              id: 'rel_3',
              startupId: 's4',
              mentorId: 'm4',
              programmeId: 'p3',
              status: 'rejected',
              aiScore: 45,
              feedback: 5
            }
          ];
        }
        
        setRelationships(reviewData);
      } catch (error) {
        console.error("Failed to fetch relationships", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelationships();
  }, []);

  // Helper functions to get names from IDs
  const getStartupName = (id: string) => {
    const startup = STARTUPS.find(s => s.id === id);
    if (startup) return startup.name;
    // Fallback to MOCK_APPLICANTS if not in STARTUPS
    const applicant = MOCK_APPLICANTS.find(a => a.id === id);
    return applicant ? applicant.name : 'Unknown Startup';
  };
  
  const getProgrammeName = (id: string) => PROGRAMMES.find(p => p.id === id)?.name || 'Unknown Programme';

  // Helper for score dot color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleRating = (id: string, rating: number) => {
    setRelationships(prev => 
      prev.map(rel => rel.id === id ? { ...rel, feedback: rating } : rel)
    );
  };

  const confirmExportCSV = () => {
    if (relationships.length === 0) {
      alert("No data available to export.");
      return;
    }
    setShowExportModal(true);
  };

  const executeExportCSV = () => {
    setShowExportModal(false);

    // Define CSV headers
    const headers = ['Startup Name', 'Programme Name', 'AI Prediction Score', 'Status', 'Feedback (Stars)'];

    // Map relationships to CSV rows
    const csvRows = relationships.map(rel => {
      // Basic sanitization to avoid issues with commas in names
      const startupName = `"${getStartupName(rel.startupId).replace(/"/g, '""')}"`;
      const programmeName = `"${getProgrammeName(rel.programmeId).replace(/"/g, '""')}"`;
      const score = `${rel.aiScore}%`;
      const status = rel.status;
      const feedback = rel.feedback;

      return [startupName, programmeName, score, status, feedback].join(',');
    });

    // Combine headers and rows
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'marijoin_reviews_export.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="p-8 max-w-7xl mx-auto relative">
        
        {/* Export Confirmation Modal */}
        {showExportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-50">
            <div className="relative w-full max-w-md p-4">
              <div className="relative bg-white rounded-xl shadow-lg">
                <div className="p-6 text-center">
                  <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">Confirm Export</h3>
                  <p className="mb-6 text-sm text-gray-500">
                    This will extract all collected data for the approved startups, including their full profiles, AI intelligence scores, and feedback ratings, into a CSV file. This file is formatted to be easily imported and reused in other platforms.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button 
                      onClick={() => setShowExportModal(false)}
                      className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={executeExportCSV}
                      className="text-white bg-[#603ADE] hover:bg-[#4d2eaf] focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                    >
                      Yes, Export Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Review</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all processed matches between startups and Cradle programmes.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={confirmExportCSV}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-[#603ADE] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#4d2eaf] focus:outline-none focus:ring-2 focus:ring-[#603ADE] focus:ring-offset-2 sm:w-auto transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg bg-white border border-gray-200">
                {isLoading ? (
                  <div className="p-12 text-center">
                    <svg className="animate-spin mx-auto h-8 w-8 text-[#603ADE]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-sm text-gray-500">Loading relationships...</p>
                  </div>
                ) : relationships.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Startup
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Programme
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          AI Prediction Score
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Feedback
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {relationships.map((rel) => (
                        <tr key={rel.id} className="hover:bg-gray-50 transition-colors">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {getStartupName(rel.startupId)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {getProgrammeName(rel.programmeId)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${getScoreColor(rel.aiScore)}`}></span>
                              {rel.aiScore}%
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              rel.status === 'approved' ? 'bg-green-100 text-green-800' : 
                              rel.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {rel.status.charAt(0).toUpperCase() + rel.status.slice(1)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => handleRating(rel.id, star)}
                                  className="focus:outline-none transition-transform hover:scale-110"
                                >
                                  <svg 
                                    className={`w-5 h-5 ${star <= rel.feedback ? 'text-yellow-400' : 'text-gray-300'}`} 
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No relationships found</h3>
                    <p className="mt-1 text-sm text-gray-500">Approve matches in the dashboard to see them here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}