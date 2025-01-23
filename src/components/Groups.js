import { serverUrl } from '../lib/actions'
import React, { useState, useEffect } from 'react'

const Groups = ({ handleUser }) => {

    const [groupName, setGroupName] = useState("")
    const [groups, setgroups] = useState()

    const getGroups = async () => {
        try {
            const response = await fetch(serverUrl().concat('/getgroups'), {
                method: 'GET',
                headers: {
                    "Content-Type" : "application/json"
                }

            })
            const data = await response.json()
            setgroups(data.groups)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async () => {
        try {
            const response = await fetch(serverUrl().concat('/creategroup'), {
                method: 'PUT',
                headers: {
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    groupName
                })
            })
            if(response.ok){
                alert("Group Created")
            }
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
      getGroups()    
    }, [])
    

    return (
        <div >
            <div className='selecthead'>
                Chatt Rooms
            </div>

            <div>
                <div className='creategroup'>
                    Create Chatt Room
                    <input type="text" className='grname' placeholder='Enter Chatt Room Name' value={groupName} onChange={(e) => setGroupName(e.target.value)} />

                    <button onClick={handleSubmit}>Create Room</button>
                </div>
                <div>
                    List of Chatt Rooms
                    <div>
                        {
                            groups && groups.map((group, index) => (
                                <div onClick={()=>handleUser(group)} key={index} className='user'>{group.groupName}</div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Groups
