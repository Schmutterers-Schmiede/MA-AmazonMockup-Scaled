import { useRef, useState } from 'react'
import BottomNav from './components/BottomNav'
import Header from './components/Header'
import Home from './pages/Home'
import You from './pages/You'
import Basket from './pages/Basket'
import Browse from './pages/Browse'
import Rufus from './pages/Rufus'
import { getContext, nextUrl, INSTRUCTIONS } from './tallyFlow'
import { InstructionsOverlay } from './InstructionsOverlay'
import { GRIP_IMAGES } from './gripImages';

export type Tab = 'home' | 'you' | 'basket' | 'browse' | 'rufus'

declare global {
  interface Window {
    Tally: any
  }
}

const MOCKUP_W = 390
const MOCKUP_H = 844
const SCALE = 0.8

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [showInstructions, setShowInstructions] = useState(true)
  const [hasVisitedRufus, setHasVisitedRufus] = useState(false)

  const startTimeRef = useRef<number>(Date.now())
  const timeToRufusRef = useRef<number | null>(null)
  const ctx = getContext();

  function handleStart() {
    startTimeRef.current = Date.now() // timer starts here, not on page load
    timeToRufusRef.current = null
    setHasVisitedRufus(false)
    setShowInstructions(false)
  }

  function handleTabChange(tab: Tab) {
    setActiveTab(tab)
    if (tab === 'rufus' && !showInstructions && timeToRufusRef.current === null) {
      timeToRufusRef.current = Date.now() - startTimeRef.current
      setHasVisitedRufus(true)
    }
  }

  function handleRateClick() {
    const ctx = getContext()
    // Falls back to time-since-start if they never completed the task,
    // so we still capture something rather than sending null.
    const elapsed = timeToRufusRef.current ?? (Date.now() - startTimeRef.current)

    window.Tally.openPopup('gD17jO', {
      layout: 'modal',
      hiddenFields: {
      pid: ctx.pid,
      pair: ctx.pair,
      variant: ctx.variant,
      step: ctx.step,
      elapsed_ms: elapsed,
      grip_type: ctx.grip,
      preference_step: ctx.preferenceStep, // 'skip' | 'two_way' | 'three_way'
    },
      onSubmit: () => {
        window.location.href = nextUrl(ctx)
      },
    })
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'home': return <Home />
      case 'you': return <You />
      case 'basket': return <Basket />
      case 'browse': return <Browse />
      case 'rufus': return <Rufus />
    }
  }

  const showHeader = activeTab !== 'rufus'

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#111317',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Scaled mockup anchored to bottom-left — this represents the actual
          one-handed-mode interface being evaluated. */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: MOCKUP_W,
          height: MOCKUP_H,
          transform: `scale(${SCALE})`,
          transformOrigin: 'bottom left',
          overflow: 'hidden',
          borderTopRightRadius: 12,
          boxShadow: '4px -4px 40px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Amazon Ember', Arial, sans-serif",
        }}
      >
        {showHeader && <Header activeTab={activeTab} />}
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', backgroundColor: '#EAEDED' }}>
          {renderPage()}
        </main>
        <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />
      </div>

      {/* Rate this prototype — this is testing UI, not part of the docked
          interface, so it lives in the outer full-screen container, placed
          away from the mockup which is anchored bottom-left. */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={handleRateClick}
          disabled={!hasVisitedRufus}
          className={`text-sm font-bold px-7 py-3 rounded-full transition-all ${
            hasVisitedRufus
              ? 'bg-blue-500 text-white shadow-[0_4px_20px_rgba(59,130,246,0.6)] active:scale-95'
              : 'bg-gray-300 text-gray-400 cursor-not-allowed'
          }`}
        >
          Done testing — Rate this
        </button>
      </div>

      {/* Instructions overlay, shown until participant taps Start.
          Covers the full outer screen, same as every other prototype. */}
      {showInstructions && (
        <InstructionsOverlay
          title={INSTRUCTIONS.control_center.title}
          instructions={INSTRUCTIONS.control_center.text}
          onStart={handleStart}
          gripImage={GRIP_IMAGES[ctx.grip]}
        />
      )}
    </div>
  )
}