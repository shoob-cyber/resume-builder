import { Resume, JobDescription, MatchResponse } from '../types'

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init)
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()) as T
}

export const uploadResume = async (file: File): Promise<Resume> => {
  const fd = new FormData()
  fd.append('file', file)
  return request<Resume>('/resume/upload', { method: 'POST', body: fd })
}

export const analyzeResume = async (payload: { filename?: string; text: string; skills?: string[] }): Promise<Resume> => {
  return request<Resume>('/resume/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export const listResumes = async (): Promise<Resume[]> => {
  return request<Resume[]>('/resume/list')
}

export const createJob = async (job: { title: string; text: string }): Promise<JobDescription> => {
  return request<JobDescription>('/job/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job),
  })
}

export const listJobs = async (): Promise<JobDescription[]> => {
  return request<JobDescription[]>('/job/list')
}

export const matchByIds = async (resume_id: number, job_id: number): Promise<MatchResponse> => {
  return request<MatchResponse>('/ats/match_ids', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume_id, job_id } as any),
  })
}

export const score = async (payload: { resume_text: string; job_description: string }): Promise<any> => {
  return request<any>('/ats/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}
