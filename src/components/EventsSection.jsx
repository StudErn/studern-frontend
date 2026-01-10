import React from 'react'
import './EventsSection.css'

const EventsSection = () => {
    return (
        <section className="events-section">
            <div className="container">
                <h2 className="section-title-left">Events</h2>

                <div className="events-grid">
                    {/* Card 1 */}
                    <div className="event-card card-teal">
                        <div className="event-content">
                            <span className="event-tag">Online courses</span>
                            <h3>Online courses with guaranteed placement</h3>
                            <button className="event-btn">Register</button>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="event-card card-dark">
                        <div className="event-content">
                            <span className="event-tag">Hiring</span>
                            <h3>Mega Internship Sprint</h3>
                            <p>Apply to premium companies now</p>
                            <div className="tags">
                                <span>Free Registration</span>
                                <span>Part-time</span>
                            </div>
                        </div>
                        {/* Illustration placeholder */}
                        <div className="event-illustration">Sprint</div>
                    </div>

                    {/* Card 3 */}
                    <div className="event-card card-gold">
                        <div className="event-content">
                            <span className="event-tag">Job Fair</span>
                            <h3>Intern Job Fair</h3>
                            <p>Top companies hiring</p>
                            <button className="event-btn dark">Join Now</button>
                        </div>
                        {/* Illustration placeholder */}
                        <div className="event-illustration">Fair</div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default EventsSection
