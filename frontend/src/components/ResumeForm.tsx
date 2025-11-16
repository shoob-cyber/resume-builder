import React, { useState } from 'react'
import { Resume } from '../types'

export default function ResumeForm({ onUploaded }: { onUploaded?: (r: Resume) => void }) {
  const [text, setText] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const fake: Resume = { filename: 'inline.txt', text, skills: [] }
    onUploaded?.(fake)
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full p-2 border" rows={10} />
      <button className="px-3 py-1 bg-blue-600 text-white rounded">Upload</button>
    </form>
  )
}
