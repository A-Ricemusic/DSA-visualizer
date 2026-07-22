import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowLeft, ArrowRight, BookOpen, Braces, GitBranch, Search, Sparkles } from 'lucide-react'
import AlienVisualizer from './AlienVisualizer'
import DecodeVisualizer from './DecodeVisualizer'
import './app.css'

const problems = [
  {
    id: 'alien-dictionary',
    title: 'Alien Dictionary',
    summary: 'Build letter constraints from sorted words, then reveal the alphabet with topological sort.',
    category: 'Graphs',
    difficulty: 'Hard',
    pattern: 'Topological Sort',
    icon: GitBranch,
    color: 'violet',
    Visualizer: AlienVisualizer,
  },
  {
    id: 'decode-ways',
    title: 'Decode Ways',
    summary: 'See how one-digit and two-digit choices combine into a dynamic-programming recurrence.',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    pattern: '1D DP',
    icon: Braces,
    color: 'green',
    Visualizer: DecodeVisualizer,
  },
]

function App() {
  const [selectedId, setSelectedId] = useState(() => window.location.hash.replace('#/problem/', ''))
  const selected = problems.find(problem => problem.id === selectedId)

  const openProblem = id => {
    setSelectedId(id)
    window.location.hash = `/problem/${id}`
    window.scrollTo(0, 0)
  }

  const goHome = () => {
    setSelectedId('')
    history.replaceState(null, '', window.location.pathname)
    window.scrollTo(0, 0)
  }

  if (selected) {
    const Visualizer = selected.Visualizer
    return <div className="visualizer-page">
      <header className="visualizer-header">
        <button onClick={goHome}><ArrowLeft size={17}/> All problems</button>
        <div><span>{selected.category}</span><b>{selected.title}</b></div>
      </header>
      <main className="visualizer-content"><Visualizer /></main>
    </div>
  }

  return <ProblemLibrary problems={problems} openProblem={openProblem} />
}

function ProblemLibrary({ problems, openProblem }) {
  const [query, setQuery] = useState('')
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return problems
    return problems.filter(p => `${p.title} ${p.category} ${p.pattern}`.toLowerCase().includes(needle))
  }, [query, problems])

  return <div className="library-page">
    <header className="library-header">
      <a className="simple-brand" href="/" onClick={event => event.preventDefault()}><span><Sparkles size={18}/></span>AlgoLens</a>
      <div className="library-intro">
        <span className="library-eyebrow"><BookOpen size={14}/> Interactive problem library</span>
        <h1>Understand the algorithm.<br/><em>Watch it happen.</em></h1>
        <p>Choose a problem, enter your own test case, and step through the solution visually.</p>
      </div>
      <label className="problem-search"><Search size={18}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search problems or patterns…" aria-label="Search problems"/></label>
    </header>

    <main className="library-main">
      <div className="library-title"><div><h2>Problems</h2><p>{visible.length} interactive visualizer{visible.length === 1 ? '' : 's'}</p></div></div>
      <div className="problem-grid">
        {visible.map(problem => {
          const Icon = problem.icon
          return <button className="problem-card" key={problem.id} onClick={() => openProblem(problem.id)}>
            <div className={`problem-icon ${problem.color}`}><Icon size={25}/></div>
            <div className="problem-tags"><span>{problem.category}</span><span className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span></div>
            <h3>{problem.title}</h3>
            <p>{problem.summary}</p>
            <div className="problem-card-footer"><code>{problem.pattern}</code><span>Open visualizer <ArrowRight size={15}/></span></div>
          </button>
        })}
      </div>
      {!visible.length && <div className="empty-library"><Search size={28}/><h3>No problems found</h3><p>Try a problem name, category, or algorithm pattern.</p></div>}
    </main>
    <footer className="library-footer">New problem visualizers will appear here as they’re added.</footer>
  </div>
}

createRoot(document.getElementById('root')).render(<App />)
