import React, { useState, useEffect } from 'react'
import { Resume } from '../types'
import { analyzeResume, uploadResume } from '../services/apiClient'

type PersonalInfo = {
  fullName: string
  email: string
  phone?: string
  address?: string
  linkedin?: string
  website?: string
}

type Experience = { company: string; position: string; startDate?: string; endDate?: string; current?: boolean; description?: string }
type Education = { institution: string; degree?: string; field?: string; startDate?: string; endDate?: string; gpa?: string }

type FormState = {
  personalInfo: PersonalInfo
  summary: string
  experience: Experience[]
  education: Education[]
  skills: string[]
  projects: any[]
  certifications: any[]
}

export default function ResumeForm({ initialData, onSave, isEdit, onUploaded }: { initialData?: any; onSave?: () => void; isEdit?: boolean; onUploaded?: (r: Resume) => void }) {
  const [formData, setFormData] = useState<FormState>({
    personalInfo: { fullName: '', email: '', phone: '', address: '', linkedin: '', website: '' },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initialData) {
      // lightweight merge
      setFormData((prev) => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, personalInfo: { ...prev.personalInfo, [name]: value } }))
  }

  const handleArrayAdd = (field: keyof FormState) => {
    if (field === 'skills') {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, ''] }))
      return
    }
    const templates: any = {
      experience: { company: '', position: '', startDate: '', endDate: '', current: false, description: '' },
      education: { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' },
      projects: { name: '', description: '', technologies: [], link: '' },
      certifications: { name: '', issuer: '', date: '' },
    }
    setFormData((prev) => ({ ...prev, [field]: [...(prev[field] as any), templates[field]] }))
  }

  const handleArrayChange = (field: keyof FormState, index: number, key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as any).map((item: any, i: number) => (i === index ? (typeof item === 'string' ? value : { ...item, [key]: value }) : item)),
    }))
  }

  const handleSkillChange = (index: number, value: string) => {
    setFormData((prev) => ({ ...prev, skills: prev.skills.map((s, i) => (i === index ? value : s)) }))
  }

  const handleArrayRemove = (field: keyof FormState, index: number) => {
    setFormData((prev) => ({ ...prev, [field]: (prev[field] as any).filter((_: any, i: number) => i !== index) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const cleanedData = {
        ...formData,
        skills: formData.skills.map((s) => s.trim()).filter(Boolean),
      }
      // send as plain text for now (server parses with LLM to extract skills)
      const text = JSON.stringify(cleanedData)
      const res = await analyzeResume({ filename: formData.personalInfo.fullName || 'resume', text, skills: cleanedData.skills })
      // notify parent with returned Resume
      onUploaded?.(res)
      setTimeout(() => {
        setSaving(false)
        onSave?.()
      }, 500)
    } catch (err) {
      console.error(err)
      alert(String(err))
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Personal Information</h3>
        <div className="grid grid-cols-1 gap-2">
          <input name="fullName" placeholder="Full Name" value={formData.personalInfo.fullName} onChange={handlePersonalInfoChange} className="p-2 border" />
          <input name="email" placeholder="Email" value={formData.personalInfo.email} onChange={handlePersonalInfoChange} className="p-2 border" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Summary</h3>
        <textarea value={formData.summary} onChange={(e) => setFormData((p) => ({ ...p, summary: e.target.value }))} rows={4} className="w-full p-2 border" />
      </div>

      <div>
        <h3 className="text-lg font-semibold">Skills</h3>
        <div>
          {formData.skills.map((s, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={s} onChange={(e) => handleSkillChange(i, e.target.value)} className="p-2 border flex-1" />
              <button type="button" onClick={() => handleArrayRemove('skills', i)} className="px-2 bg-red-500 text-white rounded">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => handleArrayAdd('skills')} className="px-3 py-1 bg-blue-600 text-white rounded">Add Skill</button>
        </div>
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded">{saving ? 'Saving...' : isEdit ? 'Save' : 'Create'}</button>
      </div>
    </form>
  )
}
