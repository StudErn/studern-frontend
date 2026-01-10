import React from 'react'

const Footer = () => {
    return (
        <footer className="footer bg-[#D1E4E6] py-16 pb-8 text-gray-900">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <div>
                    <h3 className="text-xl font-bold mb-4">About Us</h3>
                    <ul>
                        <li className="mb-2"><a href="#" className="text-[0.95rem] opacity-80 hover:opacity-100 hover:underline transition-opacity">About StudErn</a></li>
                        <li className="mb-2"><a href="#" className="text-[0.95rem] opacity-80 hover:opacity-100 hover:underline transition-opacity">Terms & Conditions</a></li>
                        <li className="mb-2"><a href="#" className="text-[0.95rem] opacity-80 hover:opacity-100 hover:underline transition-opacity">Disclaimer</a></li>
                        <li className="mb-2"><a href="#" className="text-[0.95rem] opacity-80 hover:opacity-100 hover:underline transition-opacity">Accessibility Statement</a></li>
                        <li className="mb-2"><a href="#" className="text-[0.95rem] opacity-80 hover:opacity-100 hover:underline transition-opacity">Contact Us</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-bold mb-4">Job Seeker</h3>
                    <ul>
                        <li className="mb-2"><a href="#" className="text-[0.95rem] opacity-80 hover:opacity-100 hover:underline transition-opacity">Resume Build</a></li>
                        <li className="mb-2"><a href="#" className="text-[0.95rem] opacity-80 hover:opacity-100 hover:underline transition-opacity">My Account</a></li>
                        <li className="mb-2"><a href="#" className="text-[0.95rem] opacity-80 hover:opacity-100 hover:underline transition-opacity">Pro Service</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-bold mb-4">Recruiter</h3>
                    <ul>
                        <li className="mb-2"><a href="#" className="text-[0.95rem] opacity-80 hover:opacity-100 hover:underline transition-opacity">Create Account</a></li>
                        <li className="mb-2"><a href="#" className="text-[0.95rem] opacity-80 hover:opacity-100 hover:underline transition-opacity">Post a Job</a></li>
                        <li className="mb-2"><a href="#" className="text-[0.95rem] opacity-80 hover:opacity-100 hover:underline transition-opacity">Get Interns</a></li>
                    </ul>
                </div>

                {/* Optional 4th column for contact info or spacing if design requires 4 cols grid but only 3 populated, or adjust grid to 3 columns */}
            </div>

            <div className="border-t border-black/10 pt-8 text-center">
                <div className="container mx-auto px-4">
                    <p className="text-base font-semibold mb-2">
                        Need Any support ? Call to: <span className="text-primary font-extrabold text-xl">01512345678</span>
                    </p>
                    <p className="text-sm opacity-70">
                        Our Contact Centre is available from 9 am to 8 pm (Saturday to Thursday).
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
