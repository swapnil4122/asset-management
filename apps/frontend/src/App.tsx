import { useState } from 'react'
import { Button, Input } from '@asset-mgmt/ui'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="card" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Asset Management Platform</h1>
      <div style={{ marginTop: '2rem' }}>
        <Input label="Username" placeholder="Enter your username" />
        <Button onClick={() => setCount((count) => count + 1)}>
          Clicks: {count}
        </Button>
      </div>
    </div>
  )
}

export default App
