import React from 'react'

const HiringPartners = () => {
    const partners = [
        { name: 'ICI', color: 'black' },
        { name: 'Unilever', color: 'orange' },
        { name: 'StarTech', color: 'blue' },
        { name: 'Pran', color: 'red' },
        { name: 'Government', color: 'green' },
        { name: 'Shwapno', color: 'orange' }
    ]

    return (
        <section className="py-16 bg-[#F9F8F4]">
            <div className="container mx-auto px-4">
                <h2 className="text-center text-3xl mb-12 font-bold text-gray-900">Hiring partners</h2>
                <div className="flex justify-center gap-6 flex-wrap">
                    {partners.map((partner, index) => (
                        <div className="bg-white w-[150px] h-[80px] flex items-center justify-center rounded-xl shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all cursor-default" key={index}>
                            <div className="font-bold text-lg" style={{ color: partner.color }}>
                                {partner.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HiringPartners
