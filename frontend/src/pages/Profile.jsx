import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../service/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phone: "",
    studentId: "",
    dob: "",
    address: "",
    university: "",
    faculty: "",
    department: "",
    program: "",
    semester: "",
    preferredLanguage: "en",
  });
  const [statistics, setStatistics] = useState({
    chats: 0,
    messages: 0,
    queriesResolved: 0,
    voiceInteractions: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        
        // Set up real-time listener for user data
        const userDocRef = doc(db, "users", user.uid);
        const unsubscribeUser = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            setFormData({
              displayName: userData.fullName || user.displayName || "",
              email: userData.email || user.email || "",
              phone: userData.phone || "",
              studentId: userData.studentId || "",
              dob: userData.dob || "",
              address: userData.address || "",
              university: userData.university || "",
              faculty: userData.faculty || "",
              department: userData.department || "",
              program: userData.program || "",
              semester: userData.semester || "",
              preferredLanguage: userData.preferredLanguage || "en",
            });

            if (userData.statistics) {
              setStatistics(userData.statistics);
            }
            
            setIsLoading(false);
          } else {
            // Create a basic user document if it doesn't exist
            setFormData({
              displayName: user.displayName || "",
              email: user.email || "",
              phone: "",
              studentId: "",
              dob: "",
              address: "",
              university: "",
              faculty: "",
              department: "",
              program: "",
              semester: "",
              preferredLanguage: "en",
            });
            setIsLoading(false);
          }
        }, (error) => {
          console.error("Error listening to user data:", error);
          setIsLoading(false);
        });

        return () => unsubscribeUser();
      } else {
        navigate("/");
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error logging out");
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      
      // Update Firebase Auth profile
      if (formData.displayName !== user.displayName) {
        await updateProfile(auth.currentUser, {
          displayName: formData.displayName,
        });
      }

      // Update Firestore user document
      await updateDoc(doc(db, "users", user.uid), {
        fullName: formData.displayName,
        phone: formData.phone,
        studentId: formData.studentId,
        dob: formData.dob,
        address: formData.address,
        university: formData.university,
        faculty: formData.faculty,
        department: formData.department,
        program: formData.program,
        semester: formData.semester,
        preferredLanguage: formData.preferredLanguage,
        lastUpdated: new Date(),
      });

      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Chat
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
                  {formData.displayName ? formData.displayName.charAt(0).toUpperCase() : "U"}
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{formData.displayName || "User"}</h2>
                <p className="text-gray-600 text-sm">{formData.email}</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${activeTab === "profile" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab("stats")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${activeTab === "stats" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Usage Statistics
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center text-red-600 hover:bg-red-50"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Profile</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Personal Details</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="displayName"
                              value={formData.displayName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Enter your full name"
                            />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                              {formData.displayName || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{formData.email}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                          {isEditing ? (
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Enter your phone number"
                            />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                              {formData.phone || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                          {isEditing ? (
                            <input
                              type="date"
                              name="dob"
                              value={formData.dob}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                              {formData.dob || "Not provided"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Academic Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="studentId"
                              value={formData.studentId}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Enter your student ID"
                            />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                              {formData.studentId || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="university"
                              value={formData.university}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Enter your university"
                            />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                              {formData.university || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="faculty"
                              value={formData.faculty}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Enter your faculty"
                            />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                              {formData.faculty || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="department"
                              value={formData.department}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Enter your department"
                            />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                              {formData.department || "Not provided"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Additional Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="program"
                              value={formData.program}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Enter your program"
                            />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                              {formData.program || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="semester"
                              value={formData.semester}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Enter your semester"
                            />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                              {formData.semester || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Enter your address"
                            />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                              {formData.address || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                          {isEditing ? (
                            <select
                              name="preferredLanguage"
                              value={formData.preferredLanguage}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                              <option value="en">English</option>
                              <option value="hi">Hindi</option>
                              <option value="bn">Bengali</option>
                            </select>
                          ) : (
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                              {formData.preferredLanguage === "en" && "English"}
                              {formData.preferredLanguage === "hi" && "Hindi"}
                              {formData.preferredLanguage === "bn" && "Bengali"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "stats" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Usage Statistics</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-indigo-100">Chat Sessions</p>
                        <p className="text-3xl font-bold mt-1">{statistics.chats}</p>
                      </div>
                      <div className="bg-white bg-opacity-20 p-3 rounded-full">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Queries Resolved</p>
                        <p className="text-3xl font-bold mt-1">{statistics.queriesResolved}</p>
                      </div>
                      <div className="bg-white bg-opacity-20 p-3 rounded-full">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">Voice Interactions</p>
                        <p className="text-3xl font-bold mt-1">{statistics.voiceInteractions}</p>
                      </div>
                      <div className="bg-white bg-opacity-20 p-3 rounded-full">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-amber-100">Total Messages</p>
                        <p className="text-3xl font-bold mt-1">{statistics.messages}</p>
                      </div>
                      <div className="bg-white bg-opacity-20 p-3 rounded-full">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Activity Overview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">Daily Average</p>
                      <p className="text-xl font-semibold text-indigo-600">{Math.round(statistics.messages / 30) || 0}</p>
                      <p className="text-xs text-gray-500">messages</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">Resolution Rate</p>
                      <p className="text-xl font-semibold text-green-600">
                        {statistics.chats ? Math.round((statistics.queriesResolved / statistics.chats) * 100) : 0}%
                      </p>
                      <p className="text-xs text-gray-500">of queries</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">Voice Usage</p>
                      <p className="text-xl font-semibold text-purple-600">
                        {statistics.messages ? Math.round((statistics.voiceInteractions / statistics.messages) * 100) : 0}%
                      </p>
                      <p className="text-xs text-gray-500">of interactions</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">Active Days</p>
                      <p className="text-xl font-semibold text-amber-600">{Math.round(statistics.chats / 3) || 0}</p>
                      <p className="text-xs text-gray-500">this month</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;