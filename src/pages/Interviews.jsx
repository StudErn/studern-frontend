import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Calendar, Clock, Video, MapPin, ExternalLink } from 'lucide-react'

const Interviews = () => {
    const [interviews, setInterviews] = useState([])
    const [loading, setLoading] = useState(true)

    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

    useEffect(() => {
        fetchInterviews()
    }, [])

    const fetchInterviews = async () => {
        try {
            const response = await axios.get(`/interviews`)
            setInterviews(response.data.data?.interviews || [])
        } catch (error) {
            console.error('Error fetching interviews:', error)
        } finally {
            setLoading(false)
        }
    }

    const sortInterviews = (items) => {
        const now = new Date()
        return {
            upcoming: items.filter(i => new Date(i.scheduled_at) > now).sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at)),
            past: items.filter(i => new Date(i.scheduled_at) <= now).sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at))
        }
    }

    const sortedInterviews = sortInterviews(interviews)

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A3C40]"></div>
            </div>
        )
    }

    const InterviewCard = ({ interview, status }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow mb-4">
            <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-[#1A3C40]/5 rounded-lg flex flex-col items-center justify-center text-[#1A3C40] border border-[#1A3C40]/10">
                        <span className="text-xl font-bold">{new Date(interview.scheduled_at).getDate()}</span>
                        <span className="text-xs font-semibold uppercase">{new Date(interview.scheduled_at).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {interview.application?.hiring?.job_title}
                        </h3>
                        <p className="text-gray-600 mb-3">
                            {interview.application?.company?.name}
                        </p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-gray-400" />
                                {new Date(interview.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="flex items-center gap-1.5">
                                {interview.type === 'online' ? (
                                    <Video className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                )}
                                <span className="capitalize">{interview.type} Interview</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-end gap-3">
                    {status === 'upcoming' && interview.meeting_link && (
                        <a 
                            href={interview.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#00B8D4] text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Join Meeting
                        </a>
                    )}
                    {status === 'past' && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium border border-gray-200">
                            Completed
                        </span>
                    )}
                </div>
            </div>
            
            {interview.notes && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">Notes: </span>
                        {interview.notes}
                    </p>
                </div>
            )}
        </div>
    )

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1A3C40]">My Interviews</h1>
                <p className="text-gray-500 mt-1">Manage your upcoming and past interviews</p>
            </div>

            {interviews.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No interviews scheduled</h3>
                    <p className="text-gray-500 mb-6">Applications that proceed to the interview stage will appear here</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {sortedInterviews.upcoming.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Upcoming Interviews
                            </h2>
                            {sortedInterviews.upcoming.map(interview => (
                                <InterviewCard key={interview.id} interview={interview} status="upcoming" />
                            ))}
                        </section>
                    )}

                    {sortedInterviews.past.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                Past Interviews
                            </h2>
                            {sortedInterviews.past.map(interview => (
                                <InterviewCard key={interview.id} interview={interview} status="past" />
                            ))}
                        </section>
                    )}
                </div>
            )}
        </div>
    )
}

export default Interviews
