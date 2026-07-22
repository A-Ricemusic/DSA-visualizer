import React, { useMemo, useState } from 'react'
import { AlertTriangle, ArrowRight, Check, ChevronLeft, ChevronRight, CirclePlay, GitBranch, Play, Plus, RotateCcw, Trash2 } from 'lucide-react'
import './alien.css'

const presets = [
  { name: 'Classic', words: ['wrt','wrf','er','ett','rftt'] },
  { name: 'Simple', words: ['z','o'] },
  { name: 'Bad prefix', words: ['abc','ab'] },
  { name: 'Cycle', words: ['z','x','z'] }
]

function buildTrace(words) {
  const chars = [...new Set(words.join(''))].sort()
  const graph = Object.fromEntries(chars.map(c => [c, []]))
  const indegree = Object.fromEntries(chars.map(c => [c, 0]))
  const steps = [{ type:'setup', title:'Create one node per letter', detail:`Found ${chars.length} unique letter${chars.length === 1 ? '' : 's'}: ${chars.join(', ') || 'none'}.`, graph: cloneGraph(graph), indegree:{...indegree}, queue:[], output:'' }]

  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i], b = words[i + 1]
    const limit = Math.min(a.length, b.length)
    let j = 0
    while (j < limit && a[j] === b[j]) j++
    if (j === limit) {
      if (a.length > b.length) {
        steps.push({ type:'invalid', title:'Invalid prefix detected', detail:`“${a}” appears before its own prefix “${b}”. No alphabet can make this sorted.`, pair:[a,b], compare:j, graph:cloneGraph(graph), indegree:{...indegree}, queue:[], output:'' })
        return { words, chars, steps, valid:false, result:'', reason:'prefix' }
      }
      steps.push({ type:'compare', title:'No new constraint', detail:`“${a}” is a valid prefix of “${b}”, so this pair adds no edge.`, pair:[a,b], compare:j, graph:cloneGraph(graph), indegree:{...indegree}, queue:[], output:'' })
      continue
    }
    const from = a[j], to = b[j]
    if (!graph[from].includes(to)) {
      graph[from].push(to)
      graph[from].sort()
      indegree[to]++
      steps.push({ type:'edge', title:`First difference: ${from} comes before ${to}`, detail:`At index ${j}, “${from}” is the first differing letter before “${to}”. Add the directed edge ${from} → ${to}.`, pair:[a,b], compare:j, edge:[from,to], graph:cloneGraph(graph), indegree:{...indegree}, queue:[], output:'' })
    } else {
      steps.push({ type:'edge', title:`Constraint ${from} → ${to} already exists`, detail:'Duplicate evidence does not increase the indegree again.', pair:[a,b], compare:j, edge:[from,to], graph:cloneGraph(graph), indegree:{...indegree}, queue:[], output:'' })
    }
  }

  const queue = chars.filter(c => indegree[c] === 0).sort()
  const workDegree = {...indegree}
  let output = ''
  steps.push({ type:'queue', title:'Seed the zero-indegree queue', detail: queue.length ? `These letters have no prerequisites: ${queue.join(', ')}.` : 'Every letter has a prerequisite, which suggests a cycle.', graph:cloneGraph(graph), indegree:{...workDegree}, queue:[...queue], output })
  while (queue.length) {
    const current = queue.shift()
    output += current
    steps.push({ type:'take', title:`Take “${current}” from the queue`, detail:`Append it to the alien order. Partial result: ${output}.`, node:current, graph:cloneGraph(graph), indegree:{...workDegree}, queue:[...queue], output })
    for (const next of graph[current]) {
      workDegree[next]--
      if (workDegree[next] === 0) { queue.push(next); queue.sort() }
      steps.push({ type:'release', title:`Remove dependency ${current} → ${next}`, detail: workDegree[next] === 0 ? `“${next}” now has zero prerequisites, so add it to the queue.` : `“${next}” still has ${workDegree[next]} prerequisite${workDegree[next] === 1 ? '' : 's'}.`, edge:[current,next], node:next, graph:cloneGraph(graph), indegree:{...workDegree}, queue:[...queue], output })
    }
  }
  const valid = output.length === chars.length
  steps.push({ type: valid ? 'done' : 'cycle', title: valid ? `Valid alien order: ${output}` : 'Cycle detected', detail: valid ? 'Every letter was removed from the graph. This is one valid topological ordering.' : `${chars.length - output.length} letter(s) still have prerequisites. A cycle makes the dictionary impossible.`, graph:cloneGraph(graph), indegree:{...workDegree}, queue:[], output })
  return { words, chars, steps, valid, result: valid ? output : '', reason: valid ? '' : 'cycle' }
}

function cloneGraph(graph) { return Object.fromEntries(Object.entries(graph).map(([k,v]) => [k,[...v]])) }

function parseCases(text) {
  const rows = text.split('\n').map(x=>x.trim()).filter(Boolean)
  if (!rows.length) throw new Error('Add at least one test case.')
  return rows.map((row, i) => {
    let value
    try { value = JSON.parse(row) } catch { throw new Error(`Line ${i + 1} is not valid JSON.`) }
    if (!Array.isArray(value) || !value.length || value.some(w => typeof w !== 'string' || !w.length)) throw new Error(`Line ${i + 1} must be a non-empty JSON array of non-empty strings.`)
    return value
  })
}

export default function AlienVisualizer() {
  const [input,setInput] = useState('["wrt","wrf","er","ett","rftt"]\n["abc","ab"]\n["z","x","z"]')
  const [runs,setRuns] = useState(() => [buildTrace(presets[0].words),buildTrace(presets[2].words),buildTrace(presets[3].words)])
  const [active,setActive] = useState(0)
  const [step,setStep] = useState(0)
  const [error,setError] = useState('')
  const run = () => { try { const next=parseCases(input).map(buildTrace); setRuns(next); setActive(0); setStep(0); setError('') } catch(e) { setError(e.message) } }
  const addPreset = words => setInput(v => `${v.trim()}${v.trim()?'\n':''}${JSON.stringify(words)}`)
  const trace = runs[active]
  const current = trace.steps[step]
  const positions = useMemo(() => nodePositions(trace.chars), [trace])
  const setCase = i => { setActive(i); setStep(0) }

  return <div className="alien-page">
    <header className="alien-hero"><div><span className="alien-kicker"><GitBranch size={15}/> Graph lab · topological sort</span><h1>Alien Dictionary<br/><em>constraint visualizer</em></h1><p>Compare adjacent words, turn the first difference into a directed edge, then watch Kahn’s algorithm reveal the alphabet.</p></div><div className="complexity-card"><small>CORE IDEA</small><strong>words → constraints → order</strong><div><span>Time <b>O(C)</b></span><span>Space <b>O(1)*</b></span></div><p>*The alphabet is capped at 26 letters.</p></div></header>

    <section className="case-builder"><div className="builder-head"><div><span className="step-label">Test case workshop</span><h2>Run several dictionaries at once</h2><p>Enter one JSON array per line. Each line becomes an independent trace.</p></div><div className="preset-row">{presets.map(p=><button key={p.name} onClick={()=>addPreset(p.words)}><Plus size={13}/>{p.name}</button>)}</div></div><div className="input-run"><textarea aria-label="Alien dictionary test cases" spellCheck="false" value={input} onChange={e=>setInput(e.target.value)}/><div><button className="clear-button" onClick={()=>setInput('')}><Trash2 size={16}/> Clear</button><button className="alien-run" onClick={run}><CirclePlay size={17}/> Build traces</button></div></div>{error&&<div className="alien-error"><AlertTriangle size={16}/>{error}</div>}</section>

    <div className="case-tabs" role="tablist">{runs.map((r,i)=><button role="tab" aria-selected={i===active} className={i===active?'active':''} key={i} onClick={()=>setCase(i)}><span>CASE {i+1}</span><code>{JSON.stringify(r.words)}</code><b className={r.valid?'valid':'invalid'}>{r.valid?r.result:'invalid'}</b></button>)}</div>

    <section className="visualizer-shell">
      <div className="visual-main">
        <div className="visual-top"><div><span className={`phase phase-${current.type}`}>{phaseName(current.type)}</span><h2>{current.title}</h2></div><span className="step-number">Step {step+1} / {trace.steps.length}</span></div>
        {current.pair && <WordCompare pair={current.pair} index={current.compare}/>} 
        <Graph graph={current.graph} indegree={current.indegree} positions={positions} highlight={current.edge} current={current.node}/>
        <div className="explanation"><span>{current.type==='invalid'||current.type==='cycle'?<AlertTriangle/>:<ArrowRight/>}</span><p>{current.detail}</p></div>
        <div className="step-controls"><button onClick={()=>setStep(0)} disabled={step===0}><RotateCcw size={15}/> Reset</button><div><button aria-label="Previous step" onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}><ChevronLeft/></button><button className="next-step" onClick={()=>setStep(s=>Math.min(trace.steps.length-1,s+1))} disabled={step===trace.steps.length-1}>{step===trace.steps.length-1?'Finished':'Next step'}<ChevronRight/></button></div></div>
      </div>
      <aside className="algorithm-state"><span className="step-label">Algorithm state</span><StateRow label="Zero-indegree queue" values={current.queue} empty="empty" tone="queue"/><StateRow label="Output order" values={[...current.output]} empty="—" tone="output"/><div className="degree-list"><small>INDEGREES</small>{trace.chars.map(c=><div key={c} className={current.node===c?'hot':''}><span>{c}</span><div><i style={{width:`${Math.min(100,(current.indegree[c]||0)*33)}%`}}/></div><b>{current.indegree[c]}</b></div>)}</div><div className="rule-card"><small>THE TWO RULES</small><p><b>1.</b> Only compare adjacent words.</p><p><b>2.</b> Only the first different letter creates an edge.</p></div></aside>
    </section>
    <section className="mental-model"><div><span>01</span><h3>Compare neighbors</h3><p>The given order only promises facts between adjacent words.</p></div><ArrowRight/><div><span>02</span><h3>Build the graph</h3><p>The first differing letters form a before → after constraint.</p></div><ArrowRight/><div><span>03</span><h3>Topological sort</h3><p>Repeatedly take any letter with no remaining prerequisite.</p></div></section>
  </div>
}

function WordCompare({pair,index}) { return <div className="word-compare"><div>{[...pair[0]].map((c,i)=><span className={i===index?'diff':i<index?'same':''} key={i}>{c}<small>{i}</small></span>)}</div><div>{[...pair[1]].map((c,i)=><span className={i===index?'diff':i<index?'same':''} key={i}>{c}<small>{i}</small></span>)}</div><p>{index < Math.min(pair[0].length,pair[1].length) ? <>First difference at index <b>{index}</b></> : 'One word is a complete prefix'}</p></div> }

function Graph({graph,indegree,positions,highlight,current}) { const edges=Object.entries(graph).flatMap(([a,bs])=>bs.map(b=>[a,b])); return <div className="graph-wrap"><svg viewBox="0 0 620 340" role="img" aria-label="Directed letter constraint graph"><defs><marker id="arrow" viewBox="0 0 10 10" refX="21" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker></defs>{edges.map(([a,b])=><line key={`${a}-${b}`} x1={positions[a].x} y1={positions[a].y} x2={positions[b].x} y2={positions[b].y} className={highlight?.[0]===a&&highlight?.[1]===b?'edge-hot':''} markerEnd="url(#arrow)"/>)}{Object.keys(graph).map(c=><g key={c} transform={`translate(${positions[c].x},${positions[c].y})`} className={`${current===c?'node-current':''} ${indegree[c]===0?'node-ready':''}`}><circle r="25"/><text textAnchor="middle" dominantBaseline="central">{c}</text><text className="degree-badge" x="19" y="-19">{indegree[c]}</text></g>)}</svg></div> }
function nodePositions(chars) { const out={}; const n=Math.max(chars.length,1); chars.forEach((c,i)=>{const a=(Math.PI*2*i/n)-Math.PI/2;out[c]={x:310+Math.cos(a)*220,y:170+Math.sin(a)*115}});return out }
function StateRow({label,values,empty,tone}) { return <div className="state-row"><small>{label}</small><div className={tone}>{values.length?values.map((x,i)=><span key={`${x}-${i}`}>{x}</span>):<em>{empty}</em>}</div></div> }
function phaseName(type) { return ({setup:'Graph setup',compare:'Word comparison',edge:'Add constraint',invalid:'Invalid input',queue:'Topological sort',take:'Process node',release:'Update neighbors',done:'Complete',cycle:'Cycle failure'})[type] }
