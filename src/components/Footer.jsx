import React from 'react'

const Footer = () => {
    return (
        <footer className="footer bg-[#C9D6DA] py-16 pb-8 text-[#1F2040]">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-5xl">
                <div>
                    <h3 className="text-2xl font-normal mb-6">About Us</h3>
                    <ul className="space-y-3">
                        <li><a href="#" className="text-base font-light hover:underline">About StudErn</a></li>
                        <li><a href="#" className="text-base font-light hover:underline">Terms & Conditions</a></li>
                        <li><a href="#" className="text-base font-light hover:underline">Disclaimer</a></li>
                        <li><a href="#" className="text-base font-light hover:underline">Accessibility Statement</a></li>
                        <li><a href="#" className="text-base font-light hover:underline">Contact Us</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-2xl font-normal mb-6">Job Seeker</h3>
                    <ul className="space-y-3">
                        <li><a href="#" className="text-base font-light hover:underline">Resume Build</a></li>
                        <li><a href="#" className="text-base font-light hover:underline">My Account</a></li>
                        <li><a href="#" className="text-base font-light hover:underline">Pro Service</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-2xl font-normal mb-6">Recruiter</h3>
                    <ul className="space-y-3">
                        <li><a href="#" className="text-base font-light hover:underline">Create Account</a></li>
                        <li><a href="#" className="text-base font-light hover:underline">Post a Job</a></li>
                        <li><a href="#" className="text-base font-light hover:underline">Get Interns</a></li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-400/50 pt-8 text-center max-w-5xl mx-auto">
                <div className="container mx-auto px-4">
                    <p className="text-lg font-medium mb-2 flex items-center justify-center gap-2">
                        Need any support ? Call to: <span className="font-bold text-3xl text-[#1F2040]">01512345678</span>
                    </p>
                    <p className="text-base opacity-80 font-light">
                        Our Contact Centre is available from 9 am to 8 pm (Saturday to Thursday).
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
