import React from 'react'
import './App.scss'
import Settings from './setting/Settings'

const App: React.FC = () => {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div 
        style={{
          height: '100%',
          overflowY: 'auto'
        }}
      >
        <Settings />
      </div>
    </div>
  )
}

export default App