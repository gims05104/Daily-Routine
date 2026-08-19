import { useState, useEffect, useRef } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'

function useLocalStorage<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
  }, [key, value])
  return [value, setValue]
}

/* ─── Types ─────────────────────────────────────────────── */

type Routine = {
  id: string
  title: string
  duration: string
  time: string
  done: boolean
  category: 'morning' | 'afternoon' | 'evening'
  icon: string
}

type Job = {
  id: string
  company: string
  role: string
  url: string
  deadline: string
  stack: string[]
  status: '관심' | '지원예정' | '지원완료' | '서류통과' | '최종합격' | '불합격'
  notes: string
  fit: 1 | 2 | 3 | 4 | 5
  addedAt: string
}

type CalEvent = {
  id: string
  date: string
  title: string
  time: string
  category: '일정' | '스터디' | '채용' | '기타'
  color?: string
}

type LogEntry = {
  id: string
  date: string
  category: '공부' | '프로젝트' | '독서' | '기타'
  title: string
  body: string
  url: string
  tags: string[]
}

type Retro = {
  id: string
  date: string
  priority: string
  didToday: string
  learned: string
  regret: string
  tomorrowGoal: string
  diary: string
}

/* ─── Initial data (DB에 아직 아무것도 없을 때 보여줄 기본값) ──── */

const initialRoutines: Routine[] = [
  { id: '1', title: '기상 & 스트레칭', duration: '10분', time: '06:30', done: false, category: 'morning', icon: '☀️' },
  { id: '2', title: '명상', duration: '15분', time: '06:45', done: false, category: 'morning', icon: '🧘' },
  { id: '3', title: '아침 식사', duration: '20분', time: '07:30', done: false, category: 'morning', icon: '🥗' },
  { id: '4', title: '독서', duration: '30분', time: '08:00', done: false, category: 'morning', icon: '📖' },
  { id: '5', title: '채용공고 분석', duration: '30분', time: '09:00', done: false, category: 'morning', icon: '🔍' },
  { id: '6', title: '집중 공부', duration: '90분', time: '10:00', done: false, category: 'afternoon', icon: '💻' },
  { id: '7', title: '점심 식사 & 산책', duration: '45분', time: '12:30', done: false, category: 'afternoon', icon: '🚶' },
  { id: '8', title: '운동', duration: '45분', time: '18:00', done: false, category: 'evening', icon: '🏃' },
  { id: '9', title: '일지 작성', duration: '20분', time: '21:00', done: false, category: 'evening', icon: '✍️' },
  { id: '10', title: '독서 & 취침 준비', duration: '30분', time: '22:00', done: false, category: 'evening', icon: '🌙' },
]

const initialJobs: Job[] = [
  {
    id: '1', company: '토스', role: '프론트엔드 엔지니어', url: '',
    deadline: '2026-08-31', stack: ['React', 'TypeScript', 'Next.js'],
    status: '지원예정', notes: '포트폴리오 정리 후 지원 예정. 서류 마감 확인 필요.', fit: 5, addedAt: '2026-08-15',
  },
  {
    id: '2', company: '카카오', role: '웹 개발자', url: '',
    deadline: '2026-09-05', stack: ['Vue', 'Node.js', 'Java'],
    status: '관심', notes: 'Java 스택 비율 높음. 공부 필요.', fit: 3, addedAt: '2026-08-16',
  },
  {
    id: '3', company: '라인플러스', role: 'FE 개발자', url: '',
    deadline: '2026-08-25', stack: ['React', 'TypeScript', 'GraphQL'],
    status: '지원완료', notes: '서류 제출 완료. 코딩테스트 일정 확인 필요.', fit: 4, addedAt: '2026-08-10',
  },
]

const initialEvents: CalEvent[] = [
  { id: 'e1', date: '2026-08-18', title: '토스 서류 마감', time: '23:59', category: '채용' },
  { id: 'e2', date: '2026-08-20', title: 'React 스터디', time: '20:00', category: '스터디' },
  { id: 'e3', date: '2026-08-25', title: '라인플러스 코딩테스트', time: '14:00', category: '채용' },
  { id: 'e4', date: '2026-08-28', title: '친구 생일', time: '19:00', category: '일정' },
  { id: 'e5', date: '2026-09-01', title: '카카오 서류 마감', time: '23:59', category: '채용' },
  { id: 'e6', date: '2026-09-05', title: 'TypeScript 스터디', time: '20:00', category: '스터디' },
]

const initialLogs: LogEntry[] = [
  {
    id: '1', date: '2026-08-18', category: '공부', title: 'React Query 심화 학습', url: '',
    body: 'useMutation, invalidateQueries 패턴 정리. 낙관적 업데이트 구현 실습함. 서버 상태와 클라이언트 상태 분리 개념이 중요.',
    tags: ['React', 'TanStack Query', '상태관리'],
  },
  {
    id: '2', date: '2026-08-17', category: '프로젝트', title: '포트폴리오 사이트 반응형 작업', url: '',
    body: '모바일 768px 이하 레이아웃 수정. 네비게이션 드로어 구현. 다크모드 토글 추가.',
    tags: ['포트폴리오', 'CSS', 'Tailwind'],
  },
  {
    id: '3', date: '2026-08-16', category: '독서', title: '클린 코드 3-4장', url: '',
    body: '함수는 하나의 일만 해야 한다. 부수 효과를 피하라. 명령과 조회를 분리하라. 오류 코드보다 예외를 사용하라.',
    tags: ['클린코드', '독서'],
  },
]

const initialRetros: Retro[] = [
  {
    id: '1', date: '2026-08-18',
    priority: '이력서 초안 완성하기',
    didToday: '커리어 프로그램 OT 참석, 이력서 커리어 토픽 수강, 직군 맞춤형 취업 전략 원포인트 레슨 수강',
    learned: '맞춤 데일리 루틴 및 채용공고 분석, 회고, 캘린더까지 직접 구현하다 보니 시간이 걸렸지만 노션보다 가볍다는 장점을 알게 됨.',
    regret: '기록 항목이 많아서 매일 다 채우기엔 시간이 부족했음. 우선순위를 정해서 채워야 할 듯.',
    tomorrowGoal: '이력서 1차 초안 완성 후 피드백 받기',
    diary: '오늘은 시작이 반이라는 마음으로 하루를 보냈다.',
  },
]

/* ─── Constants ──────────────────────────────────────────── */

const DAYS_KO = ['일', '월', '화', '수', '목', '금', '토']
const MONTHS_KO = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
const catLabel: Record<string, string> = { morning: '오전', afternoon: '오후', evening: '저녁' }
const catColor: Record<string, string> = { morning: '#E8C17A', afternoon: '#7B9E87', evening: '#8B9EC2' }

const CAL_CAT_COLORS: Record<CalEvent['category'], string> = {
  '일정': '#8B9EC2',
  '스터디': '#7B9E87',
  '채용': '#E8C17A',
  '기타': '#C2A07B',
}

const STATUS_COLORS: Record<Job['status'], string> = {
  '관심': '#D4CFC8',
  '지원예정': '#8B9EC2',
  '지원완료': '#7B9E87',
  '서류통과': '#E8C17A',
  '최종합격': '#4B8B6A',
  '불합격': '#C27B7B',
}

const LOG_CAT_COLORS: Record<LogEntry['category'], string> = {
  '공부': '#7B9E87',
  '프로젝트': '#8B9EC2',
  '독서': '#E8C17A',
  '기타': '#C2A07B',
}

const formatFullDate = (d: string) => {
  const dt = new Date(d)
  return `${dt.getFullYear()}년 ${MONTHS_KO[dt.getMonth()]} ${dt.getDate()}일 (${DAYS_KO[dt.getDay()]})`
}

/* ─── Sub-components ─────────────────────────────────────── */

function ProgressRing({ percent, color }: { percent: number; color: string }) {
  const r = 20, c = 2 * Math.PI * r
  const dash = (percent / 100) * c
  return (
    <svg width="52" height="52" viewBox="0 0 52 52">
      <circle cx="26" cy="26" r={r} fill="none" stroke="#E8E4DE" strokeWidth="3" />
      <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
        transform="rotate(-90 26 26)" style={{ transition: 'stroke-dasharray 0.5s ease' }} />
      <text x="26" y="30" textAnchor="middle" fontSize="11" fontFamily="Inter" fontWeight="600" fill="#1A1816">
        {percent}%
      </text>
    </svg>
  )
}

function FitDots({ value }: { value: number }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: i <= value ? '#7B9E87' : '#E8E4DE' }} />
      ))}
    </div>
  )
}

/** 줄바꿈(Enter)이 항상 입력되고, 내용이 길어지면 높이가 자동으로 늘어나는 텍스트 영역 */
function AutoGrowTextarea({
  value, onChange, placeholder, minRows = 3, style,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  minRows?: number
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  return (
    <textarea
      ref={ref}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      rows={minRows}
      style={{
        width: '100%',
        border: '1px solid #D4CFC8',
        borderRadius: 4,
        padding: '10px 12px',
        fontSize: 13,
        fontFamily: 'Inter, sans-serif',
        color: '#1A1816',
        backgroundColor: '#F5F3EF',
        outline: 'none',
        resize: 'none',
        overflow: 'hidden',
        lineHeight: 1.7,
        boxSizing: 'border-box',
        ...style,
      }}
    />
  )
}

function LinkTag({ url }: { url: string }) {
  if (!url) return null
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#5C7DB8', textDecoration: 'none', border: '1px solid #C9D5EA', backgroundColor: '#EEF2FA', borderRadius: 20, padding: '2px 9px', whiteSpace: 'nowrap' }}>
      🔗 링크 열기
    </a>
  )
}

/* ─── Search ──────────────────────────────────────────────── */

type Page = 'routine' | 'jobs' | 'log' | 'retro' | 'calendar'

type SearchResult = {
  key: string
  page: Page
  typeLabel: string
  title: string
  snippet: string
  jobId?: string
  logId?: string
  retroDate?: string
}

function buildSearchResults(query: string, jobs: Job[], logs: LogEntry[], retros: Retro[]): SearchResult[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const results: SearchResult[] = []

  jobs.forEach(j => {
    const hay = [j.company, j.role, j.notes, j.stack.join(' ')].join(' ').toLowerCase()
    if (hay.includes(q)) {
      results.push({
        key: `job-${j.id}`, page: 'jobs', typeLabel: '채용공고',
        title: `${j.company} · ${j.role}`, snippet: j.notes || j.stack.join(', '),
        jobId: j.id,
      })
    }
  })

  logs.forEach(l => {
    const hay = [l.title, l.body, l.tags.join(' ')].join(' ').toLowerCase()
    if (hay.includes(q)) {
      results.push({
        key: `log-${l.id}`, page: 'log', typeLabel: '일지',
        title: l.title, snippet: l.body,
        logId: l.id,
      })
    }
  })

  retros.forEach(r => {
    const fieldsHay = [r.priority, r.didToday, r.learned, r.regret, r.tomorrowGoal, r.diary]
    const hay = fieldsHay.join(' ').toLowerCase()
    if (hay.includes(q)) {
      const matched = fieldsHay.find(v => v.toLowerCase().includes(q))
      results.push({
        key: `retro-${r.date}`, page: 'retro', typeLabel: '회고록',
        title: formatFullDate(r.date), snippet: matched || '',
        retroDate: r.date,
      })
    }
  })

  return results.slice(0, 20)
}

/* ─── Page: 루틴 ─────────────────────────────────────────── */

function RoutinePage({
  routines, setRoutines,
}: {
  routines: Routine[]
  setRoutines: React.Dispatch<React.SetStateAction<Routine[]>>
}) {
  // 매일 자정 done 초기화 여부는 기기별로만 의미가 있어서 localStorage 그대로 사용
  const [lastResetDate, setLastResetDate] = useLocalStorage<string>('daily-last-reset', '')
  const todayKey = new Date().toISOString().slice(0, 10)
  useEffect(() => {
    if (lastResetDate !== todayKey) {
      setRoutines(rs => rs.map(r => ({ ...r, done: false })))
      setLastResetDate(todayKey)
    }
  }, [todayKey, lastResetDate, setLastResetDate, setRoutines])
  const [activeTab, setActiveTab] = useState<'morning'|'afternoon'|'evening'>('morning')
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newTime, setNewTime] = useState('')
  const [newDuration, setNewDuration] = useState('')

  const toggle = (id: string) => setRoutines(rs => rs.map(r => r.id === id ? { ...r, done: !r.done } : r))
  const filtered = routines.filter(r => r.category === activeTab)
  const done = routines.filter(r => r.done).length
  const pct = routines.length ? Math.round((done / routines.length) * 100) : 0
  const catPct = (cat: 'morning'|'afternoon'|'evening') => {
    const items = routines.filter(r => r.category === cat)
    return items.length ? Math.round((items.filter(r => r.done).length / items.length) * 100) : 0
  }
  const resetForm = () => { setNewTitle(''); setNewTime(''); setNewDuration(''); setShowAdd(false); setEditingId(null) }
  const startEdit = (r: Routine) => {
    setEditingId(r.id); setNewTitle(r.title); setNewTime(r.time === '--:--' ? '' : r.time)
    setNewDuration(r.duration); setShowAdd(true)
  }
  const saveRoutine = () => {
    if (!newTitle.trim()) return
    if (editingId) {
      setRoutines(rs => rs.map(r => r.id === editingId
        ? { ...r, title: newTitle.trim(), time: newTime || '--:--', duration: newDuration || '15분' }
        : r))
    } else {
      setRoutines(rs => [...rs, { id: Date.now().toString(), title: newTitle.trim(), time: newTime || '--:--', duration: newDuration || '15분', done: false, category: activeTab, icon: '⭐' }])
    }
    resetForm()
  }
  const deleteRoutine = (id: string) => {
    setRoutines(rs => rs.filter(r => r.id !== id))
    if (editingId === id) resetForm()
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A746C', fontWeight: 500, marginBottom: 4 }}>오늘의 루틴</div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, fontWeight: 400, color: '#1A1816', margin: 0 }}>Daily Routine</h2>
        </div>
        <ProgressRing percent={pct} color="#7B9E87" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 28 }}>
        {(['morning','afternoon','evening'] as const).map(cat => {
          const items = routines.filter(r => r.category === cat)
          const dc = items.filter(r => r.done).length
          const active = activeTab === cat
          return (
            <button key={cat} onClick={() => setActiveTab(cat)} style={{ background: active ? '#1A1816' : '#FFFFFF', border: `1px solid ${active ? '#1A1816' : '#D4CFC8'}`, borderRadius: 4, padding: '14px 12px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: active ? '#F5F3EF' : '#1A1816' }}>{catLabel[cat]}</span>
                <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: catColor[cat], display: 'block', opacity: active ? 1 : 0.5 }} />
              </div>
              <div style={{ fontSize: 11, color: active ? '#A8A39C' : '#7A746C', marginBottom: 8 }}>{dc}/{items.length}개 완료</div>
              <div style={{ height: 2, backgroundColor: active ? '#2D3B45' : '#E8E4DE', borderRadius: 1, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${catPct(cat)}%`, backgroundColor: catColor[cat], transition: 'width 0.4s ease' }} />
              </div>
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: catColor[activeTab] }} />
          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, color: '#1A1816' }}>{catLabel[activeTab]} 루틴</span>
        </div>
        <button onClick={() => { if (showAdd) { resetForm() } else { setShowAdd(true) } }} style={{ background: 'none', border: '1px solid #D4CFC8', borderRadius: 4, padding: '5px 12px', cursor: 'pointer', fontSize: 12, color: '#7A746C', fontFamily: 'Inter, sans-serif' }}>
          {showAdd ? '취소' : '+ 추가'}
        </button>
      </div>

      {showAdd && (
        <div style={{ background: '#FFFFFF', border: '1px solid #D4CFC8', borderRadius: 4, padding: 18, marginBottom: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 100px', gap: 8, marginBottom: 10 }}>
            {[
              { ph: '루틴 이름', val: newTitle, set: setNewTitle },
              { ph: '07:00', val: newTime, set: setNewTime },
              { ph: '30분', val: newDuration, set: setNewDuration },
            ].map(({ ph, val, set }) => (
              <input key={ph} placeholder={ph} value={val} onChange={e => set(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveRoutine()}
                style={{ border: '1px solid #D4CFC8', borderRadius: 4, padding: '7px 10px', fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#1A1816', backgroundColor: '#F5F3EF', outline: 'none' }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={saveRoutine} style={{ background: '#1A1816', color: '#F5F3EF', border: 'none', borderRadius: 4, padding: '7px 18px', fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 500, cursor: 'pointer' }}>{editingId ? '수정 저장' : '저장'}</button>
            <button onClick={resetForm} style={{ background: 'none', color: '#7A746C', border: '1px solid #D4CFC8', borderRadius: 4, padding: '7px 14px', fontSize: 12, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>취소</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filtered.map(r => (
          <div key={r.id} onClick={() => toggle(r.id)} style={{ display: 'grid', gridTemplateColumns: '22px 32px 1fr auto auto auto auto', alignItems: 'center', gap: 12, background: r.done ? '#F0EDE8' : '#FFFFFF', border: `1px solid ${r.done ? '#D4CFC8' : '#E8E4DE'}`, borderRadius: 4, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s', opacity: r.done ? 0.72 : 1 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${r.done ? catColor[r.category] : '#D4CFC8'}`, backgroundColor: r.done ? catColor[r.category] : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
              {r.done && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </div>
            <span style={{ fontSize: 17, textAlign: 'center' }}>{r.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#1A1816', textDecoration: r.done ? 'line-through' : 'none', fontFamily: 'Inter, sans-serif' }}>{r.title}</span>
            <span style={{ fontSize: 12, color: '#7A746C', fontVariantNumeric: 'tabular-nums' }}>{r.time}</span>
            <span style={{ fontSize: 11, color: '#7A746C', backgroundColor: '#F0EDE8', borderRadius: 2, padding: '2px 7px', whiteSpace: 'nowrap' }}>{r.duration}</span>
            <button onClick={e => { e.stopPropagation(); startEdit(r) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A8A39C', fontSize: 13, padding: 4, lineHeight: 1, flexShrink: 0 }} aria-label="수정">✎</button>
            <button onClick={e => { e.stopPropagation(); deleteRoutine(r.id) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4BCB4', fontSize: 15, padding: 4, lineHeight: 1, flexShrink: 0 }} aria-label="삭제">×</button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#7A746C' }}>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 17, marginBottom: 6 }}>루틴이 없어요</div>
            <div style={{ fontSize: 12 }}>+ 추가로 루틴을 만들어보세요</div>
          </div>
        )}
      </div>
    </>
  )
}

/* ─── Page: 채용공고 ──────────────────────────────────────── */

function JobsPage({
  jobs, setJobs, jumpJob,
}: {
  jobs: Job[]
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>
  jumpJob: { id: string; ts: number } | null
}) {
  const [filterStatus, setFilterStatus] = useState<Job['status'] | '전체'>('전체')
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [form, setForm] = useState({ company: '', role: '', deadline: '', stack: '', url: '', notes: '', fit: 3 as 1|2|3|4|5, status: '관심' as Job['status'] })

  const statuses: Job['status'][] = ['관심','지원예정','지원완료','서류통과','최종합격','불합격']
  const filtered = filterStatus === '전체' ? jobs : jobs.filter(j => j.status === filterStatus)

  useEffect(() => {
    if (!jumpJob) return
    setExpandedId(jumpJob.id)
    const el = document.getElementById(`job-${jumpJob.id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [jumpJob])

  const resetForm = () => { setForm({ company: '', role: '', deadline: '', stack: '', url: '', notes: '', fit: 3, status: '관심' }); setShowAdd(false); setEditingId(null) }

  const startEdit = (job: Job) => {
    setEditingId(job.id)
    setForm({ company: job.company, role: job.role, deadline: job.deadline, stack: job.stack.join(', '), url: job.url, notes: job.notes, fit: job.fit, status: job.status })
    setShowAdd(true)
    setExpandedId(job.id)
  }

  const saveJob = () => {
    if (!form.company.trim() || !form.role.trim()) return
    if (editingId) {
      setJobs(js => js.map(j => j.id === editingId ? {
        ...j,
        company: form.company.trim(),
        role: form.role.trim(),
        deadline: form.deadline,
        stack: form.stack.split(',').map(s => s.trim()).filter(Boolean),
        url: form.url.trim(),
        status: form.status,
        notes: form.notes,
        fit: form.fit,
      } : j))
    } else {
      setJobs(js => [...js, {
        id: Date.now().toString(),
        company: form.company.trim(),
        role: form.role.trim(),
        url: form.url.trim(),
        deadline: form.deadline,
        stack: form.stack.split(',').map(s => s.trim()).filter(Boolean),
        status: form.status,
        notes: form.notes,
        fit: form.fit,
        addedAt: new Date().toISOString().slice(0,10),
      }])
    }
    resetForm()
  }

  const deleteJob = (id: string) => {
    setJobs(js => js.filter(j => j.id !== id))
    if (editingId === id) resetForm()
    if (expandedId === id) setExpandedId(null)
  }

  const updateStatus = (id: string, status: Job['status']) =>
    setJobs(js => js.map(j => j.id === id ? { ...j, status } : j))

  const countByStatus = (s: Job['status']) => jobs.filter(j => j.status === s).length

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A746C', fontWeight: 500, marginBottom: 4 }}>취업 준비</div>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, fontWeight: 400, color: '#1A1816', margin: '0 0 16px' }}>채용공고 분석</h2>

        {/* Kanban summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 4 }}>
          {(['관심','지원예정','지원완료','서류통과','최종합격','불합격'] as Job['status'][]).map(s => (
            <div key={s} style={{ background: '#FFFFFF', border: '1px solid #E8E4DE', borderRadius: 4, padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#7A746C' }}>{s}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1816' }}>{countByStatus(s)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter + Add */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['전체', ...statuses] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, border: '1px solid', borderColor: filterStatus === s ? '#1A1816' : '#D4CFC8', background: filterStatus === s ? '#1A1816' : 'transparent', color: filterStatus === s ? '#F5F3EF' : '#7A746C', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s' }}>
              {s}
            </button>
          ))}
        </div>
        <button onClick={() => { if (showAdd) { resetForm() } else { setShowAdd(true) } }} style={{ background: 'none', border: '1px solid #D4CFC8', borderRadius: 4, padding: '5px 12px', cursor: 'pointer', fontSize: 12, color: '#7A746C', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
          {showAdd && !editingId ? '취소' : '+ 공고 추가'}
        </button>
      </div>

      {showAdd && (
        <div style={{ background: '#FFFFFF', border: '1px solid #D4CFC8', borderRadius: 4, padding: 20, marginBottom: 16 }}>
          {editingId && (
            <div style={{ fontSize: 11, color: '#8B9EC2', fontWeight: 600, marginBottom: 10 }}>공고 수정 중</div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            {[
              { ph: '회사명', key: 'company' as const },
              { ph: '직무 (예: 프론트엔드 개발자)', key: 'role' as const },
              { ph: '마감일 (예: 2026-09-01)', key: 'deadline' as const },
              { ph: '기술스택 (쉼표 구분)', key: 'stack' as const },
            ].map(({ ph, key }) => (
              <input key={key} placeholder={ph} value={form[key] as string}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                style={{ border: '1px solid #D4CFC8', borderRadius: 4, padding: '8px 10px', fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#1A1816', backgroundColor: '#F5F3EF', outline: 'none' }} />
            ))}
          </div>
          <input placeholder="공고 링크 URL (예: https://...)" value={form.url}
            onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
            style={{ width: '100%', border: '1px solid #D4CFC8', borderRadius: 4, padding: '8px 10px', fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#1A1816', backgroundColor: '#F5F3EF', outline: 'none', marginBottom: 10, boxSizing: 'border-box' }} />
          <AutoGrowTextarea
            value={form.notes}
            onChange={v => setForm(f => ({ ...f, notes: v }))}
            placeholder="분석 메모 (요구사항, 준비사항 등)"
            minRows={3}
            style={{ marginBottom: 10 }}
          />
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#7A746C' }}>적합도</span>
              {[1,2,3,4,5].map(i => (
                <button key={i} onClick={() => setForm(f => ({ ...f, fit: i as 1|2|3|4|5 }))}
                  style={{ width: 20, height: 20, borderRadius: '50%', border: 'none', cursor: 'pointer', backgroundColor: i <= form.fit ? '#7B9E87' : '#E8E4DE', transition: 'all 0.15s' }} />
              ))}
            </div>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Job['status'] }))}
              style={{ border: '1px solid #D4CFC8', borderRadius: 4, padding: '6px 10px', fontSize: 12, fontFamily: 'Inter, sans-serif', color: '#1A1816', backgroundColor: '#F5F3EF', outline: 'none', cursor: 'pointer' }}>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={saveJob} style={{ background: '#1A1816', color: '#F5F3EF', border: 'none', borderRadius: 4, padding: '7px 18px', fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 500, cursor: 'pointer' }}>{editingId ? '수정 저장' : '저장'}</button>
            <button onClick={resetForm} style={{ background: 'none', color: '#7A746C', border: '1px solid #D4CFC8', borderRadius: 4, padding: '7px 14px', fontSize: 12, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>취소</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(job => {
          const expanded = expandedId === job.id
          return (
            <div key={job.id} id={`job-${job.id}`} style={{ background: '#FFFFFF', border: '1px solid #E8E4DE', borderRadius: 4, overflow: 'hidden' }}>
              <button onClick={() => setExpandedId(expanded ? null : job.id)}
                style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 12, padding: '16px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, color: '#1A1816' }}>{job.company}</span>
                    <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 12, backgroundColor: STATUS_COLORS[job.status] + '30', color: '#1A1816', border: `1px solid ${STATUS_COLORS[job.status]}60` }}>{job.status}</span>
                    <LinkTag url={job.url} />
                  </div>
                  <div style={{ fontSize: 13, color: '#7A746C', marginBottom: 8 }}>{job.role}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <FitDots value={job.fit} />
                    {job.stack.map(s => (
                      <span key={s} style={{ fontSize: 11, padding: '2px 7px', backgroundColor: '#F0EDE8', borderRadius: 2, color: '#7A746C' }}>{s}</span>
                    ))}
                    {job.deadline && <span style={{ fontSize: 11, color: '#C27B7B', marginLeft: 'auto' }}>마감 {job.deadline}</span>}
                  </div>
                </div>
                <span style={{ color: '#7A746C', fontSize: 12, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
              </button>

              {expanded && (
                <div style={{ padding: '0 18px 18px', borderTop: '1px solid #F0EDE8' }}>
                  <div style={{ paddingTop: 14 }}>
                    <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7A746C', fontWeight: 500, marginBottom: 8 }}>분석 메모</div>
                    <p style={{ fontSize: 13, color: '#1A1816', lineHeight: 1.7, margin: '0 0 14px', whiteSpace: 'pre-wrap' }}>{job.notes || '—'}</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                      {statuses.map(s => (
                        <button key={s} onClick={() => updateStatus(job.id, s)}
                          style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, border: '1px solid', borderColor: job.status === s ? '#1A1816' : '#D4CFC8', background: job.status === s ? '#1A1816' : 'transparent', color: job.status === s ? '#F5F3EF' : '#7A746C', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                          {s}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid #F0EDE8' }}>
                      <button onClick={() => startEdit(job)}
                        style={{ fontSize: 12, color: '#7A746C', background: 'none', border: '1px solid #D4CFC8', borderRadius: 4, padding: '6px 12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>✎ 수정</button>
                      <button onClick={() => deleteJob(job.id)}
                        style={{ fontSize: 12, color: '#C27B7B', background: 'none', border: '1px solid #E8C4C4', borderRadius: 4, padding: '6px 12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>삭제</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#7A746C' }}>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 17, marginBottom: 6 }}>공고가 없어요</div>
            <div style={{ fontSize: 12 }}>+ 공고 추가로 시작해보세요</div>
          </div>
        )}
      </div>
    </>
  )
}

/* ─── Page: 일지 ─────────────────────────────────────────── */

function LogPage({
  logs, setLogs, jumpLog,
}: {
  logs: LogEntry[]
  setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>
  jumpLog: { id: string; ts: number } | null
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterCat, setFilterCat] = useState<LogEntry['category'] | '전체'>('전체')
  const [form, setForm] = useState({ title: '', body: '', url: '', category: '공부' as LogEntry['category'], tags: '' })

  const today = new Date().toISOString().slice(0, 10)
  const filtered = filterCat === '전체' ? logs : logs.filter(l => l.category === filterCat)

  useEffect(() => {
    if (!jumpLog) return
    const el = document.getElementById(`log-${jumpLog.id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [jumpLog])

  const resetForm = () => { setForm({ title: '', body: '', url: '', category: '공부', tags: '' }); setShowAdd(false); setEditingId(null) }

  const startEdit = (log: LogEntry) => {
    setEditingId(log.id)
    setForm({ title: log.title, body: log.body, url: log.url || '', category: log.category, tags: log.tags.join(', ') })
    setShowAdd(true)
  }

  const saveLog = () => {
    if (!form.title.trim()) return
    if (editingId) {
      setLogs(ls => ls.map(l => l.id === editingId ? {
        ...l,
        category: form.category,
        title: form.title.trim(),
        body: form.body.trim(),
        url: form.url.trim(),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      } : l))
    } else {
      setLogs(ls => [{
        id: Date.now().toString(),
        date: today,
        category: form.category,
        title: form.title.trim(),
        body: form.body.trim(),
        url: form.url.trim(),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      }, ...ls])
    }
    resetForm()
  }

  const deleteLog = (id: string) => {
    setLogs(ls => ls.filter(l => l.id !== id))
    if (editingId === id) resetForm()
  }

  const grouped: Record<string, LogEntry[]> = {}
  filtered.forEach(l => { grouped[l.date] = grouped[l.date] ? [...grouped[l.date], l] : [l] })
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A746C', fontWeight: 500, marginBottom: 4 }}>학습 & 활동</div>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, fontWeight: 400, color: '#1A1816', margin: '0 0 4px' }}>일지</h2>
        <p style={{ fontSize: 13, color: '#7A746C', margin: 0 }}>그날의 공부와 활동을 기록하세요.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['전체','공부','프로젝트','독서','기타'] as const).map(c => (
            <button key={c} onClick={() => setFilterCat(c)}
              style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, border: '1px solid', borderColor: filterCat === c ? '#1A1816' : '#D4CFC8', background: filterCat === c ? '#1A1816' : 'transparent', color: filterCat === c ? '#F5F3EF' : '#7A746C', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s' }}>
              {c}
            </button>
          ))}
        </div>
        <button onClick={() => { if (showAdd) { resetForm() } else { setShowAdd(true) } }}
          style={{ background: 'none', border: '1px solid #D4CFC8', borderRadius: 4, padding: '5px 12px', cursor: 'pointer', fontSize: 12, color: '#7A746C', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
          {showAdd ? '취소' : '+ 기록 추가'}
        </button>
      </div>

      {showAdd && (
        <div style={{ background: '#FFFFFF', border: '1px solid #D4CFC8', borderRadius: 4, padding: 20, marginBottom: 16 }}>
          {editingId && (
            <div style={{ fontSize: 11, color: '#8B9EC2', fontWeight: 600, marginBottom: 10 }}>기록 수정 중</div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, marginBottom: 10 }}>
            <input placeholder="제목 (예: TypeScript 제네릭 공부)" value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              style={{ border: '1px solid #D4CFC8', borderRadius: 4, padding: '8px 10px', fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#1A1816', backgroundColor: '#F5F3EF', outline: 'none' }} />
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as LogEntry['category'] }))}
              style={{ border: '1px solid #D4CFC8', borderRadius: 4, padding: '8px 10px', fontSize: 12, fontFamily: 'Inter, sans-serif', color: '#1A1816', backgroundColor: '#F5F3EF', outline: 'none', cursor: 'pointer' }}>
              {(['공부','프로젝트','독서','기타'] as LogEntry['category'][]).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <AutoGrowTextarea
            value={form.body}
            onChange={v => setForm(f => ({ ...f, body: v }))}
            placeholder="오늘 배운 것, 한 일, 느낀 점을 자유롭게 기록하세요."
            minRows={4}
            style={{ marginBottom: 10 }}
          />
          <input placeholder="참고 링크 URL (예: https://...)" value={form.url}
            onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
            style={{ width: '100%', border: '1px solid #D4CFC8', borderRadius: 4, padding: '8px 10px', fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#1A1816', backgroundColor: '#F5F3EF', outline: 'none', marginBottom: 10, boxSizing: 'border-box' }} />
          <input placeholder="태그 (쉼표 구분, 예: React, 알고리즘)" value={form.tags}
            onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
            style={{ width: '100%', border: '1px solid #D4CFC8', borderRadius: 4, padding: '8px 10px', fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#1A1816', backgroundColor: '#F5F3EF', outline: 'none', marginBottom: 12, boxSizing: 'border-box' }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={saveLog} style={{ background: '#1A1816', color: '#F5F3EF', border: 'none', borderRadius: 4, padding: '7px 18px', fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 500, cursor: 'pointer' }}>{editingId ? '수정 저장' : '저장'}</button>
            <button onClick={resetForm} style={{ background: 'none', color: '#7A746C', border: '1px solid #D4CFC8', borderRadius: 4, padding: '7px 14px', fontSize: 12, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>취소</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {sortedDates.map(date => (
          <div key={date}>
            <div style={{ fontSize: 12, color: '#7A746C', fontWeight: 500, marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid #E8E4DE' }}>
              {formatFullDate(date)}
              {date === today && <span style={{ marginLeft: 8, fontSize: 10, backgroundColor: '#7B9E87', color: '#FFF', borderRadius: 10, padding: '2px 7px' }}>오늘</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {grouped[date].map(log => (
                <div key={log.id} id={`log-${log.id}`} style={{ background: '#FFFFFF', border: '1px solid #E8E4DE', borderRadius: 4, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, backgroundColor: LOG_CAT_COLORS[log.category] + '25', color: '#1A1816', border: `1px solid ${LOG_CAT_COLORS[log.category]}50` }}>{log.category}</span>
                      <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, color: '#1A1816' }}>{log.title}</span>
                      <LinkTag url={log.url} />
                    </div>
                    <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                      <button onClick={() => startEdit(log)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A8A39C', fontSize: 13, padding: 4, lineHeight: 1 }} aria-label="수정">✎</button>
                      <button onClick={() => deleteLog(log.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4BCB4', fontSize: 15, padding: 4, lineHeight: 1 }} aria-label="삭제">×</button>
                    </div>
                  </div>
                  {log.body && <p style={{ fontSize: 13, color: '#3D3833', lineHeight: 1.75, margin: '0 0 10px', whiteSpace: 'pre-wrap' }}>{log.body}</p>}
                  {log.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {log.tags.map(t => (
                        <span key={t} style={{ fontSize: 11, padding: '2px 8px', backgroundColor: '#F0EDE8', borderRadius: 2, color: '#7A746C' }}>#{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {sortedDates.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#7A746C' }}>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 17, marginBottom: 6 }}>기록이 없어요</div>
            <div style={{ fontSize: 12 }}>+ 기록 추가로 오늘의 일지를 남겨보세요</div>
          </div>
        )}
      </div>
    </>
  )
}

/* ─── Page: 회고록 ────────────────────────────────────────── */

function RetroPage({
  retros, setRetros, jumpRetro,
}: {
  retros: Retro[]
  setRetros: React.Dispatch<React.SetStateAction<Retro[]>>
  jumpRetro: { date: string; ts: number } | null
}) {
  const today = new Date().toISOString().slice(0, 10)
  const [selectedDate, setSelectedDate] = useState(today)
  const [showList, setShowList] = useState(false)

  useEffect(() => {
    if (!jumpRetro) return
    setSelectedDate(jumpRetro.date)
    setShowList(false)
  }, [jumpRetro])

  const current = retros.find(r => r.date === selectedDate)

  type FieldKey = 'priority' | 'didToday' | 'learned' | 'regret' | 'tomorrowGoal' | 'diary'

  const updateField = (field: FieldKey, value: string) => {
    setRetros(rs => {
      const idx = rs.findIndex(r => r.date === selectedDate)
      if (idx === -1) {
        const blank: Retro = {
          id: Date.now().toString(), date: selectedDate,
          priority: '', didToday: '', learned: '', regret: '', tomorrowGoal: '', diary: '',
        }
        return [...rs, { ...blank, [field]: value }]
      }
      return rs.map(r => r.date === selectedDate ? { ...r, [field]: value } : r)
    })
  }

  const deleteRetro = (date: string) => {
    setRetros(rs => rs.filter(r => r.date !== date))
  }

  const fields: { key: FieldKey; icon: string; label: string; placeholder: string; minRows: number }[] = [
    { key: 'priority', icon: '📌', label: '1. 이번 주 우선 순위', placeholder: '이번 주에 달성할 핵심 지표를 기록하세요.', minRows: 2 },
    { key: 'didToday', icon: '✅', label: '2. 오늘 내가 한 일', placeholder: '오늘 진행한 일들을 자유롭게 기록하세요.', minRows: 3 },
    { key: 'learned', icon: '💡', label: '3. 오늘 배운 점 / 새롭게 알게 된 것', placeholder: '오늘 새로 배운 점을 정리하세요.', minRows: 3 },
    { key: 'regret', icon: '⚠️', label: '4. 아쉬웠던 점 / 내일 더 잘하고 싶은 점', placeholder: '아쉬운 부분을 분석하세요.', minRows: 3 },
    { key: 'tomorrowGoal', icon: '🎯', label: '5. 내일의 목표', placeholder: '내일 최우선으로 진행할 작업을 설정하세요.', minRows: 2 },
    { key: 'diary', icon: '❤️', label: '6. 한 줄 마음 일기', placeholder: '오늘의 감정을 솔직하게 기록하세요.', minRows: 2 },
  ]

  const sortedRetros = retros.slice().sort((a, b) => b.date.localeCompare(a.date))
  const previewOf = (r: Retro) => (r.didToday || r.learned || r.diary || r.priority || '').replace(/\n/g, ' ').slice(0, 44)

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A746C', fontWeight: 500, marginBottom: 4 }}>성장 리포트</div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, fontWeight: 400, color: '#1A1816', margin: 0 }}>회고록</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#7A746C' }}>날짜:</span>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
              style={{ border: '1px solid #D4CFC8', borderRadius: 4, padding: '6px 10px', fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#1A1816', backgroundColor: '#FFFFFF', outline: 'none' }} />
          </div>
          <button onClick={() => setShowList(s => !s)}
            style={{ background: showList ? '#1A1816' : 'none', color: showList ? '#F5F3EF' : '#7A746C', border: '1px solid #D4CFC8', borderRadius: 4, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
            {showList ? '닫기' : '지난 회고 보기'}
          </button>
        </div>
      </div>

      {showList && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E8E4DE', borderRadius: 4, marginBottom: 20, overflow: 'hidden' }}>
          {sortedRetros.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#7A746C', fontSize: 12 }}>작성된 회고가 없어요</div>
          ) : sortedRetros.map(r => (
            <div key={r.date} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid #F0EDE8' }}>
              <button onClick={() => { setSelectedDate(r.date); setShowList(false) }}
                style={{ flex: 1, minWidth: 0, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: r.date === selectedDate ? 700 : 500, color: r.date === selectedDate ? '#7B9E87' : '#1A1816' }}>{formatFullDate(r.date)}</span>
                  {r.date === today && <span style={{ fontSize: 10, backgroundColor: '#7B9E87', color: '#FFF', borderRadius: 10, padding: '1px 7px' }}>오늘</span>}
                </div>
                <div style={{ fontSize: 11, color: '#7A746C', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{previewOf(r) || '내용 없음'}</div>
              </button>
              <button onClick={() => deleteRetro(r.date)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4BCB4', fontSize: 15, padding: 4, lineHeight: 1, flexShrink: 0 }} aria-label="삭제">×</button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#7A746C', marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid #E8E4DE' }}>
        <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, color: '#1A1816' }}>{formatFullDate(selectedDate)}</span>
        {selectedDate === today && <span style={{ fontSize: 10, backgroundColor: '#7B9E87', color: '#FFF', borderRadius: 10, padding: '2px 7px' }}>오늘</span>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {fields.map(f => (
          <div key={f.key}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1816', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>{f.icon}</span>{f.label}
            </div>
            <AutoGrowTextarea
              value={current ? current[f.key] : ''}
              onChange={v => updateField(f.key, v)}
              placeholder={f.placeholder}
              minRows={f.minRows}
              style={{ backgroundColor: '#FFFFFF' }}
            />
          </div>
        ))}
      </div>
    </>
  )
}

/* ─── Page: 캘린더 ───────────────────────────────────────── */

function CalendarPage({
  events, setEvents,
}: {
  events: CalEvent[]
  setEvents: React.Dispatch<React.SetStateAction<CalEvent[]>>
}) {
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(now.toISOString().slice(0, 10))
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', time: '', category: '일정' as CalEvent['category'] })

  const today = now.toISOString().slice(0, 10)

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDow = new Date(viewYear, viewMonth, 1).getDay()

  const pad = (n: number) => String(n).padStart(2, '0')
  const makeKey = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`

  const eventsByDate: Record<string, CalEvent[]> = {}
  events.forEach(e => { eventsByDate[e.date] = eventsByDate[e.date] ? [...eventsByDate[e.date], e] : [e] })

  const prevMonth = () => { if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) } else setViewMonth(m => m - 1) }
  const nextMonth = () => { if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) } else setViewMonth(m => m + 1) }

  const resetForm = () => { setForm({ title: '', time: '', category: '일정' }); setShowAdd(false); setEditingId(null) }

  const startEdit = (e: CalEvent) => {
    setEditingId(e.id)
    setForm({ title: e.title, time: e.time, category: e.category })
    setShowAdd(true)
  }

  const saveEvent = () => {
    if (!form.title.trim() || !selectedDate) return
    if (editingId) {
      setEvents(es => es.map(e => e.id === editingId ? { ...e, title: form.title.trim(), time: form.time, category: form.category } : e))
    } else {
      setEvents(es => [...es, { id: Date.now().toString(), date: selectedDate, title: form.title.trim(), time: form.time, category: form.category }])
    }
    resetForm()
  }

  const deleteEvent = (id: string) => {
    setEvents(es => es.filter(e => e.id !== id))
    if (editingId === id) resetForm()
  }

  const selectedEvents = selectedDate ? (eventsByDate[selectedDate] || []) : []

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A746C', fontWeight: 500, marginBottom: 4 }}>일정 관리</div>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, fontWeight: 400, color: '#1A1816', margin: 0 }}>캘린더</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>
        {/* ─ Calendar Grid ─ */}
        <div>
          {/* Month Nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <button onClick={prevMonth} style={{ width: 30, height: 30, border: '1px solid #D4CFC8', borderRadius: 4, background: 'none', cursor: 'pointer', fontSize: 14, color: '#7A746C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
            <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: '#1A1816' }}>
              {viewYear}년 {MONTHS_KO[viewMonth]}
            </span>
            <button onClick={nextMonth} style={{ width: 30, height: 30, border: '1px solid #D4CFC8', borderRadius: 4, background: 'none', cursor: 'pointer', fontSize: 14, color: '#7A746C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
          </div>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 4 }}>
            {['일','월','화','수','목','금','토'].map((d, i) => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: i === 0 ? '#C27B7B' : i === 6 ? '#8B9EC2' : '#7A746C', padding: '4px 0', letterSpacing: '0.04em' }}>{d}</div>
            ))}
          </div>

          {/* Cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
            {cells.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} />
              const key = makeKey(viewYear, viewMonth, day)
              const isToday = key === today
              const isSelected = key === selectedDate
              const dayEvents = eventsByDate[key] || []
              const dow = idx % 7
              return (
                <button key={key} onClick={() => setSelectedDate(key)}
                  style={{
                    border: `1px solid ${isSelected ? '#1A1816' : isToday ? '#7B9E87' : '#E8E4DE'}`,
                    borderRadius: 4,
                    background: isSelected ? '#1A1816' : isToday ? '#F0FAF4' : '#FFFFFF',
                    padding: '8px 6px 6px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    minHeight: 64,
                    transition: 'all 0.12s',
                  }}>
                  <div style={{ fontSize: 13, fontWeight: isToday ? 600 : 400, color: isSelected ? '#F5F3EF' : dow === 0 ? '#C27B7B' : dow === 6 ? '#8B9EC2' : '#1A1816', marginBottom: 4 }}>{day}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {dayEvents.slice(0, 2).map(e => (
                      <div key={e.id} style={{ fontSize: 10, lineHeight: 1.3, backgroundColor: CAL_CAT_COLORS[e.category] + (isSelected ? '60' : '30'), color: isSelected ? '#F5F3EF' : '#1A1816', borderRadius: 2, padding: '1px 4px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {e.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && <div style={{ fontSize: 9, color: isSelected ? '#A8A39C' : '#7A746C' }}>+{dayEvents.length - 2}</div>}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 14, marginTop: 16, paddingTop: 14, borderTop: '1px solid #E8E4DE' }}>
            {(Object.entries(CAL_CAT_COLORS) as [CalEvent['category'], string][]).map(([cat, color]) => (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: color }} />
                <span style={{ fontSize: 11, color: '#7A746C' }}>{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─ Day Panel ─ */}
        <div>
          {selectedDate && (
            <div style={{ background: '#FFFFFF', border: '1px solid #E8E4DE', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ padding: '16px 18px', borderBottom: '1px solid #F0EDE8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 15, color: '#1A1816' }}>{formatFullDate(selectedDate)}</div>
                  <div style={{ fontSize: 11, color: '#7A746C', marginTop: 2 }}>{selectedEvents.length}개의 일정</div>
                </div>
                <button onClick={() => { if (showAdd) { resetForm() } else { setShowAdd(true) } }}
                  style={{ width: 28, height: 28, border: '1px solid #D4CFC8', borderRadius: 4, background: showAdd ? '#1A1816' : 'none', color: showAdd ? '#F5F3EF' : '#7A746C', cursor: 'pointer', fontSize: 18, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {showAdd ? '×' : '+'}
                </button>
              </div>

              {showAdd && (
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #F0EDE8', backgroundColor: '#FAFAF8' }}>
                  {editingId && (
                    <div style={{ fontSize: 11, color: '#8B9EC2', fontWeight: 600, marginBottom: 8 }}>일정 수정 중</div>
                  )}
                  <input placeholder="일정 제목" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && saveEvent()}
                    style={{ width: '100%', border: '1px solid #D4CFC8', borderRadius: 4, padding: '7px 10px', fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#1A1816', backgroundColor: '#FFFFFF', outline: 'none', marginBottom: 8 }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                    <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                      style={{ border: '1px solid #D4CFC8', borderRadius: 4, padding: '7px 10px', fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#1A1816', backgroundColor: '#FFFFFF', outline: 'none' }} />
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as CalEvent['category'] }))}
                      style={{ border: '1px solid #D4CFC8', borderRadius: 4, padding: '7px 10px', fontSize: 12, fontFamily: 'Inter, sans-serif', color: '#1A1816', backgroundColor: '#FFFFFF', outline: 'none', cursor: 'pointer' }}>
                      {(['일정','스터디','채용','기타'] as CalEvent['category'][]).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <button onClick={saveEvent} style={{ width: '100%', background: '#1A1816', color: '#F5F3EF', border: 'none', borderRadius: 4, padding: '8px', fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 500, cursor: 'pointer' }}>{editingId ? '수정 저장' : '저장'}</button>
                </div>
              )}

              <div style={{ padding: '12px 0' }}>
                {selectedEvents.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: '#7A746C' }}>
                    <div style={{ fontSize: 13, fontFamily: 'DM Serif Display, serif', marginBottom: 4 }}>일정 없음</div>
                    <div style={{ fontSize: 11 }}>+ 버튼으로 추가하세요</div>
                  </div>
                ) : (
                  selectedEvents
                    .slice()
                    .sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'))
                    .map(e => (
                      <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderBottom: '1px solid #F8F6F3' }}>
                        <div style={{ width: 3, height: 36, borderRadius: 2, backgroundColor: CAL_CAT_COLORS[e.category], flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#1A1816', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            {e.time && <span style={{ fontSize: 11, color: '#7A746C', fontVariantNumeric: 'tabular-nums' }}>{e.time}</span>}
                            <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 10, backgroundColor: CAL_CAT_COLORS[e.category] + '25', color: '#1A1816' }}>{e.category}</span>
                          </div>
                        </div>
                        <button onClick={() => startEdit(e)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A8A39C', fontSize: 12, padding: 4, lineHeight: 1, flexShrink: 0 }} aria-label="수정">✎</button>
                        <button onClick={() => deleteEvent(e.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4BCB4', fontSize: 14, padding: 4, lineHeight: 1, flexShrink: 0 }} aria-label="삭제">×</button>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* Upcoming */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A746C', fontWeight: 500, marginBottom: 10 }}>다가오는 일정</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {events
                .filter(e => e.date >= today)
                .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))
                .slice(0, 5)
                .map(e => {
                  const dt = new Date(e.date)
                  const todayMs = new Date(today).getTime()
                  const diffDays = Math.round((dt.getTime() - todayMs) / 86400000)
                  return (
                    <button key={e.id} onClick={() => { setViewYear(dt.getFullYear()); setViewMonth(dt.getMonth()); setSelectedDate(e.date) }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FFFFFF', border: '1px solid #E8E4DE', borderRadius: 4, padding: '10px 12px', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s' }}>
                      <div style={{ width: 3, height: 32, borderRadius: 2, backgroundColor: CAL_CAT_COLORS[e.category], flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: '#1A1816', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</div>
                        <div style={{ fontSize: 11, color: '#7A746C', marginTop: 2 }}>
                          {MONTHS_KO[dt.getMonth()]} {dt.getDate()}일 {e.time && `· ${e.time}`}
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: diffDays === 0 ? '#7B9E87' : diffDays <= 3 ? '#C27B7B' : '#7A746C', fontWeight: 500, flexShrink: 0 }}>
                        {diffDays === 0 ? '오늘' : `D-${diffDays}`}
                      </div>
                    </button>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ─── App Shell ──────────────────────────────────────────── */

type CloudData = {
  jobs: Job[]
  logs: LogEntry[]
  retros: Retro[]
  routines: Routine[]
  events: CalEvent[]
}

type SyncState = 'loading' | 'saving' | 'saved' | 'error'

function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setMessage('')

    const credentials = { email: email.trim(), password }
    const result = mode === 'signin'
      ? await supabase.auth.signInWithPassword(credentials)
      : await supabase.auth.signUp(credentials)

    setSubmitting(false)
    if (result.error) {
      setMessage(result.error.message)
      return
    }

    setMessage(mode === 'signup'
      ? '가입 확인 메일을 보냈습니다. 메일 인증 후 로그인하세요.'
      : '로그인되었습니다.')
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, boxSizing: 'border-box', background: '#F5F3EF', fontFamily: 'Inter, sans-serif' }}>
      <form onSubmit={submit} style={{ width: '100%', maxWidth: 380, padding: 30, boxSizing: 'border-box', background: '#FFFFFF', border: '1px solid #D4CFC8', borderRadius: 8 }}>
        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 30, color: '#1A1816', marginBottom: 8 }}>Daily</div>
        <p style={{ color: '#7A746C', fontSize: 13, lineHeight: 1.6, margin: '0 0 24px' }}>같은 계정으로 로그인하면 PC와 모바일에서 기록이 동기화됩니다.</p>
        <label style={{ display: 'block', marginBottom: 14 }}>
          <span style={{ display: 'block', marginBottom: 6, fontSize: 12, color: '#3D3833' }}>이메일</span>
          <input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #D4CFC8', borderRadius: 4, padding: '10px 12px', fontSize: 14, outline: 'none' }} />
        </label>
        <label style={{ display: 'block', marginBottom: 18 }}>
          <span style={{ display: 'block', marginBottom: 6, fontSize: 12, color: '#3D3833' }}>비밀번호</span>
          <input type="password" required minLength={6} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #D4CFC8', borderRadius: 4, padding: '10px 12px', fontSize: 14, outline: 'none' }} />
        </label>
        {message && <p role="status" style={{ margin: '0 0 14px', color: '#7A746C', fontSize: 12, lineHeight: 1.5 }}>{message}</p>}
        <button disabled={submitting} style={{ width: '100%', border: 'none', borderRadius: 4, padding: '10px 14px', background: '#1A1816', color: '#F5F3EF', cursor: submitting ? 'wait' : 'pointer', fontSize: 13, fontWeight: 600 }}>
          {submitting ? '처리 중...' : mode === 'signin' ? '로그인' : '회원가입'}
        </button>
        <button type="button" onClick={() => { setMode(current => current === 'signin' ? 'signup' : 'signin'); setMessage('') }} style={{ width: '100%', marginTop: 10, border: 'none', background: 'transparent', color: '#5C7DB8', cursor: 'pointer', fontSize: 12 }}>
          {mode === 'signin' ? '처음 사용하시나요? 회원가입' : '이미 계정이 있나요? 로그인'}
        </button>
      </form>
    </main>
  )
}

function FullPageMessage({ text }: { text: string }) {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, boxSizing: 'border-box', background: '#F5F3EF', color: '#7A746C', fontFamily: 'Inter, sans-serif', fontSize: 14 }}>
      {text}
    </main>
  )
}

const NAV: { id: Page; label: string; icon: string }[] = [
  { id: 'routine', label: '루틴', icon: '◎' },
  { id: 'jobs', label: '채용공고', icon: '◈' },
  { id: 'log', label: '일지', icon: '◇' },
  { id: 'retro', label: '회고록', icon: '✦' },
  { id: 'calendar', label: '캘린더', icon: '▦' },
]

export default function App() {
  const [page, setPage] = useState<Page>('routine')

  // 로컬 저장소는 첫 클라우드 동기화 전의 기록을 보존하는 백업 역할도 합니다.
  const [jobs, setJobs] = useLocalStorage<Job[]>('daily-routine:jobs', initialJobs)
  const [logs, setLogs] = useLocalStorage<LogEntry[]>('daily-routine:logs', initialLogs)
  const [retros, setRetros] = useLocalStorage<Retro[]>('daily-routine:retros', initialRetros)
  const [routines, setRoutines] = useLocalStorage<Routine[]>('daily-routine:routines', initialRoutines)
  const [events, setEvents] = useLocalStorage<CalEvent[]>('daily-routine:events', initialEvents)
  const [session, setSession] = useState<Session | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [cloudLoaded, setCloudLoaded] = useState(false)
  const [syncState, setSyncState] = useState<SyncState>('loading')

  // 앱 시작 시 로그인 세션을 복원하고, 이후 로그인·로그아웃 상태 변화를 반영합니다.
  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!active) return
      setSession(currentSession)
      setAuthReady(true)
      setCloudLoaded(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setCloudLoaded(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  // 로그인한 계정의 단일 데이터 문서를 먼저 불러옵니다.
  useEffect(() => {
    if (!session) {
      setCloudLoaded(false)
      return
    }

    let active = true
    setCloudLoaded(false)
    setSyncState('loading')

    const loadCloudData = async () => {
      const { data, error } = await supabase
        .from('daily_routine_data')
        .select('data')
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (!active) return
      if (error) {
        console.error('클라우드 데이터를 불러오지 못했습니다.', error)
        setSyncState('error')
        return
      }

      const saved = data?.data as Partial<CloudData> | undefined
      if (saved) {
        if (Array.isArray(saved.jobs)) setJobs(saved.jobs)
        if (Array.isArray(saved.logs)) setLogs(saved.logs)
        if (Array.isArray(saved.retros)) setRetros(saved.retros)
        if (Array.isArray(saved.routines)) setRoutines(saved.routines)
        if (Array.isArray(saved.events)) setEvents(saved.events)
      }

      setCloudLoaded(true)
      setSyncState('saved')
    }

    loadCloudData()
    return () => { active = false }
  }, [session?.user.id])

  // 입력 변경은 600ms 동안 묶어 한 번의 upsert로 저장합니다.
  useEffect(() => {
    if (!session || !cloudLoaded) return

    const payload: CloudData = { jobs, logs, retros, routines, events }
    setSyncState('saving')

    const timer = window.setTimeout(async () => {
      const { error } = await supabase
        .from('daily_routine_data')
        .upsert({ user_id: session.user.id, data: payload, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })

      if (error) {
        console.error('클라우드 데이터를 저장하지 못했습니다.', error)
        setSyncState('error')
        return
      }

      setSyncState('saved')
    }, 600)

    return () => window.clearTimeout(timer)
  }, [session?.user.id, cloudLoaded, jobs, logs, retros, routines, events])

  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [jumpJob, setJumpJob] = useState<{ id: string; ts: number } | null>(null)
  const [jumpLog, setJumpLog] = useState<{ id: string; ts: number } | null>(null)
  const [jumpRetro, setJumpRetro] = useState<{ date: string; ts: number } | null>(null)

  const searchResults = buildSearchResults(searchQuery, jobs, logs, retros)

  const handleResultClick = (r: SearchResult) => {
    setPage(r.page)
    if (r.jobId) setJumpJob({ id: r.jobId, ts: Date.now() })
    if (r.logId) setJumpLog({ id: r.logId, ts: Date.now() })
    if (r.retroDate) setJumpRetro({ date: r.retroDate, ts: Date.now() })
    setSearchQuery('')
    setSearchFocused(false)
  }

  const now = new Date()
  const dateStr = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')}`
  const dayStr = ['SUN','MON','TUE','WED','THU','FRI','SAT'][now.getDay()]
  const syncLabel: Record<SyncState, string> = {
    loading: '불러오는 중',
    saving: '저장 중',
    saved: '동기화됨',
    error: '저장 오류',
  }

  if (!authReady) return <FullPageMessage text="로그인 상태를 확인하고 있습니다..." />
  if (!session) return <AuthPage />
  if (!cloudLoaded) return <FullPageMessage text="클라우드 데이터를 불러오는 중입니다..." />

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F3EF', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #D4CFC8', backgroundColor: '#F5F3EF', position: 'sticky', top: 0, zIndex: 10 }}>
        {/* 모바일(≤640px)에서 헤더가 두 줄로 접히고 탭이 전체 폭으로 스크롤되도록 하는 반응형 규칙 */}
        <style>{`
          .daily-header-inner {
            max-width: 720px;
            margin: 0 auto;
            padding: 0 24px;
            display: flex;
            align-items: stretch;
            height: 56px;
          }
          .daily-logo { display: flex; align-items: center; gap: 10px; margin-right: 24px; flex-shrink: 0; }
          .daily-search-wrap { position: relative; display: flex; align-items: center; margin-right: 24px; flex-shrink: 0; }
          .daily-search-input { width: 168px; box-sizing: border-box; }
          .daily-nav {
            display: flex;
            align-items: stretch;
            gap: 0;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .daily-nav::-webkit-scrollbar { display: none; }
          .daily-nav-btn { flex-shrink: 0; }
          .daily-account { display: flex; align-items: center; gap: 8px; margin-left: auto; padding-left: 12px; flex-shrink: 0; }
          .daily-account-email { max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

          @media (max-width: 640px) {
            .daily-header-inner { flex-wrap: wrap; height: auto; padding: 10px 16px; row-gap: 8px; }
            .daily-logo { margin-right: auto; }
            .daily-date { display: none; }
            .daily-search-wrap { margin-right: 0; order: 3; width: 100%; }
            .daily-search-input { width: 100%; }
            .daily-nav { order: 4; width: 100%; }
            .daily-nav-btn { padding: 0 12px !important; font-size: 12px !important; }
            .daily-account { order: 2; margin-left: 0; padding-left: 0; }
            .daily-account-email { display: none; }
          }
        `}</style>

        <div className="daily-header-inner">
          {/* Logo */}
          <div className="daily-logo">
            <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, color: '#1A1816', letterSpacing: '-0.01em' }}>Daily</span>
            <div style={{ width: 1, height: 16, backgroundColor: '#D4CFC8' }} />
            <span className="daily-date" style={{ fontSize: 11, color: '#7A746C', fontWeight: 500, letterSpacing: '0.06em' }}>{dayStr} {dateStr}</span>
          </div>

          {/* Search */}
          <div className="daily-search-wrap">
            <span style={{ position: 'absolute', left: 10, fontSize: 12, color: '#7A746C', pointerEvents: 'none' }}>🔍</span>
            <input
              className="daily-search-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              placeholder="검색..."
              style={{ border: '1px solid #D4CFC8', borderRadius: 20, padding: '6px 12px 6px 28px', fontSize: 12, fontFamily: 'Inter, sans-serif', outline: 'none', backgroundColor: '#FFFFFF', color: '#1A1816' }}
            />
            {searchFocused && searchQuery.trim() && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, width: 320, maxWidth: '90vw', maxHeight: 380, overflowY: 'auto', background: '#FFFFFF', border: '1px solid #D4CFC8', borderRadius: 6, boxShadow: '0 10px 28px rgba(26,24,22,0.12)', zIndex: 50 }}>
                {searchResults.length === 0 ? (
                  <div style={{ padding: '18px 14px', fontSize: 12, color: '#7A746C', textAlign: 'center' }}>
                    '{searchQuery}'에 대한 검색 결과가 없어요
                  </div>
                ) : (
                  searchResults.map(r => (
                    <button key={r.key} onClick={() => handleResultClick(r)}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', background: 'none', border: 'none', borderBottom: '1px solid #F0EDE8', cursor: 'pointer' }}>
                      <div style={{ fontSize: 10, color: '#8B9EC2', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 3 }}>{r.typeLabel}</div>
                      <div style={{ fontSize: 13, color: '#1A1816', fontWeight: 500, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</div>
                      {r.snippet && <div style={{ fontSize: 11, color: '#7A746C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.snippet}</div>}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className="daily-nav">
            {NAV.map(n => (
              <button key={n.id} className="daily-nav-btn" onClick={() => setPage(n.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '0 18px', background: 'none', border: 'none', borderBottom: `2px solid ${page === n.id ? '#1A1816' : 'transparent'}`, cursor: 'pointer', color: page === n.id ? '#1A1816' : '#7A746C', fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: page === n.id ? 600 : 400, transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: 14 }}>{n.icon}</span>
                {n.label}
              </button>
            ))}
          </nav>

          <div className="daily-account">
            <span title={syncLabel[syncState]} style={{ fontSize: 11, color: syncState === 'error' ? '#C27B7B' : '#7A746C', whiteSpace: 'nowrap' }}>{syncLabel[syncState]}</span>
            <span className="daily-account-email" title={session.user.email} style={{ fontSize: 11, color: '#7A746C' }}>{session.user.email}</span>
            <button onClick={() => supabase.auth.signOut()} style={{ border: '1px solid #D4CFC8', borderRadius: 4, padding: '5px 8px', background: '#FFFFFF', color: '#7A746C', cursor: 'pointer', fontSize: 11, whiteSpace: 'nowrap' }}>로그아웃</button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '36px 24px 60px' }}>
        {page === 'routine' && <RoutinePage routines={routines} setRoutines={setRoutines} />}
        {page === 'jobs' && <JobsPage jobs={jobs} setJobs={setJobs} jumpJob={jumpJob} />}
        {page === 'log' && <LogPage logs={logs} setLogs={setLogs} jumpLog={jumpLog} />}
        {page === 'retro' && <RetroPage retros={retros} setRetros={setRetros} jumpRetro={jumpRetro} />}
        {page === 'calendar' && <CalendarPage events={events} setEvents={setEvents} />}
      </main>
    </div>
  )
}
