import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import SideBar from './component/SideBar/SideBar'
import {Routes, Route } from 'react-router-dom'
import Dashboard from './component/DashBoard/Dashboard'
import History from './component/History/History'
import Admin from './component/Admin/Admin'
import Login from './component/Login/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <SideBar />
      <Routes>
        <Route path='/' element={<Login/>} />
        {/* <Route path='/' element={<div>Home</div>} /> */}
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/admin' element={<Admin/>} />
        <Route path='/history' element={<History/>} />
      </Routes>
    </div>
  )
}

export default App
