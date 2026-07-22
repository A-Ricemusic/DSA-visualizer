import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowRight, BookOpen, BrainCircuit, Check, ChevronLeft, ChevronRight,
  CircleHelp, Clock3, Code2, Flame, LayoutDashboard, Lightbulb,
  Play, RotateCcw, Sparkles, Target, Trophy, X
} from 'lucide-react'
import './styles.css'
import './curriculum.css'

const problems = [
  {
    id: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'Easy', time: '15 min', pattern: '1D DP',
    prompt: 'You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. How many distinct ways can you reach the top?',
    example: 'Input: n = 5     Output: 8',
    state: 'dp[i] = number of ways to reach step i',
    transition: 'dp[i] = dp[i − 1] + dp[i − 2]',
    base: 'dp[0] = 1, dp[1] = 1',
    hints: ['Draw the final step. You could only have arrived from one of two earlier steps.', 'Let dp[i] count ways to reach i. Which previous states flow into it?', 'Add the ways to reach i−1 and i−2. Initialize the empty staircase as one valid way.'],
    code: `function climbStairs(n) {\n  // Return the number of distinct ways.\n  \n}`,
    fn: 'climbStairs', cases: [{ args: [1], expected: 1 }, { args: [2], expected: 2 }, { args: [5], expected: 8 }],
    test: 'climbStairs(5) → 8', values: [1, 1, 2, 3, 5, 8], labels: ['0','1','2','3','4','5']
  },
  {
    id: 'house-robber', title: 'House Robber', difficulty: 'Medium', time: '25 min', pattern: 'Take / Skip',
    prompt: 'Given a row of houses, return the maximum money you can rob without robbing two adjacent houses.',
    example: 'Input: [2, 7, 9, 3, 1]     Output: 12',
    state: 'dp[i] = max money using houses through i',
    transition: 'dp[i] = max(dp[i − 1], nums[i] + dp[i − 2])',
    base: 'dp[0] = nums[0]',
    hints: ['At each house, frame the decision as two mutually exclusive choices.', 'If you take house i, which earlier result is still safe to use?', 'Compare skipping it (dp[i−1]) against taking it (nums[i] + dp[i−2]).'],
    code: `function rob(nums) {\n  // Return the maximum safe total.\n  \n}`,
    fn: 'rob', cases: [{ args: [[1,2,3,1]], expected: 4 }, { args: [[2,7,9,3,1]], expected: 12 }, { args: [[2,1,1,2]], expected: 4 }],
    test: 'rob([2,7,9,3,1]) → 12', values: [2, 7, 11, 11, 12], labels: ['2','7','9','3','1']
  },
  {
    id: 'coin-change', title: 'Coin Change', difficulty: 'Medium', time: '30 min', pattern: 'Unbounded DP',
    prompt: 'Given coin denominations and an amount, return the fewest coins needed to make that amount, or −1 if impossible.',
    example: 'Input: coins = [1,2,5], amount = 11     Output: 3',
    state: 'dp[a] = fewest coins needed to make amount a',
    transition: 'dp[a] = min(dp[a], 1 + dp[a − coin])',
    base: 'dp[0] = 0; all others = ∞',
    hints: ['Make each smaller amount a reusable subproblem.', 'For every amount, try choosing each coin as the final coin.', 'Start dp[0] at 0 and minimize 1 + dp[amount−coin].'],
    code: `function coinChange(coins, amount) {\n  // Return the minimum coin count.\n  \n}`,
    fn: 'coinChange', cases: [{ args: [[1,2,5], 11], expected: 3 }, { args: [[2], 3], expected: -1 }, { args: [[1], 0], expected: 0 }],
    test: 'coinChange([1,2,5], 11) → 3', values: [0,1,1,2,2,1,2,2,3,3,2,3], labels: ['0','1','2','3','4','5','6','7','8','9','10','11']
  },
  {
    id: 'min-cost-stairs', title: 'Min Cost Climbing Stairs', difficulty: 'Easy', time: '20 min', pattern: '1D Min Cost',
    prompt: 'Each stair has a cost. After paying a cost, climb one or two steps. Return the minimum cost required to reach just beyond the final stair.',
    example: 'Input: [10, 15, 20]     Output: 15',
    state: 'dp[i] = minimum cost to reach step i', transition: 'dp[i] = min(dp[i − 1] + cost[i − 1], dp[i − 2] + cost[i − 2])', base: 'dp[0] = 0, dp[1] = 0',
    hints: ['Treat the top as one extra step with no cost.', 'You can arrive from either of the previous two steps.', 'Pay for the step you leave, then take the cheaper route.'],
    code: `function minCostClimbingStairs(cost) {\n  // Return the minimum cost to reach the top.\n  \n}`,
    fn: 'minCostClimbingStairs', cases: [{args:[[10,15,20]],expected:15},{args:[[1,100,1,1,1,100,1,1,100,1]],expected:6},{args:[[0,0]],expected:0}],
    test: 'minCostClimbingStairs([10,15,20]) → 15', values:[0,0,10,15], labels:['0','1','2','top']
  },
  {
    id: 'decode-ways', title: 'Decode Ways', difficulty: 'Medium', time: '30 min', pattern: 'Prefix DP',
    prompt: 'Digits map from 1→A through 26→Z. Return how many ways a digit string can be decoded. A zero cannot be decoded alone.',
    example: 'Input: "226"     Output: 3',
    state: 'dp[i] = ways to decode the first i characters', transition: 'add dp[i − 1] for a valid single digit; add dp[i − 2] for a valid pair', base: 'dp[0] = 1',
    hints: ['At each index, inspect a one-digit and a two-digit ending.', 'Zero only works as part of 10 or 20.', 'Add the counts from each valid previous prefix.'],
    code: `function numDecodings(s) {\n  // Return the number of valid decodings.\n  \n}`,
    fn:'numDecodings', cases:[{args:['12'],expected:2},{args:['226'],expected:3},{args:['06'],expected:0},{args:['2101'],expected:1}],
    test:'numDecodings("226") → 3', values:[1,1,2,3], labels:['∅','2','22','226']
  },
  {
    id:'unique-paths', title:'Unique Paths', difficulty:'Medium', time:'25 min', pattern:'Grid DP',
    prompt:'A robot starts in the top-left of an m × n grid and may move only right or down. Return the number of paths to the bottom-right.',
    example:'Input: m = 3, n = 7     Output: 28',
    state:'dp[r][c] = paths from the start to cell (r, c)', transition:'dp[r][c] = dp[r − 1][c] + dp[r][c − 1]', base:'first row and first column = 1',
    hints:['Ask which neighboring cells can enter the current cell.', 'Only the cell above and the cell to the left can flow in.', 'Seed the top and left edges with one path each.'],
    code:`function uniquePaths(m, n) {\n  // Return the number of right/down paths.\n  \n}`,
    fn:'uniquePaths', cases:[{args:[3,7],expected:28},{args:[3,2],expected:3},{args:[1,8],expected:1}],
    test:'uniquePaths(3, 7) → 28', values:[1,1,1,1,2,3,1,3,6], labels:['0,0','0,1','0,2','1,0','1,1','1,2','2,0','2,1','2,2']
  },
  {
    id:'unique-paths-obstacles', title:'Unique Paths II', difficulty:'Medium', time:'30 min', pattern:'Grid + Obstacles',
    prompt:'Count right/down paths through a grid where 1 marks a blocked cell and 0 marks an open cell.',
    example:'Input: [[0,0,0],[0,1,0],[0,0,0]]     Output: 2',
    state:'dp[r][c] = paths reaching this open cell', transition:'blocked → 0; otherwise top + left', base:'dp[0][0] = 1 if the start is open',
    hints:['A blocked cell contributes zero paths.', 'The normal grid recurrence still works everywhere else.', 'A single 1D row can be updated left to right.'],
    code:`function uniquePathsWithObstacles(grid) {\n  // Return the number of valid paths.\n  \n}`,
    fn:'uniquePathsWithObstacles', cases:[{args:[[[0,0,0],[0,1,0],[0,0,0]]],expected:2},{args:[[[0,1],[0,0]]],expected:1},{args:[[[1]]],expected:0}],
    test:'uniquePathsWithObstacles(grid) → 2', values:[1,1,1,1,0,1,1,1,2], labels:['0,0','0,1','0,2','1,0','wall','1,2','2,0','2,1','2,2']
  },
  {
    id:'partition-equal-subset', title:'Partition Equal Subset Sum', difficulty:'Medium', time:'35 min', pattern:'0/1 Knapsack',
    prompt:'Return true if the array can be split into two subsets with equal sums.',
    example:'Input: [1,5,11,5]     Output: true',
    state:'dp[s] = whether some chosen numbers can make sum s', transition:'dp[s] = dp[s] or dp[s − num]', base:'dp[0] = true',
    hints:['Equal halves must each sum to total / 2.', 'This becomes a subset-sum reachability problem.', 'Iterate sums backward so each number is used at most once.'],
    code:`function canPartition(nums) {\n  // Return whether an equal partition exists.\n  \n}`,
    fn:'canPartition', cases:[{args:[[1,5,11,5]],expected:true},{args:[[1,2,3,5]],expected:false},{args:[[2,2,1,1]],expected:true}],
    test:'canPartition([1,5,11,5]) → true', values:['T','T','F','F','F','T','T','F','F','F','T','T'], labels:['0','1','2','3','4','5','6','7','8','9','10','11']
  },
  {
    id:'target-sum', title:'Target Sum', difficulty:'Medium', time:'35 min', pattern:'Knapsack Counting',
    prompt:'Place a + or − before every number. Return the number of expressions that evaluate to target.',
    example:'Input: nums = [1,1,1,1,1], target = 3     Output: 5',
    state:'dp[sum] = ways to create sum after processed numbers', transition:'next[sum ± num] += dp[sum]', base:'dp[0] = 1 before using any numbers',
    hints:['Each number creates two branches, but many branches reach the same sum.', 'Store a count for every reachable sum.', 'Build a new map for plus and minus choices at each number.'],
    code:`function findTargetSumWays(nums, target) {\n  // Return the number of sign assignments.\n  \n}`,
    fn:'findTargetSumWays', cases:[{args:[[1,1,1,1,1],3],expected:5},{args:[[1],1],expected:1},{args:[[0,0,1],1],expected:4}],
    test:'findTargetSumWays([1,1,1,1,1], 3) → 5', values:[1,1,2,3,5], labels:['start','1 num','2 nums','3 nums','target']
  },
  {
    id:'longest-increasing-subsequence', title:'Longest Increasing Subsequence', difficulty:'Medium', time:'35 min', pattern:'Sequence DP',
    prompt:'Return the length of the longest strictly increasing subsequence. Elements do not need to be contiguous.',
    example:'Input: [10,9,2,5,3,7,101,18]     Output: 4',
    state:'dp[i] = longest increasing subsequence ending at i', transition:'dp[i] = max(dp[j] + 1) for j < i and nums[j] < nums[i]', base:'every dp[i] starts at 1',
    hints:['Commit to an ending index instead of solving the whole array at once.', 'Look backward for smaller values that can precede nums[i].', 'The answer is the maximum over all ending positions.'],
    code:`function lengthOfLIS(nums) {\n  // Return the LIS length.\n  \n}`,
    fn:'lengthOfLIS', cases:[{args:[[10,9,2,5,3,7,101,18]],expected:4},{args:[[0,1,0,3,2,3]],expected:4},{args:[[7,7,7]],expected:1}],
    test:'lengthOfLIS([10,9,2,5,3,7,101,18]) → 4', values:[1,1,1,2,2,3,4,4], labels:['10','9','2','5','3','7','101','18']
  },
  {
    id:'longest-common-subsequence', title:'Longest Common Subsequence', difficulty:'Medium', time:'40 min', pattern:'2D String DP',
    prompt:'Return the length of the longest subsequence that appears in both strings.',
    example:'Input: "abcde", "ace"     Output: 3',
    state:'dp[i][j] = LCS length for prefixes text1[0..i) and text2[0..j)', transition:'match → 1 + diagonal; mismatch → max(top, left)', base:'empty prefix row and column = 0',
    hints:['Use one axis for each string.', 'Matching characters extend the best answer before both characters.', 'On a mismatch, discard one current character and keep the better result.'],
    code:`function longestCommonSubsequence(text1, text2) {\n  // Return the LCS length.\n  \n}`,
    fn:'longestCommonSubsequence', cases:[{args:['abcde','ace'],expected:3},{args:['abc','abc'],expected:3},{args:['abc','def'],expected:0}],
    test:'longestCommonSubsequence("abcde", "ace") → 3', values:[0,0,0,0,1,1,0,1,2,0,1,2,3], labels:['∅','a','c','e','a/a','a/c','a/e','c/a','c/c','c/e','e/a','e/c','e/e']
  },
  {
    id:'edit-distance', title:'Edit Distance', difficulty:'Medium', time:'45 min', pattern:'2D String DP',
    prompt:'Return the minimum insertions, deletions, and replacements needed to turn word1 into word2.',
    example:'Input: "horse", "ros"     Output: 3',
    state:'dp[i][j] = edits to convert first i chars into first j chars', transition:'match → diagonal; else 1 + min(insert, delete, replace)', base:'dp[i][0] = i and dp[0][j] = j',
    hints:['Use prefixes of both words as the two dimensions.', 'If final characters match, no new edit is needed.', 'Otherwise choose the cheapest neighboring operation and add one.'],
    code:`function minDistance(word1, word2) {\n  // Return the minimum edit count.\n  \n}`,
    fn:'minDistance', cases:[{args:['horse','ros'],expected:3},{args:['intention','execution'],expected:5},{args:['','abc'],expected:3}],
    test:'minDistance("horse", "ros") → 3', values:[0,1,2,3,1,1,2,2,2,2,1,2], labels:['∅','r','o','s','h','h/r','h/o','h/s','o','o/r','o/o','o/s']
  },
  {
    id:'word-break', title:'Word Break', difficulty:'Medium', time:'30 min', pattern:'Prefix Segmentation',
    prompt:'Given a string and dictionary, return whether the string can be segmented into a sequence of dictionary words.',
    example:'Input: "leetcode", ["leet","code"]     Output: true',
    state:'dp[i] = whether prefix s[0..i) can be segmented', transition:'dp[i] = any dp[j] where s[j..i) is in the dictionary', base:'dp[0] = true',
    hints:['Try every possible final word of a prefix.', 'A word only helps if everything before it was already segmentable.', 'Use a Set for dictionary membership.'],
    code:`function wordBreak(s, wordDict) {\n  // Return whether the string can be segmented.\n  \n}`,
    fn:'wordBreak', cases:[{args:['leetcode',['leet','code']],expected:true},{args:['applepenapple',['apple','pen']],expected:true},{args:['catsandog',['cats','dog','sand','and','cat']],expected:false}],
    test:'wordBreak("leetcode", ["leet","code"]) → true', values:['T','F','F','F','T','F','F','F','T'], labels:['∅','l','le','lee','leet','leetc','leetco','leetcod','leetcode']
  },
  {
    id:'palindromic-substrings', title:'Palindromic Substrings', difficulty:'Medium', time:'30 min', pattern:'Interval DP',
    prompt:'Return the number of substrings that read the same forward and backward.',
    example:'Input: "aaa"     Output: 6',
    state:'dp[l][r] = whether s[l..r] is a palindrome', transition:'s[l] == s[r] and (length ≤ 2 or dp[l + 1][r − 1])', base:'every single character is a palindrome',
    hints:['Build from short intervals toward longer intervals.', 'The two ends must match.', 'If the ends match, ask whether the inside interval is already a palindrome.'],
    code:`function countSubstrings(s) {\n  // Return the number of palindromic substrings.\n  \n}`,
    fn:'countSubstrings', cases:[{args:['abc'],expected:3},{args:['aaa'],expected:6},{args:['abba'],expected:6}],
    test:'countSubstrings("aaa") → 6', values:[1,2,3,4,5,6], labels:['a₁','a₂','a₃','aa₁','aa₂','aaa']
  },
  {
    id:'stock-cooldown', title:'Best Time to Buy & Sell with Cooldown', difficulty:'Medium', time:'40 min', pattern:'State Machine DP',
    prompt:'Return the maximum stock profit when you may complete many transactions but must wait one day after selling before buying again.',
    example:'Input: [1,2,3,0,2]     Output: 3',
    state:'hold, sold, rest = best profit in each end-of-day state', transition:'hold=max(hold, rest−price); sold=hold+price; rest=max(rest,sold)', base:'hold = −price[0], sold = −∞, rest = 0',
    hints:['The constraint is about your state at the end of each day.', 'Track holding, just sold, and resting separately.', 'You may buy only from rest—not from the just-sold state.'],
    code:`function maxProfit(prices) {\n  // Return the maximum profit with cooldown.\n  \n}`,
    fn:'maxProfit', cases:[{args:[[1,2,3,0,2]],expected:3},{args:[[1]],expected:0},{args:[[2,1,4]],expected:3}],
    test:'maxProfit([1,2,3,0,2]) → 3', values:[0,1,2,2,3], labels:['$1','$2','$3','$0','$2']
  },
  {
    id:'burst-balloons', title:'Burst Balloons', difficulty:'Hard', time:'55 min', pattern:'Interval DP',
    prompt:'Burst balloons in any order. Bursting i earns left × nums[i] × right using its current neighbors. Return the maximum coins.',
    example:'Input: [3,1,5,8]     Output: 167',
    state:'dp[l][r] = max coins from bursting the open interval (l, r)', transition:'choose k last: dp[l][k] + val[l]·val[k]·val[r] + dp[k][r]', base:'empty interval = 0; pad both ends with 1',
    hints:['Choosing the first balloon is messy because neighbors change.', 'Reverse the decision: choose which balloon is burst last in an interval.', 'When k is last, its neighbors are the fixed interval boundaries.'],
    code:`function maxCoins(nums) {\n  // Return the maximum obtainable coins.\n  \n}`,
    fn:'maxCoins', cases:[{args:[[3,1,5,8]],expected:167},{args:[[1,5]],expected:10},{args:[[]],expected:0}],
    test:'maxCoins([3,1,5,8]) → 167', values:[0,3,8,30,35,40,159,167], labels:['empty','[3]','[1]','[5]','pair','triple','choice','all']
  }
]

const defaultProgress = { xp: 120, streak: 3, solved: ['climbing-stairs'], reviews: 2 }

function App() {
  const [view, setView] = useState('dashboard')
  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem('statecraft-progress')) || defaultProgress } catch { return defaultProgress }
  })
  const [selected, setSelected] = useState(problems[1])
  useEffect(() => localStorage.setItem('statecraft-progress', JSON.stringify(progress)), [progress])

  const start = (problem = problems.find(p => !progress.solved.includes(p.id)) || problems[0]) => { setSelected(problem); setView('practice'); window.scrollTo(0, 0) }
  const complete = (id) => setProgress(p => {
    const firstSolve = !p.solved.includes(id)
    return { ...p, xp: p.xp + (firstSolve ? 40 : 10), solved: [...new Set([...p.solved, id])], reviews: Math.min(problems.length, p.reviews + 1) }
  })

  return <div className="app-shell">
    <Sidebar view={view} setView={setView} progress={progress} />
    <main className="main">
      {view === 'dashboard' && <Dashboard progress={progress} start={start} />}
      {view === 'practice' && <Practice problem={selected} complete={complete} goHome={() => setView('dashboard')} />}
      {view === 'review' && <Review problems={problems} progress={progress} start={start} />}
    </main>
  </div>
}

function Sidebar({ view, setView, progress }) {
  const items = [
    ['dashboard', LayoutDashboard, 'Dashboard'], ['practice', Code2, 'Practice'], ['review', RotateCcw, 'Review queue']
  ]
  return <aside className="sidebar">
    <button className="brand" onClick={() => setView('dashboard')} aria-label="Statecraft home">
      <span className="brand-mark"><BrainCircuit size={22}/></span><span>statecraft</span>
    </button>
    <nav>{items.map(([key, Icon, label]) => <button key={key} className={view === key ? 'active' : ''} onClick={() => setView(key)}><Icon size={19}/><span>{label}</span>{key === 'review' && <b>{progress.reviews}</b>}</button>)}</nav>
    <div className="sidebar-card">
      <div className="mini-icon"><Flame size={18}/></div>
      <strong>{progress.streak} day streak</strong>
      <p>One focused problem keeps it alive.</p>
      <div className="week-dots">{['M','T','W','T','F'].map((d,i)=><span key={i} className={i < progress.streak ? 'done' : ''}>{i < progress.streak ? <Check size={12}/> : d}</span>)}</div>
    </div>
    <div className="profile"><span>AR</span><div><strong>DP Explorer</strong><small>{progress.xp} XP earned</small></div></div>
  </aside>
}

function Dashboard({ progress, start }) {
  const pct = Math.round(progress.solved.length / problems.length * 100)
  const recommended = problems.find(p => !progress.solved.includes(p.id)) || problems[0]
  const tracks = [
    { name: 'Foundations', copy: 'Define a state and reuse earlier answers.', problems: problems.slice(0, 5) },
    { name: 'Grids & Knapsack', copy: 'Add dimensions and take-or-skip decisions.', problems: problems.slice(5, 9) },
    { name: 'Sequences & Strings', copy: 'Compare prefixes, subsequences, and intervals.', problems: problems.slice(9, 14) },
    { name: 'Advanced States', copy: 'State machines and interval optimization.', problems: problems.slice(14) }
  ]
  return <>
    <header className="topline"><div><span className="eyebrow">Your learning path</span><h1>Make dynamic programming<br/><em>feel predictable.</em></h1><p>Learn to see the state, write the transition, and trust the table—one carefully chosen problem at a time.</p></div><div className="level-ring" style={{'--p': `${Math.max(12,pct)}%`}}><div><strong>{progress.solved.length}</strong><span>of {problems.length}</span></div></div></header>
    <section className="stats-grid">
      <article><span className="stat-icon amber"><Flame/></span><div><small>Current streak</small><strong>{progress.streak} days</strong></div></article>
      <article><span className="stat-icon purple"><Sparkles/></span><div><small>Experience</small><strong>{progress.xp} XP</strong></div></article>
      <article><span className="stat-icon green"><Target/></span><div><small>DP confidence</small><strong>{pct || 18}%</strong></div></article>
    </section>
    <section className="focus-card">
      <div className="focus-copy"><span className="tag">Recommended next</span><div className="difficulty"><span/> {recommended.difficulty} · {recommended.pattern}</div><h2>{recommended.title}</h2><p>{recommended.prompt}</p><div className="skill-chips"><span>State definition</span><span>Transition</span><span>Base case</span></div><button className="primary" onClick={() => start(recommended)}>Start guided session <ArrowRight size={18}/></button></div>
      <div className="focus-visual"><div className="visual-label">Today's mental model</div><p>Turn the prompt into three sentences:</p><div className="model-preview"><div><small>STATE</small><code>{recommended.state}</code></div><div><small>TRANSITION</small><code>{recommended.transition}</code></div><div><small>BASE</small><code>{recommended.base}</code></div></div></div>
    </section>
    <section className="section-head"><div><span className="eyebrow">16 guided problems</span><h2>Build the instinct in layers</h2></div><p>Four focused tracks—from your first recurrence to interval DP.</p></section>
    <div className="curriculum">{tracks.map(track => <section className="track" key={track.name}><div className="track-head"><div><span>{track.name}</span><p>{track.copy}</p></div><b>{track.problems.filter(p=>progress.solved.includes(p.id)).length}/{track.problems.length}</b></div><div className="problem-list">{track.problems.map(p=>{const i=problems.indexOf(p);return <button key={p.id} onClick={()=>start(p)}><span className={`number ${progress.solved.includes(p.id) ? 'complete':''}`}>{progress.solved.includes(p.id)?<Check size={18}/>:String(i+1).padStart(2,'0')}</span><div><small>{p.pattern}</small><strong>{p.title}</strong></div><span className={`level level-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span><span className="time"><Clock3 size={15}/>{p.time}</span><ChevronRight size={20}/></button>})}</div></section>)}</div>
  </>
}

function Practice({ problem, complete, goHome }) {
  const [phase, setPhase] = useState(0)
  const [hint, setHint] = useState(0)
  const [answer, setAnswer] = useState('')
  const [code, setCode] = useState(problem.code)
  const [runState, setRunState] = useState('idle')
  const [resultMessage, setResultMessage] = useState('')
  const [note, setNote] = useState('')
  useEffect(()=>{ setPhase(0); setHint(0); setAnswer(''); setCode(problem.code); setRunState('idle') },[problem])
  const run = () => {
    setRunState('running')
    setResultMessage('')
    setTimeout(() => {
      try {
        const solution = new Function(`"use strict";\n${code}\nreturn ${problem.fn};`)()
        if (typeof solution !== 'function') throw new Error(`Define a function named ${problem.fn}.`)
        for (const test of problem.cases) {
          const actual = solution(...structuredClone(test.args))
          if (!Object.is(actual, test.expected)) {
            setResultMessage(`Expected ${JSON.stringify(test.expected)} for ${problem.fn}(${test.args.map(x => JSON.stringify(x)).join(', ')}), but received ${JSON.stringify(actual)}.`)
            setRunState('fail')
            return
          }
        }
        setResultMessage(`${problem.cases.length} test cases passed.`)
        setRunState('pass')
      } catch (error) {
        setResultMessage(error instanceof Error ? error.message : 'Your solution could not be executed.')
        setRunState('fail')
      }
    }, 450)
  }
  const finish = () => { complete(problem.id); setPhase(3) }
  return <div className="practice-page">
    <div className="practice-nav"><button className="text-btn" onClick={goHome}><ChevronLeft/> Dashboard</button><div className="phase-dots">{['Frame','Model','Code','Reflect'].map((x,i)=><span className={i<=phase?'on':''} key={x}><b>{i+1}</b>{x}</span>)}</div><span className="xp-pill">+40 XP</span></div>
    <div className="practice-layout">
      <section className="problem-pane">
        <div className="problem-meta"><span className="medium">{problem.difficulty}</span><span>{problem.pattern}</span><span><Clock3 size={14}/>{problem.time}</span></div>
        <h1>{problem.title}</h1><p className="prompt">{problem.prompt}</p><pre className="example">{problem.example}</pre>
        {phase === 0 && <div className="work-card"><span className="step-label">Before touching code</span><h3>What makes this a DP problem?</h3><p>Write what repeats when you try every possible choice.</p><textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="I notice the same smaller problem appears when…"/><button className="primary" disabled={!answer.trim()} onClick={()=>setPhase(1)}>Lock in my thinking <ArrowRight size={17}/></button></div>}
        {phase === 1 && <ModelBuilder problem={problem} onNext={()=>setPhase(2)} />}
        {phase >= 2 && <div className="concept-sheet"><div><small>STATE</small><code>{problem.state}</code></div><div><small>TRANSITION</small><code>{problem.transition}</code></div><div><small>BASE CASE</small><code>{problem.base}</code></div></div>}
        <div className="hint-box"><div><Lightbulb size={18}/><strong>Stuck, not failing.</strong><span>Hints reveal one idea at a time.</span></div>{hint>0&&<p>{problem.hints[hint-1]}</p>}<button onClick={()=>setHint(Math.min(3,hint+1))} disabled={hint===3}>{hint === 0 ? 'Give me a nudge' : hint===3 ? 'All hints revealed' : `Reveal hint ${hint+1} of 3`}</button></div>
      </section>
      <section className="workspace-pane">
        {phase < 2 ? <DPVisualizer problem={problem}/> : phase === 3 ? <Reflection note={note} setNote={setNote} goHome={goHome}/> : <>
          <div className="editor-top"><span><Code2 size={16}/> solution.js</span><button onClick={()=>setCode(problem.code)}><RotateCcw size={15}/> Reset</button></div>
          <textarea className="editor" spellCheck="false" value={code} onChange={e=>setCode(e.target.value)}/>
          <div className="testbar"><code>{problem.test}</code><button className="run-btn" onClick={run}><Play size={16}/>{runState==='running'?'Running…':'Run tests'}</button></div>
          {runState==='pass'&&<div className="result pass"><Check/> {resultMessage} Nice work.<button onClick={finish}>Reflect <ArrowRight size={15}/></button></div>}
          {runState==='fail'&&<div className="result fail"><X/> {resultMessage}</div>}
        </>}
      </section>
    </div>
  </div>
}

function ModelBuilder({problem,onNext}) {
  const [open,setOpen]=useState(0)
  const rows=[['1. Define the state','What does one cell mean?',problem.state],['2. Find the transition','How do smaller answers combine?',problem.transition],['3. Anchor the base case','What do you already know?',problem.base]]
  return <div className="model-builder"><span className="step-label">Build the recurrence</span><h3>Turn the story into three precise sentences.</h3>{rows.map((r,i)=><button key={r[0]} onClick={()=>setOpen(Math.max(open,i+1))} className={open>i?'revealed':''}><span>{open>i?<Check size={16}/>:i+1}</span><div><strong>{r[0]}</strong><small>{open>i?r[2]:r[1]}</small></div></button>)}<button className="primary" disabled={open<3} onClick={onNext}>Open code workspace <ArrowRight size={17}/></button></div>
}

function DPVisualizer({problem}) {
 const [step,setStep]=useState(2); const max=problem.values.length-1
 return <div className="viz"><div className="viz-head"><div><span className="step-label">Table simulator</span><h3>Watch the answer grow</h3></div><span>{step+1} / {problem.values.length}</span></div><div className="cells">{problem.values.map((v,i)=><div key={i} className={`${i===step?'current':''} ${i>step?'future':''}`}><small>{problem.labels[i]}</small><strong>{i<=step?v:'?'}</strong><span>dp[{i}]</span></div>)}</div><div className="viz-explain"><BrainCircuit/><div><small>CURRENT STATE</small><p>{step<2?'Base cases give us somewhere solid to start.':<>Combine earlier answers to get <b>dp[{step}] = {problem.values[step]}</b>.</>}</p></div></div><div className="viz-controls"><button disabled={step===0} onClick={()=>setStep(step-1)}><ChevronLeft/></button><span>Step through the table</span><button disabled={step===max} onClick={()=>setStep(step+1)}><ChevronRight/></button></div></div>
}

function Reflection({note,setNote,goHome}) { return <div className="reflection"><span className="trophy"><Trophy/></span><span className="step-label">Session complete</span><h2>Make the insight stick.</h2><p>In your own words, what clue will help you recognize this pattern next time?</p><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="When I see a choice at each position…"/><div className="saved"><Check size={16}/> Saved locally for your review queue</div><button className="primary" onClick={goHome}>Back to dashboard <ArrowRight size={17}/></button></div> }

function Review({problems,progress,start}) { return <div className="review-page"><span className="eyebrow">Spaced repetition</span><h1>Your review queue</h1><p>Revisit the mental model before the code fades. Explain the recurrence out loud, then solve it cleanly.</p><div className="review-grid">{problems.slice(0,progress.reviews).map((p,i)=><article key={p.id}><div><span className={i===0?'due':'soon'}>{i===0?'Due today':'Due tomorrow'}</span><CircleHelp size={20}/></div><small>{p.pattern}</small><h2>{p.title}</h2><p>{p.state}</p><button onClick={()=>start(p)}>Start review <ArrowRight size={16}/></button></article>)}</div></div> }

createRoot(document.getElementById('root')).render(<App />)
