export type BackendStatus = 'checking' | 'connected' | 'failed'

export type ApiEnvelope<T> = {
  code?: number
  message?: string
  data?: T
}

export type AuthUser = {
  sub?: string
  id?: string
  email?: string
  phone?: string
  nickname?: string
}

export type AuthPayload = {
  accessToken: string
  user: AuthUser
  needsAiConfig?: boolean
}

export type LearningPack = {
  id: string
  title: string
  subjectName?: string | null
  studyGoal?: string | null
  status?: string
  masteryRate?: number | string
  updatedAt?: string
  createdAt?: string
}

export type PackMaterial = {
  id: string
  packId: string
  fileName: string
  fileType: string
  fileSize?: string | number
  storageUrl?: string | null
  rawText?: string | null
}

export type PackChapter = {
  id: string
  title: string
  summary?: string | null
  masteryRate?: number | string
}

export type PackKnowledgePoint = {
  id: string
  title: string
  description?: string | null
  tags?: string | null
}

export type PackDetail = {
  pack: LearningPack | null
  materials: PackMaterial[]
  chapters: PackChapter[]
  knowledgePoints: PackKnowledgePoint[]
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://43.139.91.62:3000/api'
const TOKEN_KEY = 'zhijing_access_token'
const USER_KEY = 'zhijing_user'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const isAuthenticated = () => Boolean(getToken())

export const saveSession = (payload: AuthPayload) => {
  if (payload?.accessToken) {
    localStorage.setItem(TOKEN_KEY, payload.accessToken)
  }
  if (payload?.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(payload.user))
  }
}

export const getCurrentUser = () => {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  const token = getToken()

  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  })
  const payload = (await response.json().catch(() => ({}))) as ApiEnvelope<T>

  if (!response.ok || (payload.code !== undefined && payload.code !== 0)) {
    if (response.status === 401) {
      clearSession()
    }
    throw new Error(payload.message ?? '接口请求失败')
  }

  return (payload.data ?? payload) as T
}

export const checkApiHealth = async (): Promise<BackendStatus> => {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), 2500)

  try {
    await fetch(`${API_BASE_URL}/health`, { signal: controller.signal })
    return 'connected'
  } catch {
    return 'failed'
  } finally {
    window.clearTimeout(timer)
  }
}

export const api = {
  login: (body: { account: string; password: string }) =>
    request<AuthPayload>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body: { nickname: string; email?: string; phone?: string; password: string; studyGoal?: string }) =>
    request<AuthPayload>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  getPacks: () => request<LearningPack[]>('/packs'),
  createPack: (body: { title: string; subjectName?: string; studyGoal?: string }) =>
    request<LearningPack>('/packs', { method: 'POST', body: JSON.stringify(body) }),
  addPackMaterial: (id: string, body: { fileName: string; fileType: string; fileSize?: number; storageUrl?: string; rawText?: string }) =>
    request<PackMaterial>(`/packs/${id}/materials`, { method: 'POST', body: JSON.stringify(body) }),
  getPackDetail: (id: string) => request<PackDetail>(`/packs/${id}`),
  parsePack: (id: string) => request<PackDetail>(`/packs/${id}/parse`, { method: 'POST' }),
  askAi: (body: { packId: string; chapterId?: string; question: string }) =>
    request<any>('/ai/qa', { method: 'POST', body: JSON.stringify(body) }),
  getQuestions: (packId: string, chapterId?: string) =>
    request<any[]>(`/practice/questions?packId=${packId}${chapterId ? `&chapterId=${chapterId}` : ''}`),
  getTasks: () => request<any[]>('/tasks'),
  createTask: (body: { title: string; targetValue?: number; deadlineAt?: string; packId?: string; chapterId?: string }) =>
    request<any>('/tasks', { method: 'POST', body: JSON.stringify(body) }),
  completeTask: (id: string) => request<any>(`/tasks/${id}/complete`, { method: 'PUT', body: JSON.stringify({}) }),
  getWrongBook: () => request<any[]>('/wrong-book'),
  getWrongQuestion: (id: string) => request<any>(`/wrong-book/${id}`),
  updateWrongQuestionStatus: (id: string, status: string) =>
    request<any>(`/wrong-book/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  getFlashcards: (packId: string) => request<any[]>(`/flashcards?packId=${packId}`),
  createFlashcard: (body: { packId: string; chapterId?: string; type?: string; frontText: string; backText: string }) =>
    request<any>('/flashcards', { method: 'POST', body: JSON.stringify(body) }),
  reviewFlashcard: (id: string, rating: string) =>
    request<any>(`/flashcards/${id}/review`, { method: 'POST', body: JSON.stringify({ rating }) }),
  getFocus: () => request<any[]>('/focus'),
  startFocus: (body: { plannedMinutes: number; packId?: string; taskId?: string }) =>
    request<any>('/focus/start', { method: 'POST', body: JSON.stringify(body) }),
  finishFocus: (id: string, body: { actualMinutes: number; note?: string; status?: string }) =>
    request<any>(`/focus/${id}/finish`, { method: 'POST', body: JSON.stringify(body) }),
  getProfile: () => request<any>('/profile'),
  updateProfile: (body: { nickname?: string; bio?: string; studyGoal?: string }) =>
    request<any>('/users/me', { method: 'PUT', body: JSON.stringify(body) }),
  getRanking: () => request<any>('/ranking'),
  getCommunityPosts: () => request<any[]>('/community/posts'),
  getCommunityPost: (id: string) => request<any>(`/community/posts/${id}`),
  createCommunityPost: (body: any) => request<any>('/community/posts', { method: 'POST', body: JSON.stringify(body) }),
  createCommunityComment: (id: string, body: { content: string; parentId?: string }) =>
    request<any>(`/community/posts/${id}/comments`, { method: 'POST', body: JSON.stringify(body) }),
  getTargetPlans: () => request<any[]>('/target-plans'),
  createTargetPlan: (body: any) => request<any>('/target-plans', { method: 'POST', body: JSON.stringify(body) }),
  searchColleges: (query: string) => request<any[]>(`/target-plans/colleges/search?q=${encodeURIComponent(query)}`),
  getLearningReports: () => request<any[]>('/target-plans/reports/history'),
  generateWeeklyReport: () => request<any>('/target-plans/reports/weekly', { method: 'POST', body: JSON.stringify({}) }),
  getAiSettings: () => request<any>('/ai/settings'),
  saveAiSettings: (body: any) => request<any>('/ai/settings', { method: 'PUT', body: JSON.stringify(body) }),
  testAiSettings: (body: any) => request<any>('/ai/settings/test', { method: 'POST', body: JSON.stringify(body) }),
}
