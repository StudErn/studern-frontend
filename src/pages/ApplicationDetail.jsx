import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { Briefcase, Calendar } from 'lucide-react'

const ApplicationDetail = () => {
  const { id } = useParams()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplication()
  }, [id])

  const fetchApplication = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`/applications/${id}`)
      setApplication(res.data.data?.application || null)
    } catch (err) {
      console.error('Failed to load application', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A3C40]"></div></div>
  )

  if (!application) return (
    <div className="container mx-auto px-6 py-8">
      <div className="bg-white p-8 rounded-lg shadow">Application not found.</div>
    </div>
  )

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="bg-white p-8 rounded-lg shadow">
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{application.hiring?.job_title || 'Unknown position'}</h1>
            <p className="text-gray-600">{application.company?.name || application.company?.company_name || application.company?.companyName}</p>
            <div className="mt-4 text-sm text-gray-700">
              <p><span className="font-semibold">Status:</span> {application.status}</p>
              <p className="mt-2"><span className="font-semibold">Applied:</span> {new Date(application.applied_at).toLocaleString()}</p>
            </div>

            {application.cover_letter && (
              <div className="mt-6">
                <h3 className="font-semibold">Cover Letter</h3>
                <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{application.cover_letter}</p>
              </div>
            )}

            {application.notes && (
              <div className="mt-6">
                <h3 className="font-semibold">Notes</h3>
                <p className="mt-2 text-sm text-gray-700">{application.notes}</p>
              </div>
            )}

            {application.interviews && application.interviews.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold">Interviews</h3>
                <ul className="mt-2 space-y-3">
                  {application.interviews.map(i => (
                    <li key={i.id} className="p-3 border rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{i.title || 'Interview'}</div>
                          <div className="text-sm text-gray-500">{new Date(i.scheduled_at).toLocaleString()}</div>
                        </div>
                        <div className="text-sm text-gray-600">{i.status}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="w-56">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="text-sm text-gray-500">Hiring details</div>
              <div className="mt-3">
                <div className="text-sm text-gray-700"><span className="font-semibold">Type:</span> {application.hiring?.hiring_type || '—'}</div>
                <div className="text-sm text-gray-700 mt-1"><span className="font-semibold">Work from:</span> {application.hiring?.work_from || '—'}</div>
                <div className="text-sm text-gray-700 mt-1"><span className="font-semibold">Applied:</span> {new Date(application.applied_at).toLocaleDateString()}</div>
              </div>
              <div className="mt-4">
                <Link to="/dashboard/applications" className="text-sm text-[#00B8D4]">Back to applications</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicationDetail
