import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/resumes';

const ResumeForm = ({ initialData, onSave, isEdit }) => {
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      website: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  });

  const [activeSection, setActiveSection] = useState('personal');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value }
    }));
  };

  const handleArrayAdd = (field) => {
    const templates = {
      experience: { company: '', position: '', startDate: '', endDate: '', current: false, description: '' },
      education: { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' },
      skills: '',
      projects: { name: '', description: '', technologies: [], link: '' },
      certifications: { name: '', issuer: '', date: '' },
    };
    
    if (field === 'skills') {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, '']
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], templates[field]]
      }));
    }
  };

  const handleArrayChange = (field, index, key, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? (typeof item === 'string' ? value : { ...item, [key]: value }) : item
      )
    }));
  };

  const handleSkillChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill)
    }));
  };

  const handleArrayRemove = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const cleanedData = {
        ...formData,
        skills: formData.skills.filter(s => s.trim() !== '')
      };
      
      if (isEdit) {
        await axios.put(`${API_URL}/${initialData._id}`, cleanedData);
      } else {
        await axios.post(API_URL, cleanedData);
      }
      setTimeout(() => {
        setSaving(false);
        onSave();
      }, 1000);
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Error saving resume. Please try again.');
      setSaving(false);
    }
  };

  const sections = [
    { id: 'personal', label: 'Personal', icon: '👤' },
    { id: 'summary', label: 'Summary', icon: '📝' },
    { id: 'experience', label: 'Experience', icon: '💼', count: formData.experience.length },
    { id: 'education', label: 'Education', icon: '🎓', count: formData.education.length },
    { id: 'skills', label: 'Skills', icon: '⚡', count: formData.skills.length },
  ];

  const personalFields = [
    { name: 'fullName', placeholder: 'Full Name *', type: 'text', required: true },
    { name: 'email', placeholder: 'Email *', type: 'email', required: true },
    { name: 'phone', placeholder: 'Phone', type: 'tel' },
    { name: 'address', placeholder: 'Address', type: 'text' },
    { name: 'linkedin', placeholder: 'LinkedIn URL', type: 'url' },
    { name: 'website', placeholder: 'Website', type: 'url' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass rounded-3xl shadow-2xl p-8 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{isEdit ? 'Edit Resume' : 'Create Resume'}</h2>
          <p className="text-sm text-gray-600">Fill in your information below</p>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {sections.map((section) => (
          <motion.button
            key={section.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-300 relative ${
              activeSection === section.id
                ? 'gradient-primary text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="mr-2">{section.icon}</span>
            {section.label}
            {section.count > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeSection === section.id
                    ? 'bg-white/30 text-white'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {section.count}
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {/* Personal Information */}
          {activeSection === 'personal' && (
            <motion.section
              key="personal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>👤</span> Personal Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {personalFields.map((field, index) => (
                  <motion.div
                    key={field.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.input
                      whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData.personalInfo[field.name]}
                      onChange={handlePersonalInfoChange}
                      required={field.required}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-300 bg-white hover:border-gray-300"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Professional Summary */}
          {activeSection === 'summary' && (
            <motion.section
              key="summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📝</span> Professional Summary
              </h3>
              <motion.textarea
                whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
                placeholder="Brief summary of your professional background and key achievements..."
                value={formData.summary}
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                rows="6"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-300 bg-white hover:border-gray-300 resize-none"
              />
            </motion.section>
          )}

          {/* Experience Section */}
          {activeSection === 'experience' && (
            <motion.section
              key="experience"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span>💼</span> Work Experience
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.experience.length === 0 
                      ? 'Add your work experience' 
                      : `${formData.experience.length} ${formData.experience.length === 1 ? 'entry' : 'entries'}`}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handleArrayAdd('experience')}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg text-sm flex items-center gap-2 hover:from-emerald-600 hover:to-teal-700 transition-all duration-300"
                >
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: [0, 90, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </motion.svg>
                  Add Experience
                </motion.button>
              </div>
              
              <AnimatePresence>
                {formData.experience.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass rounded-2xl p-8 text-center border-2 border-dashed border-gray-300"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 flex items-center justify-center">
                      <span className="text-3xl">💼</span>
                    </div>
                    <p className="text-gray-600 mb-2">No experience added yet</p>
                    <p className="text-sm text-gray-500">Click the "+ Add Experience" button to get started</p>
                  </motion.div>
                ) : (
                  formData.experience.map((exp, index) => (
                    <motion.div
                      key={index}
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -100, scale: 0.8 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ y: -4 }}
                      className="glass border-2 border-gray-200 p-6 rounded-2xl mb-4 space-y-4 hover:border-blue-300 hover:shadow-xl transition-all duration-300 relative group"
                    >
                      {/* Card Number Badge */}
                      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {index + 1}
                      </div>

                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="text"
                        placeholder="Company Name *"
                        value={exp.company}
                        onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all bg-white"
                      />
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="text"
                        placeholder="Job Position *"
                        value={exp.position}
                        onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all bg-white"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="month"
                          placeholder="Start Date"
                          value={exp.startDate}
                          onChange={(e) => handleArrayChange('experience', index, 'startDate', e.target.value)}
                          className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all bg-white"
                        />
                        <input
                          type="month"
                          placeholder="End Date"
                          value={exp.endDate}
                          onChange={(e) => handleArrayChange('experience', index, 'endDate', e.target.value)}
                          disabled={exp.current}
                          className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all bg-white disabled:bg-gray-100"
                        />
                      </div>
                      <label className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => handleArrayChange('experience', index, 'current', e.target.checked)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Currently working here</span>
                      </label>
                      <textarea
                        placeholder="Describe your role, achievements, and responsibilities..."
                        value={exp.description}
                        onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                        rows="4"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all bg-white resize-none"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "#dc2626" }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => handleArrayRemove('experience', index)}
                        className="w-full px-4 py-3 bg-red-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-red-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove Entry
                      </motion.button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </motion.section>
          )}

          {/* Education Section */}
          {activeSection === 'education' && (
            <motion.section
              key="education"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span>🎓</span> Education
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.education.length === 0 
                      ? 'Add your educational background' 
                      : `${formData.education.length} ${formData.education.length === 1 ? 'entry' : 'entries'}`}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(139, 92, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handleArrayAdd('education')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg text-sm flex items-center gap-2 hover:from-purple-600 hover:to-indigo-700 transition-all duration-300"
                >
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: [0, 90, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </motion.svg>
                  Add Education
                </motion.button>
              </div>
              
              <AnimatePresence>
                {formData.education.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass rounded-2xl p-8 text-center border-2 border-dashed border-gray-300"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center">
                      <span className="text-3xl">🎓</span>
                    </div>
                    <p className="text-gray-600 mb-2">No education added yet</p>
                    <p className="text-sm text-gray-500">Click the "+ Add Education" button to get started</p>
                  </motion.div>
                ) : (
                  formData.education.map((edu, index) => (
                    <motion.div
                      key={index}
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -100, scale: 0.8 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ y: -4 }}
                      className="glass border-2 border-gray-200 p-6 rounded-2xl mb-4 space-y-4 hover:border-purple-300 hover:shadow-xl transition-all duration-300 relative group"
                    >
                      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {index + 1}
                      </div>

                      <input
                        type="text"
                        placeholder="Institution Name *"
                        value={edu.institution}
                        onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-all bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Degree *"
                        value={edu.degree}
                        onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-all bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Field of Study"
                        value={edu.field}
                        onChange={(e) => handleArrayChange('education', index, 'field', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-all bg-white"
                      />
                      <div className="grid grid-cols-3 gap-3">
                        <input
                          type="month"
                          placeholder="Start Date"
                          value={edu.startDate}
                          onChange={(e) => handleArrayChange('education', index, 'startDate', e.target.value)}
                          className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-all bg-white"
                        />
                        <input
                          type="month"
                          placeholder="End Date"
                          value={edu.endDate}
                          onChange={(e) => handleArrayChange('education', index, 'endDate', e.target.value)}
                          className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-all bg-white"
                        />
                        <input
                          type="text"
                          placeholder="GPA"
                          value={edu.gpa}
                          onChange={(e) => handleArrayChange('education', index, 'gpa', e.target.value)}
                          className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-all bg-white"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "#dc2626" }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => handleArrayRemove('education', index)}
                        className="w-full px-4 py-3 bg-red-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-red-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove Entry
                      </motion.button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </motion.section>
          )}

          {/* Skills Section */}
          {activeSection === 'skills' && (
            <motion.section
              key="skills"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span>⚡</span> Skills & Expertise
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.skills.length === 0 
                      ? 'Add your skills' 
                      : `${formData.skills.filter(s => s.trim()).length} ${formData.skills.filter(s => s.trim()).length === 1 ? 'skill' : 'skills'}`}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(234, 179, 8, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handleArrayAdd('skills')}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg text-sm flex items-center gap-2 hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
                >
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: [0, 90, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </motion.svg>
                  Add Skill
                </motion.button>
              </div>

              <AnimatePresence>
                {formData.skills.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass rounded-2xl p-8 text-center border-2 border-dashed border-gray-300"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 flex items-center justify-center">
                      <span className="text-3xl">⚡</span>
                    </div>
                    <p className="text-gray-600 mb-2">No skills added yet</p>
                    <p className="text-sm text-gray-500">Click the "+ Add Skill" button to get started</p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formData.skills.map((skill, index) => (
                      <motion.div
                        key={index}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        whileHover={{ scale: 1.02 }}
                        className="glass rounded-xl p-3 flex items-center gap-3 border-2 border-gray-200 hover:border-yellow-300 transition-all group"
                      >
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type="text"
                          placeholder={`Skill ${index + 1}`}
                          value={skill}
                          onChange={(e) => handleSkillChange(index, e.target.value)}
                          className="flex-1 px-3 py-2 border-0 bg-transparent focus:ring-0 font-medium"
                        />
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => handleArrayRemove('skills', index)}
                          className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>

              {/* Live Preview of Skills */}
              {formData.skills.filter(s => s.trim()).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl"
                >
                  <p className="text-sm font-semibold text-gray-700 mb-3">Preview:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.filter(s => s.trim()).map((skill, index) => (
                      <motion.span
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-sm font-semibold shadow-lg"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={saving}
          className="w-full px-8 py-4 gradient-primary text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group"
        >
          {saving ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>{isEdit ? 'Update Resume' : 'Create Resume'}</span>
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </motion.svg>
            </>
          )}
          <div className="absolute inset-0 animate-shimmer" />
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ResumeForm;
