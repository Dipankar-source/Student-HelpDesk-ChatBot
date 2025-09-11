# BrainuBot - AI Assistant for Brainware University

## 📌 Overview
BrainuBot is an intelligent AI-powered assistant designed specifically for Brainware University students and faculty. It provides instant access to university information, resources, and support through a conversational interface.

---

## 🚀 Features
- 🤖 **AI-Powered Conversations:** Powered by Gemini's advanced AI model for intelligent responses  
- 🎤 **Voice Input:** Speech recognition for hands-free interaction  
- 🔊 **Voice Output:** Text-to-speech functionality with multiple language support  
- 🌐 **Multilingual Support:** Communicate in English and Spanish  
- 📱 **Responsive Design:** Works seamlessly on desktop and mobile devices  
- 📊 **Dashboard:** View usage statistics and conversation analytics  
- 📄 **Export Conversations:** Download chat history as PDF documents  
- 💬 **Quick Messages:** Pre-defined templates for common queries  
- 🔍 **Search Functionality:** Quickly find specific information in conversations  
- 💾 **Cloud Sync:** All conversations are saved to Firebase for access across devices  

---

## 🛠 Technology Stack
- **Frontend Framework:** React.js with modern hooks  
- **Styling:** Tailwind CSS for responsive design  
- **Backend Services:** Firebase (Firestore, Authentication)  
- **AI Integration:** Gemini Chat API  
- **Speech Processing:** Web Speech API  
- **PDF Generation:** jsPDF with html2canvas  
- **Notifications:** React Toastify  
- **Date Handling:** date-fns library  

---

## ⚙️ Installation

### Prerequisites
- Node.js (v14 or higher)  
- npm or yarn package manager  
- Firebase project with Firestore and Authentication enabled  
- Gemini API account  

### Setup Instructions
1. **Clone the repository**
   ```bash
   git clone https://github.com/Dipankar-source/Student-HelpDesk-ChatBot
   cd frontend


🎯 Usage
For Students

Access the BrainuBot interface through the university portal

Type or speak your questions about courses, schedules, or campus facilities

Use quick messages for common inquiries about admissions, exams, or events

Export important conversations for future reference

For Faculty

Use BrainuBot to quickly access student information

Get updates on academic schedules and room allocations

Receive notifications about university announcements

🔗 API Integration
Gemini API

BrainuBot integrates with Gemini's chat completion API to provide intelligent responses. The system prompt is configured to:

Provide direct answers first

Search for current information when needed

Format responses clearly with proper structure

Maintain a professional tone

Include relevant links when appropriate

Firebase Services

Firestore: Stores chat sessions and messages

Authentication: Handles anonymous user sessions

Security Rules: Ensure data privacy and protection

🎨 Customization
Adding New Languages

Update the languages array in src/assets/constants.js

Add translation logic in the translateText function

Include voice support for the new language

Adding Quick Messages

Edit the quickMessages array in src/assets/constants.js:

{
  text: "Your question here",
  answer: "Predefined answer here",
  category: "category-name"
}

Modifying the UI

The component structure is organized as follows:

Header: Navigation and controls

Sidebar: Statistics and categories

Chat: Message display area

InputArea: Message input field

QuickMessages: Predefined message templates

Footer: Additional information and links

📂 Project Structure
Root Level
brainubot/
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── render.yaml
├── static.json
├── vite.config.js

Pages & Services
src/
├── pages/
│   ├── Auth/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── Extra.jsx
│   │   └── Home.jsx
│   └── service/
│       └── firebase.js
├── App.jsx
├── index.css
├── main.jsx

Public Assets
public/
├── help.png
├── university-building.png
├── university-logo.png
└── vite.svg

Frontend (src)
src/
├── assets/
│   ├── constants.js
│   └── react.svg
├── components/
│   ├── Chat.jsx
│   ├── ChatHistory.jsx
│   ├── Footer.jsx
│   ├── Header.jsx
│   ├── InputArea.jsx
│   ├── Message.jsx
│   ├── ProtectedRoute.jsx
│   ├── QuickMessages.jsx
│   ├── Sidebar.jsx
│   └── TypingIndicator.jsx

🚀 Deployment

Build for Production

npm run build


Deploy to Firebase Hosting

npm install -g firebase-tools
firebase login
firebase init
firebase deploy

🛠 Troubleshooting

Speech Recognition Not Working: Ensure browser supports Web Speech API

API Errors: Verify Gemini API key is valid and active

Firebase Connection Issues: Check Firebase configuration and rules

PDF Generation Problems: Ensure images are properly hosted and accessible

🌐 Browser Compatibility

Chrome (recommended)

Firefox

Safari

Edge

📞 Support

For technical support or questions about BrainuBot, please contact:

Brainware University IT Department
📧 Email: support@brainwareuniversity.ac.in
📞 Phone: +91-XXX-XXXX-XXXX

📜 License

This project is proprietary software developed for and owned by Brainware University. All rights reserved.

📌 Version History

v1.0.0 (Current): Initial release with core functionality

Planned: Integration with university ERP system

Planned: Additional language support

Planned: Mobile app development

© 2023 Brainware University. All Rights Reserved.
This response is AI-generated, for reference only.
