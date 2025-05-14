import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f4ff',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <h1 style={{ color: '#2a3af7', marginBottom: '20px' }}>Test React App</h1>
        <p style={{ color: '#4b5563', marginBottom: '20px' }}>
          This is a simple test app to check if React is rendering correctly.
        </p>
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setCount((count) => count + 1)}
            style={{
              backgroundColor: '#2a3af7',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Count is {count}
          </button>
        </div>
        <p style={{ color: '#4b5563' }}>
          If you can see this and the button works, React is rendering correctly.
        </p>
      </div>
    </div>
  )
}

export default App
