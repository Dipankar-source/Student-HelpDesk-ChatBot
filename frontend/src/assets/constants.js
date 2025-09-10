import {
    Target,
    BookOpen,
    GraduationCap,
    Building,
    User,
    Calendar,
    Globe,
    Phone,
    Laptop,
    Briefcase,
    Heart,
    Users,
    FileText,
    Clock,
    MessageCircle,
    Star,
    CreditCard,
    MapPin,
    Settings,
    Zap,
    Bus,
    Award,
    Lightbulb,
} from "lucide-react";

export const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
];

export const categories = [
    { id: "all", name: "All Topics", icon: Target },
    { id: "academics", name: "Academics", icon: BookOpen },
    { id: "admissions", name: "Admissions", icon: GraduationCap },
    { id: "fees", name: "Fees & Scholarships", icon: CreditCard },
    { id: "scholarships", name: "Scholarships", icon: Heart },
    { id: "campus", name: "Campus Life", icon: MapPin },
    { id: "support", name: "Support & Services", icon: Settings },
    { id: "career", name: "Career & Placement", icon: Briefcase },
    { id: "awards", name: "Awards & Achievements", icon: Award },
    { id: "general", name: "General", icon: Clock },
];



export const quickMessages = [
    // 🎓 Admissions
    {
        id: 1,
        text: "What are the admission requirements?",
        answer: "Brainware University requires applicants to meet **program-specific eligibility criteria**. For **UG courses**: 10+2 with relevant subjects; for **PG courses**: a relevant Bachelor's degree. Some programs may require **entrance tests or interviews**. Ensure all academic transcripts, certificates, and identification documents are ready for submission. **Special programs** may also have additional requirements, like portfolios for Media Science or practical tests for Biotechnology.",
        category: "admissions",
        icon: GraduationCap,
        color: "bg-blue-500",
    },
    {
        id: 2,
        text: "How can I apply online?",
        answer: "You can apply through the official portal: [Brainware University Admissions](https://www.brainwareuniversity.ac.in/admissions). Steps: **1. Fill the online application form with personal and academic details. 2. Upload required documents (marksheets, certificates, ID proof). 3. Pay the application fee using net banking, UPI, or card payment. 4. Download confirmation receipt for your records.** For some programs, an interview or assessment may be scheduled after application submission.",
        category: "admissions",
        icon: GraduationCap,
        color: "bg-blue-500",
    },
    {
        id: 3,
        text: "What is the last date for application?",
        answer: "Admission deadlines vary each year. Typically, applications remain open until **July–August**. Always check the **official admission page** for the most updated dates. Late applications may be considered **under special approval**, and early application increases chances for scholarships and hostel allocation.",
        category: "admissions",
        icon: Calendar,
        color: "bg-indigo-500",
    },
    {
        id: 4,
        text: "Can I transfer from another university?",
        answer: "Yes, Brainware University allows transfers through **lateral entry**, subject to program rules and availability of seats. Students must submit **official transcripts, transfer certificates, and approval from the current university**. Admission committees review eligibility based on **credits completed, academic performance, and program compatibility**.",
        category: "admissions",
        icon: Building,
        color: "bg-teal-500",
    },

    // 🎓 Academics
    {
        id: 5,
        text: "What programs are available?",
        answer: "Brainware University offers **UG, PG, Diploma, and PhD programs** across diverse disciplines: Engineering, Management, Computer Science, Law, Pharmacy, Biotechnology, Media Science, Nursing, Allied Health, Commerce, and Humanities. Students can choose from **specializations, elective courses, and interdisciplinary programs** to enhance career readiness and skill development.",
        category: "academics",
        icon: BookOpen,
        color: "bg-green-500",
    },
    {
        id: 6,
        text: "How do I access the course syllabus?",
        answer: "Course syllabi are available on the **official website → Academics → Syllabus** or through the **Student ERP portal**. Each syllabus contains **course objectives, learning outcomes, weekly topics, assessment methods, reference materials, and project requirements**. Students are encouraged to consult professors for additional reading or research resources.",
        category: "academics",
        icon: FileText,
        color: "bg-emerald-600",
    },
    {
        id: 7,
        text: "How to register for classes?",
        answer: "Class registration is done via the **Student ERP Portal**. Steps: **1. Log in to ERP. 2. Select courses based on prerequisites. 3. Confirm registration. 4. Download the timetable and receipt.** Ensure that all dues are cleared before registration. Advisors are available to help select the best course combination for graduation requirements.",
        category: "academics",
        icon: Laptop,
        color: "bg-lime-600",
    },
    {
        id: 8,
        text: "What are the grading policies?",
        answer: "The university follows a **Choice Based Credit System (CBCS)**. Grading is on **SGPA/CGPA**. Minimum passing criteria are **typically 40–50% per course**, varying by program. Re-evaluation, backlogs, and improvement exams are allowed as per academic policy. Detailed rubrics and course weightage are provided in the **academic handbook**.",
        category: "academics",
        icon: Star,
        color: "bg-yellow-500",
    },

    // 💰 Fees & Scholarships
    {
        id: 9,
        text: "What is the tuition fee structure?",
        answer: "Fees vary by program. **B.Tech starts around ₹90,000/year**, MBA approx. ₹1,00,000/year. Fees include tuition, lab charges, library fees, and campus services. Installment plans are available for select programs. Detailed charts and online calculators are provided on the **official website** for planning.",
        category: "fees",
        icon: CreditCard,
        color: "bg-red-500",
    },
    {
        id: 10,
        text: "How can I pay fees online?",
        answer: "Students can pay fees via the **ERP portal** using net banking, UPI, or debit/credit cards. Steps: **1. Log in → 2. Select fee category → 3. Choose payment mode → 4. Complete transaction → 5. Download receipt.** Keep receipts for records. Technical support is available for failed or delayed transactions.",
        category: "fees",
        icon: CreditCard,
        color: "bg-pink-600",
    },
    {
        id: 11,
        text: "Are scholarships available?",
        answer: "Yes ✅ Brainware University offers **merit-based, need-based, and government scholarships**. Merit scholarships are awarded for top academic performance, while need-based scholarships support financially challenged students. Certain scholarships also reward excellence in **sports, arts, innovation, and entrepreneurship**.",
        category: "scholarships",
        icon: Heart,
        color: "bg-rose-500",
    },
    {
        id: 12,
        text: "How do I apply for financial aid?",
        answer: "Apply via the **Scholarship Cell** on campus or through government portals. Steps: **1. Submit financial documents → 2. Complete application form → 3. Committee review → 4. Fund disbursement.** Students are encouraged to apply early to maximize support. Assistance is available for filling forms and documentation.",
        category: "scholarships",
        icon: FileText,
        color: "bg-orange-500",
    },

    // 🏫 Campus Life
    {
        id: 13,
        text: "What hostel facilities are available?",
        answer: "Brainware provides **separate boys’ and girls’ hostels** with WiFi, well-maintained mess, 24/7 security, recreational areas, and on-site medical support. Rooms are furnished and include common lounges. Hostel applications are online or at the **Hostel Office**. Hostel life includes cultural and tech activities for holistic development.",
        category: "campus",
        icon: Building,
        color: "bg-cyan-500",
    },
    {
        id: 14,
        text: "What clubs and societies can I join?",
        answer: "Students can join clubs for **cultural events, technology, innovation, sports, NSS, music, photography, debate, and entrepreneurship**. Brainware regularly conducts **hackathons, competitions, and workshops** to develop skills, leadership, and creativity.",
        category: "campus",
        icon: Users,
        color: "bg-purple-500",
    },
    {
        id: 15,
        text: "How is the campus WiFi?",
        answer: "Campus-wide **high-speed WiFi** is available in classrooms, hostels, library, and common areas. It supports **online learning, research projects, cloud tools, and student collaboration platforms**.",
        category: "campus",
        icon: Globe,
        color: "bg-sky-500",
    },
    {
        id: 16,
        text: "Is there a medical center on campus?",
        answer: "Yes, a fully equipped **medical center** with doctors, emergency services, and routine health checkups is available. It also runs **health awareness programs and vaccination drives** for students and staff.",
        category: "campus",
        icon: Heart,
        color: "bg-rose-600",
    },

    // 📞 Support & Services
    {
        id: 17,
        text: "Who do I contact for technical support?",
        answer: "For ERP or portal issues, contact the **IT Helpdesk**: support@brainwareuniversity.ac.in. Assistance includes **login issues, portal navigation, software support, and online course access**.",
        category: "support",
        icon: Phone,
        color: "bg-gray-600",
    },
    {
        id: 18,
        text: "How can I reset my portal password?",
        answer: "Use the **Forgot Password** option on ERP login or contact IT support. Verification is done using the **registered email or phone number**, and temporary credentials are provided securely.",
        category: "support",
        icon: User,
        color: "bg-slate-500",
    },
    {
        id: 19,
        text: "Where can I get my ID card?",
        answer: "New students get ID cards from the **Administration Office** after admission confirmation. Replacement cards are available online or at the office with proper verification.",
        category: "support",
        icon: User,
        color: "bg-stone-500",
    },
    {
        id: 20,
        text: "How do I access the library?",
        answer: "Students access the library using their **ID card**. The library offers **physical books, journals, e-books, online databases, and research tools**. Library orientation sessions are conducted, and research support is available for projects, assignments, and thesis work.",
        category: "support",
        icon: BookOpen,
        color: "bg-green-600",
    },

    // 🚀 Career & Placement
    {
        id: 21,
        text: "Does the university provide internships?",
        answer: "Yes, the **Placement & Career Development Cell** coordinates internships with industry partners, including **IT, finance, healthcare, media, and biotechnology sectors**. Students get mentorship, hands-on exposure, and networking opportunities for future careers.",
        category: "career",
        icon: Briefcase,
        color: "bg-fuchsia-500",
    },
    {
        id: 22,
        text: "What companies visit for campus placements?",
        answer: "Top recruiters include **TCS, Wipro, Infosys, Cognizant, Accenture, Capgemini, IBM, Tech Mahindra, HCL, Deloitte, and more**. Average placement percentages are **85–90%**, with packages ranging from **₹3–15 LPA**, depending on program and performance. Startups and niche companies also provide opportunities in emerging tech and innovation sectors.",
        category: "career",
        icon: Briefcase,
        color: "bg-violet-500",
    },
    {
        id: 23,
        text: "Are there career counseling services?",
        answer: "Yes, the **Career Development Cell** provides **one-on-one counseling, workshops, mock interviews, resume building, mentorship, alumni guidance, and industry guest sessions**. Students can plan career paths, explore startups, or prepare for higher studies abroad.",
        category: "career",
        icon: MessageCircle,
        color: "bg-indigo-600",
    },
    {
        id: 24,
        text: "How can I prepare for interviews?",
        answer: "Attend **soft-skills training, aptitude tests, group discussions, and mock interviews** organized by the university. **Industry-specific preparation sessions** are conducted with recruiters and alumni feedback. Students can also practice **case studies, technical tasks, and portfolio presentations**.",
        category: "career",
        icon: Star,
        color: "bg-amber-500",
    },

    // 🏆 Awards & Achievements
    {
        id: 29,
        text: "What are the university's awards and recognitions?",
        answer: "Brainware University has received **national and international recognitions**: 🏅 Ranked among the **top private universities in West Bengal**. 🏅 Winner in **Smart India Hackathon (SIH), SBH Hackathon, Nexathon, and Texibition**. 🏅 Students have won awards for **AI, robotics, innovation, entrepreneurship, and cultural achievements**. The university emphasizes **research, innovation, and skill-based development**, contributing to its strong placement record.",
        category: "awards",
        icon: Award,
        color: "bg-indigo-500",
    },
    {
        id: 30,
        text: "What are the notable student projects?",
        answer: "Students have undertaken projects such as **AI-powered Agriculture Management System, Smart Healthcare solutions, IoT-enabled monitoring systems, and Innovation-driven entrepreneurship projects**. Many projects have been showcased at **national competitions, tech fests, and research journals**. Brainware supports **startup incubation and patent filing** for innovative projects.",
        category: "awards",
        icon: Lightbulb,
        color: "bg-yellow-500",
    },

    // 🕒 General
    {
        id: 25,
        text: "What are the office hours?",
        answer: "University office hours: **10:00 AM – 6:00 PM, Monday to Saturday**. Departments may have additional timings for student services.",
        category: "general",
        icon: Clock,
        color: "bg-gray-500",
    },
    {
        id: 26,
        text: "Where is the university located?",
        answer: "Brainware University, **398 Ramkrishnapur Road, Barasat, Kolkata, West Bengal 700125**. Easily accessible via public and private transport.",
        category: "general",
        icon: MapPin,
        color: "bg-red-600",
    },
    {
        id: 27,
        text: "Is transportation provided?",
        answer: "Yes, university buses cover major routes in **Kolkata and surrounding areas**, ensuring safe and convenient travel for students and staff.",
        category: "general",
        icon: Bus,
        color: "bg-yellow-600",
    },
    {
        id: 28,
        text: "How can I contact the administration?",
        answer: "Email: **info@brainwareuniversity.ac.in** | Phone: **+91-33-7144-5590** | Website: **www.brainwareuniversity.ac.in**. Administration handles **admissions, student affairs, and general inquiries**.",
        category: "general",
        icon: Phone,
        color: "bg-teal-600",
    },
];





export const stats = [
    { label: "Students Helped", value: "10,000+", icon: Users },
    { label: "Questions Answered", value: "50,000+", icon: MessageCircle },
    { label: "Languages Supported", value: "8+", icon: Globe },
    { label: "Average Response Time", value: "<2s", icon: Zap },
];