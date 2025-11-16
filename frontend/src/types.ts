export interface Resume {
  id?: number
  filename: string
  text: string
  skills?: string[]
}

export interface JobDescription {
  id?: number
  title?: string
  text: string
}

export interface MatchResponse {
  score: number
  details?: Record<string, any>
}
