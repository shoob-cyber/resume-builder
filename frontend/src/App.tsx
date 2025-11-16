import React, { useState } from 'react'
import ResumeForm from './components/ResumeForm'
import ResumePreview from './components/ResumePreview'
import ResumeList from './components/ResumeList'
import ATSAnalyzer from './components/ATSAnalyzer'
import { Resume } from './types'

export default function App() {
  const [currentResume, setCurrentResume] = useState<Resume | null>(null)
  const [view, setView] = useState<'list' | 'create' | 'edit' | 'ats'>('list')

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Resume Builder</h1>
        <div>
          <button onClick={() => setView('ats')} className="px-3 py-1 bg-gray-100 rounded">ATS Analyzer</button>
        </div>
      </header>

      {view === 'list' && <ResumeList resumes={[]} onSelect={(r) => { setCurrentResume(r); setView('edit') }} />}
      {(view === 'create' || view === 'edit') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ResumeForm onUploaded={(r) => setCurrentResume(r)} />
          <ResumePreview resume={currentResume} />
        </div>
      )}
      {view === 'ats' && <ATSAnalyzer />}
    </div>
  )
}
