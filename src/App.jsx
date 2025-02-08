import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import EventForm from './components/EventForm'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   <EventForm/>
    </>
  )
}

export default App
