import React, { useState } from 'react'
import { score } from '../services/apiClient'

export default function ATSAnalyzer() {
  const [jobText, setJobText] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [result, setResult] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  const onMatch = async () => {
    setLoading(true)
    try {
      const res = await score({ resume_text: resumeText, job_description: jobText })
      setResult(res)
    } catch (err: any) {
      alert('Error: ' + (err?.message || String(err)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">ATS Analyzer</h2>
      <textarea placeholder="Job description" value={jobText} onChange={(e) => setJobText(e.target.value)} className="w-full p-2 border mb-2" rows={6} />
      <textarea placeholder="Resume text" value={resumeText} onChange={(e) => setResumeText(e.target.value)} className="w-full p-2 border mb-2" rows={6} />
      <button onClick={onMatch} disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded">{loading ? 'Checking…' : 'Check Match'}</button>
      {result && (
        <div className="mt-4 p-3 border rounded bg-white">
          <div><strong>ATS Score:</strong> {result.atsScore}</div>
          <div><strong>Keyword Match:</strong> {result.keywordMatch}%</div>
          <div><strong>Present Sections:</strong> {result.presentSections?.join(', ')}</div>
          <div className="mt-2"><strong>Suggestions:</strong>
            <ul className="list-disc ml-6 mt-1">
              {(result.suggestions || []).map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
