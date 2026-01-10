import React from 'react'
import heroImage from '../assets/hero-illustration.png'

const Hero = () => {
    return (
        <section className="bg-[#E8F3F1] py-16">
            <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div className="flex-1">
                    <h1 className="text-4xl md:text-[3.5rem] leading-[1.1] font-bold mb-6 text-gray-900">
                        Launch Your career<br />
                        Connect with future<br />
                        opportunities
                    </h1>
                    <p className="text-lg md:text-xl mb-8 text-gray-600 font-medium">
                        Let's make the CV you need right now. !
                    </p>
                    <button className="bg-primary text-white px-8 py-3 rounded-full font-semibold text-base transition-all hover:-translate-y-0.5 hover:opacity-90 inline-block cursor-pointer">
                        Make Your CV
                    </button>
                </div>
                <div className="flex-1 flex justify-center md:justify-end">
                    <img
                        src={heroImage}
                        alt="Career opportunities illustration"
                        className="max-w-full h-auto max-h-[400px]"
                    />
                </div>
            </div>
        </section>
    )
}

export default Hero
