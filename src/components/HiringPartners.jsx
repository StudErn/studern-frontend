import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';

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
        { name: 'Surokkha', logo: logoSurokkha },
        // Duplicating for better loop effect if needed, but Swiper loop={true} handles it mostly.
        // Let's add more duplicates to make it feel fuller if there are few items
        { name: 'ICI', logo: logoICI },
        { name: 'United Group', logo: logoUnited },
        { name: 'StarTech', logo: logoStartech },
        { name: 'Pran', logo: logoPran },
    ]

    return (
        <section className="py-16 bg-[#F0EFEB]">
            <div className="container mx-auto px-4">
                <h2 className="text-center text-3xl mb-12 font-bold text-gray-900">Hiring partners</h2>
                <div className="max-w-4xl mx-auto">
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={24}
                        slidesPerView={'auto'}
                        loop={true}
                        speed={2000}
                        autoplay={{
                            delay: 0,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            640: { slidesPerView: 3 },
                            768: { slidesPerView: 4 },
                            1024: { slidesPerView: 5 },
                        }}
                        className="py-4"
                    >
                        {partners.map((partner, index) => (
                            <SwiperSlide key={index} style={{ width: 'auto' }}>
                                <div className="bg-white w-[180px] h-[90px] flex items-center justify-center rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-300 mx-auto">
                                    <img
                                        src={partner.logo}
                                        alt={`${partner.name} logo`}
                                        className="max-w-[70%] max-h-[70%] object-contain grayscale-0 hover:grayscale-0 transition-all"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    )
}

export default HiringPartners
