import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ResumePreview = ({ resume }) => {
  if (!resume) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass rounded-3xl shadow-2xl p-12 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-32 h-32 mx-auto mb-6 rounded-3xl gradient-primary flex items-center justify-center shadow-glow"
          >
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Live Preview</h3>
          <p className="text-gray-600">Your resume will appear here as you type</p>
        </div>
      </motion.div>
    );
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass rounded-3xl shadow-2xl p-8 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div
          variants={sectionVariants}
          className="text-center pb-6 border-b-2 border-gradient-to-r from-blue-500 to-purple-600"
        >
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-bold text-gradient mb-3"
          >
            {resume.personalInfo.fullName}
          </motion.h1>
          <div className="mt-3 text-sm text-gray-600 space-y-2">
            {resume.personalInfo.email && (
              <motion.p
                variants={sectionVariants}
                className="flex items-center justify-center gap-2"
              >
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">📧</span>
                {resume.personalInfo.email}
              </motion.p>
            )}
            {resume.personalInfo.phone && (
              <motion.p
                variants={sectionVariants}
                className="flex items-center justify-center gap-2"
              >
                <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">📱</span>
                {resume.personalInfo.phone}
              </motion.p>
            )}
            {resume.personalInfo.address && (
              <motion.p
                variants={sectionVariants}
                className="flex items-center justify-center gap-2"
              >
                <span className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">📍</span>
                {resume.personalInfo.address}
              </motion.p>
            )}
            <div className="flex justify-center gap-4 mt-3">
              {resume.personalInfo.linkedin && (
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  href={resume.personalInfo.linkedin}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  LinkedIn
                </motion.a>
              )}
              {resume.personalInfo.website && (
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  href={resume.personalInfo.website}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                >
                  Website
                </motion.a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Summary */}
        {resume.summary && (
          <motion.div variants={sectionVariants}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📝</span>
              <h2 className="text-xl font-bold text-gray-900">Professional Summary</h2>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-700 text-sm leading-relaxed p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl"
            >
              {resume.summary}
            </motion.p>
          </motion.div>
        )}

        {/* Experience */}
        {resume.experience && resume.experience.length > 0 && (
          <motion.div variants={sectionVariants}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💼</span>
              <h2 className="text-xl font-bold text-gray-900">Experience</h2>
            </div>
            <AnimatePresence>
              {resume.experience.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="mb-5 p-4 rounded-xl bg-white border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{exp.position}</h3>
                      <p className="text-gray-700 font-medium">{exp.company}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold whitespace-nowrap">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="mt-2 text-sm text-gray-700 leading-relaxed">{exp.description}</p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <motion.div variants={sectionVariants}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎓</span>
              <h2 className="text-xl font-bold text-gray-900">Education</h2>
            </div>
            <AnimatePresence>
              {resume.education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="mb-4 p-4 rounded-xl bg-white border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{edu.degree} in {edu.field}</h3>
                      <p className="text-gray-700">{edu.institution}</p>
                    </div>
                    <span className="text-sm text-gray-600 whitespace-nowrap">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  {edu.gpa && (
                    <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg font-semibold">
                        GPA: {edu.gpa}
                      </span>
                    </p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <motion.div variants={sectionVariants}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⚡</span>
              <h2 className="text-xl font-bold text-gray-900">Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="px-4 py-2 gradient-primary text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-glow transition-all duration-300"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <motion.div variants={sectionVariants}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📁</span>
              <h2 className="text-xl font-bold text-gray-900">Projects</h2>
            </div>
            <AnimatePresence>
              {resume.projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="mb-4 p-4 rounded-xl bg-white border-l-4 border-green-500 hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="font-bold text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                  {project.link && (
                    <a href={project.link} className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                      View Project
                    </a>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Certifications */}
        {resume.certifications && resume.certifications.length > 0 && (
          <motion.div variants={sectionVariants}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📜</span>
              <h2 className="text-xl font-bold text-gray-900">Certifications</h2>
            </div>
            <AnimatePresence>
              {resume.certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="mb-2 p-4 rounded-xl bg-white border-l-4 border-red-500 hover:shadow-lg transition-all duration-300"
                >
                  <p className="font-semibold text-gray-900">{cert.name}</p>
                  <p className="text-sm text-gray-700">{cert.issuer} - {cert.date}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>

      {/* Download Button */}
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        className="w-full mt-8 px-6 py-4 gradient-secondary text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>Download PDF</span>
      </motion.button>
    </motion.div>
  );
};

export default ResumePreview;
