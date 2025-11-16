import React from 'react'
import { Resume } from '../types'

export default function ResumePreview({ resume }: { resume: Resume | null }) {
  if (!resume) return <div>No resume selected</div>
  return (
    <div>
      <h3 className="text-lg font-semibold">{resume.filename}</h3>
      <pre className="whitespace-pre-wrap">{resume.text}</pre>
    </div>
  )
}
