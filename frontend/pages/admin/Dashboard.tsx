import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { PieChart, Pie, Cell } from 'recharts';
import { MOCK_APPLICANTS } from './Applicants';
import { getRelationships } from '../../services/firebaseService';
import { Relationship } from '../../types';

export default function Dashboard() {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const rels = await getRelationships();
        setRelationships(rels);
      } catch (error) {
        console.error("Failed to fetch relationships", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate metrics based on current data
  const totalRegistrations = MOCK_APPLICANTS.length;
  
  // Assigned: Number of unique startups that have a relationship (approved, pending, or rejected)
  const uniqueAssignedStartups = new Set(relationships.map(r => r.startupId)).size;
  const assignedPercentage = totalRegistrations > 0 
    ? Math.round((uniqueAssignedStartups / totalRegistrations) * 100) 
    : 0;

  // Successful: Number of 'approved' relationships out of all processed relationships
  const approvedCount = relationships.filter(r => r.status === 'approved').length;
  const successPercentage = relationships.length > 0 
    ? Math.round((approvedCount / relationships.length) * 100) 
    : 0;

  // Data for the donut charts
  const dataAssigned = [{ value: assignedPercentage }, { value: 100 - assignedPercentage }];
  const dataSuccess = [{ value: successPercentage }, { value: 100 - successPercentage }];

  return (
    <AdminLayout>
      <div className="p-10 max-w-5xl">
        
        {/* Welcome Banner */}
        <div 
          className="relative rounded-2xl p-8 text-white overflow-hidden mb-10 shadow-md bg-cover bg-center"
          style={{ 
            backgroundImage: `url('https://cdn.prod.website-files.com/68368ce832f0c7a60f7a272b/6a08d8d3643eedcede34fd80_WhatsApp%20Image%202026-05-17%20at%2012.53.39%20AM%20(1).jpeg')` 
          }}
        >
          {/* Dark gradient overlay from left to right */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/70 to-transparent"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-semibold mb-3">Welcome Farhan!</h1>
            <Link to="/admin/applicants" className="inline-flex items-center text-indigo-50 hover:text-white transition-colors text-sm font-medium">
              <span className="mr-2">✨</span> You have {totalRegistrations - uniqueAssignedStartups} new submissions for reviews <span className="ml-1">↗</span>
            </Link>
          </div>
        </div>

        {/* Stat Cards - Restored to neutral colors */}
        <div className="grid grid-cols-3 gap-6 mb-20">
          <div className="bg-[#f8f9fa] rounded-2xl p-6 shadow-sm border border-gray-50">
            <p className="text-sm font-medium text-gray-800 mb-3">Number of registration</p>
            <p className="text-3xl font-bold text-gray-900">
              {isLoading ? '...' : totalRegistrations}
            </p>
          </div>
          <div className="bg-[#f8f9fa] rounded-2xl p-6 shadow-sm border border-gray-50">
            <p className="text-sm font-medium text-gray-800 mb-3">Number of programs</p>
            <p className="text-3xl font-bold text-gray-900">5</p>
          </div>
          <div className="bg-[#f8f9fa] rounded-2xl p-6 shadow-sm border border-gray-50">
            <p className="text-sm font-medium text-gray-800 mb-3">Revenues</p>
            <p className="text-3xl font-bold text-gray-900">RM 10,548.23</p>
          </div>
        </div>

        {/* Charts Area */}
        <div className="flex justify-center gap-24">
          
          {/* Chart 1: Assigned */}
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-8 w-8 text-[#603ADE]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : (
                <>
                  <PieChart width={192} height={192}>
                    <Pie 
                      data={dataAssigned} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={75} 
                      outerRadius={85} 
                      startAngle={90} 
                      endAngle={-270} 
                      dataKey="value" 
                      stroke="none" 
                      cornerRadius={5}
                      animationDuration={1000}
                    >
                      <Cell fill="#603ADE" /> {/* Primary Purple */}
                      <Cell fill="#e5e7eb" /> {/* Gray */}
                    </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm text-gray-600 font-medium mb-1">Assigned</span>
                    <span className="text-3xl font-bold text-gray-800">{assignedPercentage}%</span>
                  </div>
                </>
              )}
            </div>
            <p className="mt-6 text-lg font-medium text-gray-700">Application</p>
          </div>

          {/* Chart 2: Successful */}
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-8 w-8 text-[#0ea5e9]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : (
                <>
                  <PieChart width={192} height={192}>
                    <Pie 
                      data={dataSuccess} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={75} 
                      outerRadius={85} 
                      startAngle={90} 
                      endAngle={-270} 
                      dataKey="value" 
                      stroke="none" 
                      cornerRadius={5}
                      animationDuration={1000}
                    >
                      <Cell fill="#0ea5e9" /> {/* Blue */}
                      <Cell fill="#e5e7eb" /> {/* Gray */}
                    </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm text-gray-600 font-medium mb-1">Successful</span>
                    <span className="text-3xl font-bold text-gray-800">{successPercentage}%</span>
                  </div>
                </>
              )}
            </div>
            <p className="mt-6 text-lg font-medium text-gray-700">Success rate</p>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
