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
    Bus
} from "lucide-react";
export const GEMINI_API_KEY = "AIzaSyAE1wNbllIfA6dUjadWzdoAs5StzXlUdPk";
export const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

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
    { id: "financial", name: "Financial", icon: CreditCard },
    { id: "campus", name: "Campus Life", icon: MapPin },
    { id: "technical", name: "Technical", icon: Settings },
];


export const quickMessages = [
    // 🎓 Admissions
    {
        id: 1,
        text: "What are the admission requirements?",
        answer: "Brainware University requires applicants to meet program-specific eligibility. For UG courses: 10+2 with required subjects; for PG courses: relevant Bachelor's degree. Entrance tests may apply for some programs.",
        category: "admissions",
        icon: GraduationCap,
        color: "bg-blue-500",
    },
    {
        id: 2,
        text: "How can I apply online?",
        answer: "You can apply online through the official portal: [https://www.brainwareuniversity.ac.in/admissions](https://www.brainwareuniversity.ac.in/admissions). Fill in the form, upload documents, and pay the application fee.",
        category: "admissions",
        icon: GraduationCap,
        color: "bg-blue-500",
    },
    {
        id: 3,
        text: "What is the last date for application?",
        answer: "Admission deadlines vary each year. Typically, applications are open till **July–August**. Always check the official admission page for updates.",
        category: "admissions",
        icon: Calendar,
        color: "bg-indigo-500",
    },
    {
        id: 4,
        text: "Can I transfer from another university?",
        answer: "Yes, Brainware University allows transfers through the **lateral entry** system, subject to program rules and eligibility.",
        category: "admissions",
        icon: Building,
        color: "bg-teal-500",
    },

    // 🎓 Academics
    {
        id: 5,
        text: "What programs are available?",
        answer: "Brainware University offers UG, PG, Diploma, and PhD programs in Engineering, Management, Computer Science, Law, Pharmacy, Biotechnology, Media Science, Nursing, Allied Health, and more.",
        category: "academics",
        icon: BookOpen,
        color: "bg-green-500",
    },
    {
        id: 6,
        text: "How do I access the course syllabus?",
        answer: "Course syllabi are available on the Brainware University website under **Academics → Syllabus** or via the Student Portal.",
        category: "academics",
        icon: FileText,
        color: "bg-emerald-600",
    },
    {
        id: 7,
        text: "How to register for classes?",
        answer: "Students can register through the **Student Portal (ERP)** during the registration period announced by the university.",
        category: "academics",
        icon: Laptop,
        color: "bg-lime-600",
    },
    {
        id: 8,
        text: "What are the grading policies?",
        answer: "The university follows a **Choice Based Credit System (CBCS)** with SGPA/CGPA grading. Minimum passing criteria vary by course.",
        category: "academics",
        icon: Star,
        color: "bg-yellow-500",
    },

    // 💰 Fees & Scholarships
    {
        id: 9,
        text: "What is the tuition fee structure?",
        answer: "Fees vary by program. For example, B.Tech starts around ₹90,000/year. Detailed fee charts are available on the official website.",
        category: "fees",
        icon: CreditCard,
        color: "bg-red-500",
    },
    {
        id: 10,
        text: "How can I pay fees online?",
        answer: "Students can pay fees via the **ERP portal** using net banking, UPI, debit/credit cards.",
        category: "fees",
        icon: CreditCard,
        color: "bg-pink-600",
    },
    {
        id: 11,
        text: "Are scholarships available?",
        answer: "Yes ✅ Brainware University offers scholarships based on merit, financial need, and government schemes.",
        category: "scholarships",
        icon: Heart,
        color: "bg-rose-500",
    },
    {
        id: 12,
        text: "How do I apply for financial aid?",
        answer: "Students can apply via the **Scholarship Cell** on campus or through state/central government portals.",
        category: "scholarships",
        icon: FileText,
        color: "bg-orange-500",
    },

    // 🏫 Campus Life
    {
        id: 13,
        text: "What hostel facilities are available?",
        answer: "Separate boys’ and girls’ hostels with WiFi, mess, security, and medical support are available on campus.",
        category: "campus",
        icon: Building,
        color: "bg-cyan-500",
    },
    {
        id: 14,
        text: "What clubs and societies can I join?",
        answer: "Brainware offers clubs for cultural, tech, innovation, NSS, music, photography, and more.",
        category: "campus",
        icon: Users,
        color: "bg-purple-500",
    },
    {
        id: 15,
        text: "How is the campus WiFi?",
        answer: "Campus-wide **high-speed WiFi** is available for students and staff.",
        category: "campus",
        icon: Globe,
        color: "bg-sky-500",
    },
    {
        id: 16,
        text: "Is there a medical center on campus?",
        answer: "Yes, a fully functional medical center with doctors and emergency services is available.",
        category: "campus",
        icon: Heart,
        color: "bg-rose-600",
    },

    // 📞 Support & Services
    {
        id: 17,
        text: "Who do I contact for technical support?",
        answer: "For ERP or portal issues, contact the **IT Helpdesk** at support@brainwareuniversity.ac.in.",
        category: "support",
        icon: Phone,
        color: "bg-gray-600",
    },
    {
        id: 18,
        text: "How can I reset my portal password?",
        answer: "Use the **Forgot Password** option on ERP login or contact IT support.",
        category: "support",
        icon: User,
        color: "bg-slate-500",
    },
    {
        id: 19,
        text: "Where can I get my ID card?",
        answer: "New students get ID cards from the **Administration Office** after admission confirmation.",
        category: "support",
        icon: User,
        color: "bg-stone-500",
    },
    {
        id: 20,
        text: "How do I access the library?",
        answer: "Students can access the library with their ID card. Online e-library resources are also available.",
        category: "support",
        icon: BookOpen,
        color: "bg-green-600",
    },

    // 🚀 Career & Placement
    {
        id: 21,
        text: "Does the university provide internships?",
        answer: "Yes, internships are facilitated by the **Placement Cell** in collaboration with companies.",
        category: "career",
        icon: Briefcase,
        color: "bg-fuchsia-500",
    },
    {
        id: 22,
        text: "What companies visit for campus placements?",
        answer: "Top recruiters include TCS, Wipro, Infosys, Cognizant, Accenture, Capgemini, and many more.",
        category: "career",
        icon: Briefcase,
        color: "bg-violet-500",
    },
    {
        id: 23,
        text: "Are there career counseling services?",
        answer: "Yes, the Career Development Cell provides counseling, workshops, and mentorship.",
        category: "career",
        icon: MessageCircle,
        color: "bg-indigo-600",
    },
    {
        id: 24,
        text: "How can I prepare for interviews?",
        answer: "You can attend soft-skills training, mock interviews, and aptitude sessions provided by the university.",
        category: "career",
        icon: Star,
        color: "bg-amber-500",
    },

    // 🕒 General
    {
        id: 25,
        text: "What are the office hours?",
        answer: "University office hours are **10:00 AM – 6:00 PM, Monday to Saturday**.",
        category: "general",
        icon: Clock,
        color: "bg-gray-500",
    },
    {
        id: 26,
        text: "Where is the university located?",
        answer: "Brainware University, 398 Ramkrishnapur Road, Barasat, Kolkata, West Bengal 700125.",
        category: "general",
        icon: MapPin,
        color: "bg-red-600",
    },
    {
        id: 27,
        text: "Is transportation provided?",
        answer: "Yes, university buses cover major routes in Kolkata and surrounding areas.",
        category: "general",
        icon: Bus,
        color: "bg-yellow-600",
    },
    {
        id: 28,
        text: "How can I contact the administration?",
        answer: "Email: info@brainwareuniversity.ac.in | Phone: +91-33-7144-5590 | Website: www.brainwareuniversity.ac.in",
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