import React from 'react'
import { Link } from 'react-router-dom'
const Home = () => {
  return (
    <div>
        <Link to='/login'>
          <div className='home'>Login to access Chatt App</div>              
        </Link>
    </div>
  )
}

export default Home
