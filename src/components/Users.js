import React, { useState, useEffect } from 'react'
import { serverUrl } from '../lib/actions.js'
import ChattScreen from './ChattScreen.js'
import Groups from './Groups.js'
import socket from '../lib/socket.js'
import { useNavigate } from 'react-router-dom'
const Users = () => {

  const [users, setusers] = useState([])
  const navigate = useNavigate();
  const userjson = localStorage.getItem('username')
  const fromUser = JSON.parse(userjson)
  const [onlineUsers, setonlineUsers] = useState([{ _id: "6790920b85222e4c879172a7", username: "nitin", password: "nitin", liveUser: [{username:fromUser.username}] }])
  const [selectedUser, setselectedUser] = useState({ _id: "6790920b85222e4c879172a7", username: "nitin", password: "nitin", liveUser: [fromUser._id] })
  const [onlineMembers, setonlineMembers] = useState()

  const handleUser = (userOrGrp) => {

    setselectedUser(userOrGrp)
    const data = { liveUser: fromUser._id, userOrGrp }

    if (userOrGrp.username) {
      socket.emit("online-user", data)
    } else {
      socket.emit("chattroom-user", data)
    }
  }

  const getUsers = async () => {
     
    try {
      const response = await fetch(serverUrl().concat('/users'), {
        method: "GET",
        headers: {
          "Content-type": "application/json"
        }
      })
      if (response.ok) {
        const data = await response.json()
        setusers(data.users)
        // setonlineUsers(data.users)
      }
       

    } catch (error) {
      console.log(error)
       
    }
  }

  const getGroups = async () => {
    
    try {
      const response = await fetch(serverUrl().concat('/getgroups'), {
        method: "GET",
        headers: {
          "Content-type": "application/json"
        }
      })
      if (response.ok) {
        const data = await response.json()
        setonlineMembers(data.groups)
      }
       

    } catch (error) {
      console.log(error)
      
    }
  }

  const handleLogout = async () => {
    const data = localStorage.getItem('username')
    const user = await JSON.parse(data)
    const liveUser = user._id
    try {
      const response = await fetch(serverUrl().concat('/removelive'), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ liveUser })
      })
      if (response.ok) {
        localStorage.removeItem('username')
        navigate('/login')
      }
    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {
    getUsers()
    getGroups()

    const data = localStorage.getItem('username')
    const user = JSON.parse(data)
    if(user.username === 'nitin') {
      setselectedUser({ _id: "6790920185222e4c879172a4", username: "pratik", password: "pratik", liveUser: [] })
      setonlineUsers([{ _id: "6790920185222e4c879172a4", username: "pratik", password: "pratik", liveUser: [{ username: fromUser.username }] }])
    }
    socket.on('updated-users', (data) => {
      setonlineUsers(data.users)
      setonlineMembers(data.groups)
    })

  }, [])


  return (
    <div className='users'>
      
      <div>
        <span className='loginuser'>Logged in as {fromUser.username}</span>
        <button className='logout' onClick={handleLogout}>
          Logout
        </button>
        <div>
          If you want to login to another user 
          <br />
          then username and password will be same as username <br />
          E.g. username : 'omkar' password : 'omkar' 
        </div>
        <div className='usercontainer'>
          <div className='userlist'>
            <div className='allusers selecthead'>
              All Chats (users)
            </div>
            <div>
              {
                users.map((user, index) => (
                  <div onClick={() => handleUser(user)} key={index} >
                    {
                      user.username !== fromUser.username && (<div className='user'>{user.username}</div>)
                    }
                  </div>
                ))
              }
            </div>
          </div>
          <div>
            <Groups users={users} fromUser={fromUser} handleUser={handleUser} />
          </div>
        </div>

      </div>
      <div>
        <ChattScreen onlineMembers={onlineMembers} onlineUsers={onlineUsers} fromUser={fromUser} selectedUser={selectedUser} />
      </div>
    </div>
  )
}

export default Users
