import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import SearchSection from '../components/SearchSection'
import HiringPartners from '../components/HiringPartners'
import JobsSection from '../components/JobsSection'
import EventsSection from '../components/EventsSection'
import ResumeCTA from '../components/ResumeCTA'
import Footer from '../components/Footer'

const Home = () => {
    return (
        <div className="home-page">
            <Navbar />
            <main>
                <Hero />
                <SearchSection />
                <HiringPartners />
                <JobsSection />
                <EventsSection />
                <ResumeCTA />
            </main>
            <Footer />
        </div>
    )
}

export default Home
