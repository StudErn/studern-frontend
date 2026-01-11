import logoPran from '../assets/Company job logos/Pran.png'
import logoStartech from '../assets/Company job logos/Startech.png'
import logoUnited from '../assets/Company job logos/United.png'
import logoICI from '../assets/Company job logos/ICI.png'

export const jobsData = [
    {
        id: "fj1",
        title: "Client Acquisition Specialist",
        company: "Pran private Limited",
        logo: logoPran,
        experience: "Freshers",
        jobType: "Full Time",
        workType: "Work at Home",
        tags: ["Remote"],
        highlights: ["Lead generation", "Client communication", "Achieve sales target"],
        logoBg: "#ffffff",
        logoText: "P",
        cardColor: "#B4D2D5", // Light Teal
        deadline: "20/15/2025",
        vacancy: "02",
        gender: "Only Male",
        salary: "15000-20000",
        location: "Dhaka",
        skills: "designing,UI/UX design",
        additionalRequirements: ["Age 22 to 35 years"],
        responsibilities: [
            "Start-to-end client handling.",
            "Maintain client relationships."
        ],
        aboutCompany: "Pran-RFL Group is one of the largest conglomerates in Bangladesh..."
    },
    {
        id: "fj2",
        title: "UI/UX Designer",
        company: "Startech",
        logo: logoStartech,
        experience: "Freshers",
        jobType: "Internship",
        workType: "Work From Home",
        salary: "6000-7000",
        location: "Remote",
        deadline: "30/06/2026",
        vacancy: "05",
        skills: "Communication, Data Entry",
        additionalRequirements: ["Undergraduate student"],
        highlights: ["Proven experience with Flutter", "Expertise with Figma", "Strong communication skills"],
        cardColor: "#E8E6C9" // Beige
    },
    {
        id: "fj3",
        title: "Town Planner/Urban Planner",
        company: "United Group",
        logo: logoUnited,
        experience: "Freshers",
        jobType: "Internship",
        workType: "Work from office",
        salary: "10000-12000",
        location: "Dhaka",
        deadline: "15/07/2026",
        vacancy: "03",
        skills: "Management, Office Suite",
        highlights: ["Project management", "Ability to work under deadlines", "Handle multiple projects"],
        cardColor: "#D9D9D9" // Light Grey
    },
    {
        id: "in1",
        title: "Executive (Tele Marketing)",
        company: "Startech",
        logo: logoStartech,
        experience: "Any",
        jobType: "Training",
        workType: "Work From Home",
        salary: "10000-15000",
        location: "Remote",
        deadline: "Ongoing",
        vacancy: "Unlimited",
        skills: "Web Development, Design",
        highlights: ["Handle client queries", "Work closely with business development", "Maintain high call quality"],
        cardColor: "#EAEAEA" // Lighter Grey
    },
    {
        id: "in2",
        title: "Faculty Member (Training)",
        company: "ICI",
        logo: logoICI,
        experience: "Freshers",
        jobType: "Internship",
        workType: "Work from office",
        salary: "Unpaid",
        location: "Chittagong",
        deadline: "01/09/2026",
        vacancy: "02",
        skills: "Learning attitude",
        highlights: ["Computer operations", "Excellent interpersonal skills", "Know Safeguarding"],
        cardColor: "#CFF4D2" // Light Green
    },
    {
        id: "in3",
        title: "Project Engineer",
        company: "Pran private Limited",
        logo: logoPran,
        experience: "Freshers",
        jobType: "Full Time",
        workType: "Work at Home",
        deadline: "20/15/2025",
        vacancy: "02",
        gender: "Only Male",
        salary: "15000-20000",
        location: "Dhaka",
        skills: "designing,UI/UX design",
        additionalRequirements: ["Age 22 to 35 years"],
        highlights: ["Delivers engaging presentations", "Resolves issues promptly", "Communicates critical information"],
        cardColor: "#B4D2D5" // Light Teal
    },
    {
        id: "in4",
        title: "Junior Web Developer",
        company: "Tech Solutions",
        // No logo for Tech Solutions, will handle gracefully in component or reuse one if needed, but let's leave it undefined to test fallback or just let it be blank
        experience: "1-2 Years",
        jobType: "Full Time",
        workType: "Remote",
        salary: "15000-20000",
        location: "Remote",
        deadline: "30/08/2026",
        vacancy: "01",
        skills: "React, Node.js",
        additionalRequirements: ["Portfolio required"],
        highlights: ["React.js development", "API integration", "Team collaboration"],
        cardColor: "#F4E1D2" // Pale Orange/Pink
    }
]
