import { useState } from 'react'
import BottomNav from './components/BottomNav'
import Header from './components/Header'
import Home from './pages/Home'
import You from './pages/You'
import Basket from './pages/Basket'
import Browse from './pages/Browse'
import Rufus from './pages/Rufus'

export type Tab = 'home' | 'you' | 'basket' | 'browse' | 'rufus'

const MOCKUP_W = 390
const MOCKUP_H = 844
const SCALE = 0.9

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home')

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
      {/* Scaled mockup anchored to bottom-left */}
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
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  )
}
