import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaIdCard,
  FaUniversity,
  FaGraduationCap,
  FaBook,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
    university: "",
    faculty: "",
    department: "",
    program: "",
    semester: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  // Sample data for dropdowns
  const universities = [
    "Harvard University",
    "Stanford University",
    "MIT",
    "Cambridge University",
    "Oxford University",
    "University of Toronto",
    "University of Melbourne",
  ];

  const faculties = [
    "Engineering",
    "Science",
    "Arts",
    "Business",
    "Medicine",
    "Law",
    "Brainucation",
  ];

  const departments = [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Physics",
    "Chemistry",
    "Mathematics",
    "Biology",
  ];

  const programs = [
    "Bachelor of Science",
    "Bachelor of Arts",
    "Bachelor of Engineering",
    "Master of Science",
    "Master of Business Administration",
    "PhD",
  ];

  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      }

      if (!formData.studentId.trim()) {
        newErrors.studentId = "Student ID is required";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      }

      if (!formData.dob) {
        newErrors.dob = "Date of birth is required";
      }
    }

    if (step === 2) {
      if (!formData.university) {
        newErrors.university = "University is required";
      }

      if (!formData.faculty) {
        newErrors.faculty = "Faculty is required";
      }

      if (!formData.department) {
        newErrors.department = "Department is required";
      }

      if (!formData.program) {
        newErrors.program = "Program is required";
      }

      if (!formData.semester) {
        newErrors.semester = "Semester is required";
      }
    }

    if (step === 3) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password =
          "Password must contain uppercase, lowercase, and number";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(3)) {
      return;
    }
    navigate('/')
  };

  // Progress steps
  const steps = [
    { number: 1, title: "Personal Info" },
    { number: 2, title: "Academic Info" },
    { number: 3, title: "Account Security" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold text-white">
                Student Registration
              </h1>
              <p className="text-blue-100 mt-2">Create your academic account</p>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="px-6 pt-6 items-center w-full justify-around">
            <div className="flex justify-between items-center mb-6">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex flex-col items-center ${
                      index < steps.length - 1 ? "" : ""
                    }`}
                  >
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center border-2 
                      ${
                        currentStep >= step.number
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-gray-300 text-gray-500"
                      }`}
                    >
                      {step.number}
                    </div>
                    <span className="text-xs mt-1 text-gray-600 hidden sm:block">
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 ${
                        currentStep > step.number
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Registration Form */}
          <div className="p-6">
            {apiError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                            errors.fullName
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Student ID */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Student ID *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaIdCard className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="studentId"
                          value={formData.studentId}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                            errors.studentId
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="STU123456"
                        />
                      </div>
                      {errors.studentId && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.studentId}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Email *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <HiOutlineMail className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="your@email.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                            errors.phone ? "border-red-500" : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="+1 (123) 456-7890"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Date of Birth *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaBirthdayCake className="text-gray-400" />
                        </div>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                            errors.dob ? "border-red-500" : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                      </div>
                      {errors.dob && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.dob}
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaMapMarkerAlt className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your address"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 shadow-md"
                    >
                      Next
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Academic Information */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* University */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        University *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUniversity className="text-gray-400" />
                        </div>
                        <select
                          name="university"
                          value={formData.university}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                            errors.university
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none`}
                        >
                          <option value="">Select University</option>
                          {universities.map((uni, index) => (
                            <option key={index} value={uni}>
                              {uni}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.university && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.university}
                        </p>
                      )}
                    </div>

                    {/* Faculty */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Faculty *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaGraduationCap className="text-gray-400" />
                        </div>
                        <select
                          name="faculty"
                          value={formData.faculty}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                            errors.faculty
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none`}
                        >
                          <option value="">Select Faculty</option>
                          {faculties.map((faculty, index) => (
                            <option key={index} value={faculty}>
                              {faculty}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.faculty && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.faculty}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Department */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Department *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaBook className="text-gray-400" />
                        </div>
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                            errors.department
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none`}
                        >
                          <option value="">Select Department</option>
                          {departments.map((dept, index) => (
                            <option key={index} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.department && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.department}
                        </p>
                      )}
                    </div>

                    {/* Program */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Program *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaGraduationCap className="text-gray-400" />
                        </div>
                        <select
                          name="program"
                          value={formData.program}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                            errors.program
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none`}
                        >
                          <option value="">Select Program</option>
                          {programs.map((program, index) => (
                            <option key={index} value={program}>
                              {program}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.program && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.program}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Semester */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Semester *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaBook className="text-gray-400" />
                        </div>
                        <select
                          name="semester"
                          value={formData.semester}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                            errors.semester
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none`}
                        >
                          <option value="">Select Semester</option>
                          {semesters.map((sem, index) => (
                            <option key={index} value={sem}>
                              Semester {sem}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.semester && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.semester}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-lg transition duration-200"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 shadow-md"
                    >
                      Next
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Account Security */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Password */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                            errors.password
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="••••••••"
                        />
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.password}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Must be at least 8 characters with uppercase, lowercase,
                        and number
                      </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                            errors.confirmPassword
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="••••••••"
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-lg transition duration-200"
                    >
                      Back
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 shadow-md ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting
                        ? "Registering..."
                        : "Complete Registration"}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </form>

            {/* Already have an account */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-center"
            >
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer focus:outline-none"
                >
                  Sign In
                </button>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
