import React, { useState } from 'react'

export default function ATSAnalyzer() {
  const [jobText, setJobText] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [score, setScore] = useState<number | null>(null)

  const onMatch = () => {
    // placeholder similarity: fraction of shared words
    const a = new Set(resumeText.split(/\W+/).filter(Boolean))
    const b = new Set(jobText.split(/\W+/).filter(Boolean))
    const intersect = [...a].filter(x => b.has(x)).length
    const denom = Math.max(a.size, b.size, 1)
    setScore(intersect / denom)
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">ATS Analyzer</h2>
      <textarea placeholder="Job description" value={jobText} onChange={(e) => setJobText(e.target.value)} className="w-full p-2 border mb-2" rows={6} />
      <textarea placeholder="Resume text" value={resumeText} onChange={(e) => setResumeText(e.target.value)} className="w-full p-2 border mb-2" rows={6} />
      <button onClick={onMatch} className="px-3 py-1 bg-blue-600 text-white rounded">Check Match</button>
      {score != null && <div className="mt-2">Score: {score.toFixed(3)}</div>}
    </div>
  )
}
