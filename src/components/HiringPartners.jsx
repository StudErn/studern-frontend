import React from 'react'
import logoICI from '../assets/Company job logos/ICI.png'
import logoUnited from '../assets/Company job logos/United.png'
import logoStartech from '../assets/Company job logos/Startech.png'
import logoPran from '../assets/Company job logos/Pran.png'
import logoGovt from '../assets/Company job logos/Bd-govt.png'
import logoSurokkha from '../assets/Company job logos/Surokkha.png'

const HiringPartners = () => {
    const partners = [
        { name: 'ICI', logo: logoICI },
        { name: 'United Group', logo: logoUnited },
        { name: 'StarTech', logo: logoStartech },
        { name: 'Pran', logo: logoPran },
        { name: 'Government', logo: logoGovt },
        { name: 'Surokkha', logo: logoSurokkha }
    ]

    return (
        <section className="py-16 bg-[#F0EFEB]">
            <div className="container mx-auto px-4">
                <h2 className="text-center text-3xl mb-12 font-bold text-gray-900">Hiring partners</h2>
                <div className="flex justify-center gap-6 flex-wrap max-w-4xl mx-auto">
                    {partners.map((partner, index) => (
                        <div className="bg-white w-[180px] h-[90px] flex items-center justify-center rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-300" key={index}>
                            <img
                                src={partner.logo}
                                alt={`${partner.name} logo`}
                                className="max-w-[70%] max-h-[70%] object-contain grayscale-0 hover:grayscale-0 transition-all"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HiringPartners
