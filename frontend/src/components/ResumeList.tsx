import React from 'react'
import { Resume } from '../types'

export default function ResumeList({ resumes, onSelect }: { resumes: Resume[]; onSelect?: (r: Resume) => void }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Resumes</h2>
      <ul>
        {resumes.map((r) => (
          <li key={r.filename}>
            <button onClick={() => onSelect?.(r)} className="text-blue-600">{r.filename}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
