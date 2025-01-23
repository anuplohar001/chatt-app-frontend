import { serverUrl } from '../lib/actions';
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
const Login = () => {

    const navigate = useNavigate();
    const [flag, setflag] = useState(true)
    const [userDetails, setUserDetails] = useState({ username: "", password: "" })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCreateUser = async () => {
        try {
          const response = await fetch(serverUrl().concat('/createuser'), {
            method: "POST",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify({
              username: userDetails.username,
              password: userDetails.password
            })
          })
          if (response.ok) {
            alert('user Created')
            setUserDetails({ username: "", phoneNo: "" })
            setflag(true)
          }
    
        } catch (error) {
          console.log(error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(serverUrl().concat(`/login/${userDetails.username}`), {
                method:'GET',
                headers: {
                    "Content-Type" : "application/json"
                }
            })
            const data = await response.json()
            if (userDetails.username === data.user.username && userDetails.password === data.user.password) {
                localStorage.setItem('username', JSON.stringify(data.user))
                navigate("/chattapp")
            }
            else {
                alert("Invalid Credentials")
                setUserDetails({ username: "", password: "" })
            }

        } catch (error) {
            
        }
    }

    return (
        <div>
            <div className="container">
                User Login / Register
            </div>
            
            <div className="subtext">
                Username: pratik Password: pratik
            </div>
            <div>
                {
                    flag ? (<form onSubmit={handleSubmit} className="form-container">
                        <label htmlFor="Name" className="label">Username:
                            <input
                                name="username"
                                onChange={handleChange}
                                value={userDetails.username}
                                type="text"
                                placeholder="Username"
                                className="input"
                            />
                        </label>
                        <label htmlFor="Social Handle" className="label">Password:
                            <input
                                name="password"
                                onChange={handleChange}
                                value={userDetails.password}
                                type="text"
                                placeholder="Password"
                                className="input"
                            />
                        </label>
                        <button type="submit" className="button">
                            Continue to Dashboard
                        </button>
                        OR
                        <button onClick={()=>setflag(false)} className='button'>Register New User</button>
                    </form>) : (<div className='createuser'>
                        Create User
                        <input type="text" placeholder='Username' value={userDetails.username} onChange={(e) =>
                            setUserDetails((prevState) =>
                            ({
                                ...prevState,
                                username: e.target.value
                            }))} />
                        <input type="text" placeholder='Password' value={userDetails.password} onChange={(e) => setUserDetails((prevState) => ({ ...prevState, password: e.target.value }))} />
                        <button className='button' onClick={handleCreateUser}>Submit</button>
                        OR
                        <button className='button' onClick={()=>setflag(true)}>Login</button>
                    </div>)
                }
            </div>
            
        </div>

    )
}

export default Login
