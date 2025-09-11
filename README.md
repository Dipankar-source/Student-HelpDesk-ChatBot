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
# 🎯 Usage

## For Students
- Access the BrainuBot interface through the university portal  
- Type or speak your questions about courses, schedules, or campus facilities  
- Use quick messages for common inquiries about admissions, exams, or events  
- Export important conversations for future reference  

## For Faculty
- Use BrainuBot to quickly access student information  
- Get updates on academic schedules and room allocations  
- Receive notifications about university announcements  

---

# 🔗 API Integration

## Gemini API
BrainuBot integrates with Gemini's chat completion API to provide intelligent responses. The system prompt is configured to:
- Provide direct answers first  
- Search for current information when needed  
- Format responses clearly with proper structure  
- Maintain a professional tone  
- Include relevant links when appropriate  

## Firebase Services
- **Firestore:** Stores chat sessions and messages  
- **Authentication:** Handles anonymous user sessions  
- **Security Rules:** Ensure data privacy and protection  

---

# 🎨 Customization

## Adding New Languages
1. Update the `languages` array in `src/assets/constants.js`  
2. Add translation logic in the `translateText` function  
3. Include voice support for the new language  

## Adding Quick Messages
Edit the `quickMessages` array in `src/assets/constants.js`:

