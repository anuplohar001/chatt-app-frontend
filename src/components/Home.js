import React, {useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
const Home = () => {
  const navigate = useNavigate()
  useEffect(() => {
    if (localStorage.getItem('username'))
      navigate('/chattapp')

  }, [])
  return (
    <div>
        <Link to='/login'>
          <div className='home'>Login to access Chatt App</div>              
        </Link>
    </div>
  )
}

export default Home
