import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, GraduationCap, Search } from 'lucide-react';

const ApplicantFindJobs = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A3C40]">Find Opportunities</h1>
        <p className="text-gray-500 mt-1">Choose the type of opportunity you're looking for</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {/* Jobs Card */}
        <Link
          to="/dashboard/find-jobs/jobs"
          className="group bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#00B8D4] transition-all duration-200"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
              <Briefcase className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#00B8D4] transition-colors">Find Jobs</h3>
              <p className="text-gray-600">Browse full-time and part-time job opportunities</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Professional positions</span>
            <Search className="w-5 h-5 text-gray-400 group-hover:text-[#00B8D4] transition-colors" />
          </div>
        </Link>

        {/* Internships Card */}
        <Link
          to="/dashboard/find-jobs/internships"
          className="group bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#00B8D4] transition-all duration-200"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-100 transition-colors">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#00B8D4] transition-colors">Find Internships</h3>
              <p className="text-gray-600">Discover internship opportunities to gain experience</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Learning opportunities</span>
            <Search className="w-5 h-5 text-gray-400 group-hover:text-[#00B8D4] transition-colors" />
          </div>
        </Link>
      </div>

      {/* Quick Stats or Additional Info */}
      <div className="mt-12 bg-gradient-to-r from-[#1A3C40] to-[#00B8D4] rounded-xl p-8 text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Ready to Start Your Career Journey?</h3>
          <p className="text-white/90 mb-6">Explore thousands of opportunities tailored to your skills and interests</p>
          <div className="flex justify-center gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold">1000+</div>
              <div className="text-white/80">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-white/80">Internships</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">200+</div>
              <div className="text-white/80">Companies</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantFindJobs;
