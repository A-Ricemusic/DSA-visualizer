import React, { useMemo, useState } from 'react'
import { AlertTriangle, ArrowRight, Check, ChevronLeft, ChevronRight, Play, RotateCcw } from 'lucide-react'
import './decode.css'

const presets = ['226','12','06','2101','11106']

function traceDecode(s) {
  if (!/^\d+$/.test(s)) throw new Error('Enter a string containing digits only.')
  if (s.length > 18) throw new Error('Use at most 18 digits so the walkthrough stays readable.')
  const dp = Array(s.length + 1).fill(0)
  dp[0] = 1
  const steps = [{index:0,dp:[...dp],single:null,pair:null,total:1,title:'Start with the empty prefix',detail:'There is exactly one way to decode nothing. This base case lets valid prefixes contribute to later answers.'}]
  for(let i=1;i<=s.length;i++){
    const one=s.slice(i-1,i)
    const two=i>1?s.slice(i-2,i):null
    const singleValid=one!=='0'
    const pairValid=two!==null && Number(two)>=10 && Number(two)<=26
    const fromSingle=singleValid?dp[i-1]:0
    const fromPair=pairValid?dp[i-2]:0
    dp[i]=fromSingle+fromPair
    const pieces=[]
    pieces.push(singleValid?`“${one}” is valid, so carry ${fromSingle} way${fromSingle===1?'':'s'} from dp[${i-1}].`:`“${one}” cannot be decoded alone.`)
    if(two!==null) pieces.push(pairValid?`“${two}” is between 10 and 26, so add ${fromPair} from dp[${i-2}].`:`“${two}” is not a valid two-digit letter.`)
    steps.push({index:i,dp:[...dp],single:{value:one,valid:singleValid,adds:fromSingle},pair:two===null?null:{value:two,valid:pairValid,adds:fromPair},total:dp[i],title:`Solve prefix “${s.slice(0,i)}”`,detail:pieces.join(' ')})
  }
  return {s,dp,steps,result:dp[s.length]}
}

export default function DecodeVisualizer(){
  const [input,setInput]=useState('226')
  const [data,setData]=useState(()=>traceDecode('226'))
  const [step,setStep]=useState(0)
  const [error,setError]=useState('')
  const current=data.steps[step]
  const run=value=>{const next=value??input;try{const result=traceDecode(next);setInput(next);setData(result);setStep(0);setError('')}catch(e){setError(e.message)}}
  return <div className="decode-page">
    <header className="decode-hero"><div><span className="decode-kicker">Dynamic programming · 1D prefix</span><h1>Decode Ways<br/><em>visualizer</em></h1><p>At every position, ask two questions: can the last digit stand alone, and can the last two digits form a letter?</p></div><div className="decode-formula"><small>RECURRENCE</small><code>dp[i] = valid1 ? dp[i−1] : 0<br/>　　　+ valid2 ? dp[i−2] : 0</code><p>Time O(n) · Space O(n)</p></div></header>
    <section className="decode-input"><div><label htmlFor="decode-case">Your digit string</label><div><input id="decode-case" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&run()} placeholder="e.g. 226"/><button onClick={()=>run()}><Play size={15}/> Visualize</button></div></div><div className="decode-presets"><span>Try an example</span>{presets.map(p=><button className={data.s===p?'active':''} onClick={()=>run(p)} key={p}>{p}</button>)}</div>{error&&<p className="decode-error"><AlertTriangle size={15}/>{error}</p>}</section>
    <section className="decode-workspace">
      <div className="decode-main"><div className="decode-step-head"><div><span>STEP {step+1} OF {data.steps.length}</span><h2>{current.title}</h2></div><strong>{step===data.steps.length-1?`${data.result} total ways`:`prefix length ${current.index}`}</strong></div>
        <div className="digit-row">{[...data.s].map((digit,i)=><div key={i} className={`${i===current.index-1?'current':''} ${i>=current.index?'future':''}`}><small>{i}</small><b>{digit}</b></div>)}</div>
        {current.index===0?<div className="base-case"><span>dp[0]</span><strong>1</strong><p>The empty prefix is our starting point.</p></div>:<div className="choice-row"><Choice label="ONE DIGIT" item={current.single} source={`dp[${current.index-1}]`}/><span>+</span><Choice label="TWO DIGITS" item={current.pair} source={`dp[${current.index-2}]`}/></div>}
        <div className="decode-explanation"><ArrowRight/><p>{current.detail}</p></div>
        <div className="decode-controls"><button disabled={step===0} onClick={()=>setStep(0)}><RotateCcw size={14}/> Reset</button><div><button aria-label="Previous step" disabled={step===0} onClick={()=>setStep(s=>s-1)}><ChevronLeft/></button><button className="decode-next" disabled={step===data.steps.length-1} onClick={()=>setStep(s=>s+1)}>{step===data.steps.length-1?'Complete':'Next step'}<ChevronRight/></button></div></div>
      </div>
      <aside className="decode-table"><span>DP TABLE</span><p>Each cell counts ways to decode that prefix.</p><div>{current.dp.map((value,i)=><div className={`${i===current.index?'hot':''} ${i>current.index?'future':''}`} key={i}><small>dp[{i}]</small><b>{i<=current.index?value:'?'}</b><code>{i===0?'∅':data.s.slice(0,i)}</code></div>)}</div><section><Check size={17}/><div><small>CURRENT ANSWER</small><strong>{current.total} way{current.total===1?'':'s'}</strong></div></section></aside>
    </section>
    <section className="decode-rules"><div><b>1–9</b><span>Valid alone</span><p>Contributes dp[i−1]</p></div><div><b>10–26</b><span>Valid pair</span><p>Contributes dp[i−2]</p></div><div><b>0</b><span>Never alone</span><p>Only works inside 10 or 20</p></div></section>
  </div>
}

function Choice({label,item,source}){if(!item)return <div className="decode-choice muted"><small>{label}</small><strong>Not available</strong><p>There is no previous pair yet.</p></div>;return <div className={`decode-choice ${item.valid?'valid':'invalid'}`}><small>{label}</small><strong>“{item.value}”</strong><span>{item.valid?<><Check size={13}/> valid</>:<><AlertTriangle size={13}/> invalid</>}</span><p>{item.valid?`Add ${source} = ${item.adds}`:'Add nothing'}</p></div>}
