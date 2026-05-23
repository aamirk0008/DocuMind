import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className="text-4xl font-bold text-center mt-10">Welcome to DocuMind</h1>
      <p className="text-center mt-4 text-lg">Your AI-powered document assistant</p>
      <div className="flex justify-center mt-10">
        <img src={heroImg} alt="DocuMind Hero" className="w-full max-w-2xl rounded-lg shadow-lg" />
      </div>
    </>
  )
}

export default App
