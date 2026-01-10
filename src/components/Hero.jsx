import React from 'react'
import heroImage from '../assets/hero-section/hero-section.png'

const Hero = () => {
    return (
        <section className="bg-white py-16 md:py-24">
            <div className="container mx-auto px-6 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
                <div className="flex-1 w-full md:w-1/2 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-bold text-[#1F2040] leading-tight mb-6 tracking-tight">
                        Launch Your career<br />
                        Connect with future<br />
                        opportunities
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 font-medium mb-10 pl-1">
                        Let's make the CV you need right now...!
                    </p>
                    <button className="bg-[#1F2040] text-white px-10 py-4 rounded-full font-bold text-base transition-all hover:opacity-90 hover:shadow-lg inline-block cursor-pointer">
                        Make Your CV
                    </button>
                </div>
                <div className="flex-1 w-full md:w-1/2 flex justify-center md:justify-end relative">
                    <img
                        src={heroImage}
                        alt="Career opportunities illustration"
                        className="max-w-full h-auto w-[600px] object-contain"
                    />
                </div>
            </div>
        </section>
    )
}

export default Hero
