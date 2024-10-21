import { useNavigate } from 'react-router-dom'
import React from 'react'
import '../assets/css/home.css'

const Home = () => {
    const navigate = useNavigate()
  return (
    <>
      <div className='Homecontainer'>
      <h1>This is home </h1>
      <button onClick={() => navigate('/signup')}>Go to Signup</button>
      <button onClick={() => navigate('/login')}>Login</button>

    </div>
    
    </>
  )
}

export default Home
