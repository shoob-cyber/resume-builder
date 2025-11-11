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
      projects: { name: '', description: '', technologies: [], link: '' },
      certifications: { name: '', issuer: '', date: '' },
    };
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], templates[field]]
    }));
  };

  const handleArrayChange = (field, index, key, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? { ...item, [key]: value } : item
      )
    }));
  };

  const handleArrayRemove = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSkillsChange = (value) => {
    setFormData(prev => ({
      ...prev,
      skills: value.split(',').map(s => s.trim()).filter(s => s)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await axios.put(`${API_URL}/${initialData._id}`, formData);
      } else {
        await axios.post(API_URL, formData);
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
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
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
            className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
              activeSection === section.id
                ? 'gradient-primary text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="mr-2">{section.icon}</span>
            {section.label}
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

          {/* Experience */}
          {activeSection === 'experience' && (
            <motion.section
              key="experience"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span>💼</span> Experience
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(16, 185, 129, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handleArrayAdd('experience')}
                  className="px-4 py-2 gradient-secondary text-white rounded-xl font-medium shadow-lg text-sm flex items-center gap-2"
                >
                  <span>+</span> Add Experience
                </motion.button>
              </div>
              <AnimatePresence>
                {formData.experience.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-2 border-gray-200 p-5 rounded-2xl mb-4 space-y-3 bg-white hover:border-blue-300 transition-all duration-300"
                  >
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="text"
                      placeholder="Position"
                      value={exp.position}
                      onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="month"
                        placeholder="Start Date"
                        value={exp.startDate}
                        onChange={(e) => handleArrayChange('experience', index, 'startDate', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <input
                        type="month"
                        placeholder="End Date"
                        value={exp.endDate}
                        onChange={(e) => handleArrayChange('experience', index, 'endDate', e.target.value)}
                        disabled={exp.current}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => handleArrayChange('experience', index, 'current', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Currently working here</span>
                    </label>
                    <textarea
                      placeholder="Job Description"
                      value={exp.description}
                      onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: "#ef4444" }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => handleArrayRemove('experience', index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-xl font-medium shadow-lg hover:shadow-red-500/50 text-sm w-full"
                    >
                      Remove
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.section>
          )}

          {/* Education */}
          {activeSection === 'education' && (
            <motion.section
              key="education"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span>🎓</span> Education
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handleArrayAdd('education')}
                  className="px-4 py-2 gradient-secondary text-white rounded-xl font-medium shadow-lg text-sm"
                >
                  + Add Education
                </motion.button>
              </div>
              <AnimatePresence>
                {formData.education.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-2 border-gray-200 p-5 rounded-2xl mb-4 space-y-3 bg-white hover:border-blue-300 transition-all duration-300"
                  >
                    <input
                      type="text"
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Field of Study"
                      value={edu.field}
                      onChange={(e) => handleArrayChange('education', index, 'field', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="month"
                        placeholder="Start Date"
                        value={edu.startDate}
                        onChange={(e) => handleArrayChange('education', index, 'startDate', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <input
                        type="month"
                        placeholder="End Date"
                        value={edu.endDate}
                        onChange={(e) => handleArrayChange('education', index, 'endDate', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <input
                        type="text"
                        placeholder="GPA"
                        value={edu.gpa}
                        onChange={(e) => handleArrayChange('education', index, 'gpa', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: "#ef4444" }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => handleArrayRemove('education', index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-xl font-medium shadow-lg hover:shadow-red-500/50 text-sm w-full"
                    >
                      Remove
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.section>
          )}

          {/* Skills */}
          {activeSection === 'skills' && (
            <motion.section
              key="skills"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>⚡</span> Skills
              </h3>
              <motion.textarea
                whileFocus={{ scale: 1.02 }}
                placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
                value={formData.skills.join(', ')}
                onChange={(e) => handleSkillsChange(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-300 bg-white"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.skills.map((skill, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className="px-3 py-1 gradient-primary text-white rounded-full text-sm font-medium shadow-lg"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
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
