import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { jobsData } from '../data/jobs'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './JobDetails.css'

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);

    useEffect(() => {
        // Find job by ID
        const foundJob = jobsData.find(j => j.id === parseInt(id));
        setJob(foundJob);
    }, [id]);

    if (!job) {
        return (
            <div className="job-details-page">
                <Navbar />
                <div className="container loading">Loading...</div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="job-details-page">
            <Navbar />

            <div className="job-details-container container">

                <div className="job-header">
                    <div className="job-header-top">
                        <div className="company-info-large">
                            <h2 className="company-name-large-text">{job.logoText === "NEC" ? "NEC" : job.company}</h2>
                            {/* Assuming logoText is the logo acronym, using full name if available or constructing it */}
                        </div>
                    </div>

                    <div className="job-title-row">
                        <div>
                            <p className="company-full-name">{job.company}</p>
                            <h1 className="job-title-large">{job.title}</h1>
                        </div>
                        <div className="job-deadline">
                            Application deadline <strong>{job.deadline}</strong>
                        </div>
                    </div>
                    <div className="header-divider"></div>
                </div>

                <div className="job-content">

                    <div className="job-section">
                        <h3>vacancy</h3>
                        <p>{job.vacancy}</p>
                    </div>

                    <div className="job-section">
                        <h3>Responsibilities & Context</h3>
                        <ul className="details-list">
                            {job.responsibilities?.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    {job.additionalRequirements && (
                        <div className="job-section">
                            <h3>Additional Requirements</h3>
                            <ul className="details-list">
                                {job.additionalRequirements.map((req, idx) => (
                                    <li key={idx}>{req}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="job-section">
                        <h3>Workplace</h3>
                        <p>{job.workType}</p>
                    </div>

                    <div className="job-section">
                        <h3>Employment Status</h3>
                        <p>{job.jobType}</p>
                    </div>

                    {job.gender && (
                        <div className="job-section">
                            <h3>Gender</h3>
                            <p>{job.gender}</p>
                        </div>
                    )}

                    <div className="job-section">
                        <h3>Job Location</h3>
                        <p>{job.location}</p>
                    </div>

                    {job.skills && (
                        <div className="job-section">
                            <h3>Skills & Expertise</h3>
                            <p>{job.skills}</p>
                        </div>
                    )}

                    <div className="job-section">
                        <h3>Salary Range</h3>
                        <p>{job.salary}</p>
                    </div>

                    <button className="apply-now-btn large">Apply now</button>

                </div>

                {job.aboutCompany && (
                    <div className="company-footer-card">
                        <p><strong>Address:</strong><br />{job.companyAddress}</p>
                        <p><strong>Business:</strong><br />{job.aboutCompany}</p>
                    </div>
                )}

            </div>

            <Footer />
        </div>
    )
}

export default JobDetails
