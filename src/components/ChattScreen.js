import React, { useState, useEffect } from 'react'
import { serverUrl } from '../lib/actions.js'
import socket from '../lib/socket.js'
const ChattScreen = ({ selectedUser, fromUser, onlineUsers, onlineMembers }) => {

    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState([])
    const [user, setUser] = useState('anuph')
    const [typing, settyping] = useState()
    const getMessages = async () => {
        const response = await fetch(serverUrl().concat('/messages'), {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        })
        const olddata = await response.json();
        // console.log(olddata)
        await olddata.messages.sort((a, b) => new Date(a.date) - new Date(b.date));
        setMessages(olddata.messages)
    }

    const handleTyping = (type) => {
        
        if(selectedUser.username) {
            if (selectedUser.username === type.from && fromUser.username === type.toUser) {
                return true
            }
            else {
                return false
            }
        } else {
            if(selectedUser.groupName === type.toUser) {
                if(type.from === fromUser.username) {
                    return false
                }
                return true
            } else {
                return false
            }
        }
    }

    const sendMessage = () => {
        let isUser = false
        if(selectedUser.username)
            isUser = true
        const msg = { from: fromUser._id, to: selectedUser._id, content: message, isUser }
        socket.emit("sendMessage", msg)
        setMessage('')
        // handleStopTyping();
    }

    const processDate = (olddate) => {

        let dateTime = olddate.substring(0, olddate.length - 3);
        const [date, time] = dateTime.split(" ");
        const [year, month, day] = date.split("-");
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        const formattedDateTime = `${time} ${day} ${monthNames[parseInt(month) - 1]}`;
        return formattedDateTime
    }

    const handleClass = (msg) => {
        if(msg.to) {
            if(selectedUser._id === msg.to._id)
                return true
            else
                return false
        } else {
            if(fromUser._id === msg.from._id)
                return true
            else
                return false
        }
    }

    const handleChange = (e) => {        
        setMessage(e.target.value)
        socket.emit('user-typing', {
            toUser: (selectedUser.username ? selectedUser.username : selectedUser.groupName),
            from: fromUser.username            
        })
    }

    useEffect(() => {
        getMessages()
        socket.on("receiveMessage", (data) => {
            setMessages((prev)=>[
                ...prev,
                data
            ])
        })

        socket.on('started', (data) => {            
            settyping(data)
            console.log(data)
            setTimeout(() => {
                settyping()
            }, 2000);
        })

        return () => {
            console.log("disconnected")
            socket.off()
        }
    }, [])

    useEffect(() => {
        getMessages()
    }, [selectedUser.username])

    useEffect(() => {
        getMessages()
    }, [fromUser.username])



    return (
        <div className='screen'>
            <div className='screenuser'>
                {fromUser.username ? fromUser.username : fromUser.groupName}
                {" "} and {" "}
                {selectedUser.username ? selectedUser.username : selectedUser.groupName}
            </div>

            <div className='messages'>
                <div className='onlineusers'>
                    Online Users
                    <div>
                        {
                            selectedUser.username ? (<div>
                                {
                                    onlineUsers && onlineUsers.map((user, index) => (
                                        <div key={index}>
                                            {
                                                user && user.liveUser.map((liveU, index2) => (

                                                    <div key={index2} className={
                                                        selectedUser._id === user._id ? 'user' : undefined

                                                    }>{selectedUser._id === user._id && liveU.username}

                                                    </div>
                                                ))
                                            }
                                        </div>
                                    ))
                                }
                            </div>) : (<div>
                                {
                                    onlineMembers && onlineMembers.map((member, index) => (
                                        <div key={index}>
                                            {
                                                member && member.liveMembers.map((liveMember, index2) => (
                                                    <div key={index2} className={`${selectedUser._id === member._id ? "user" : undefined}`}>{selectedUser._id === member._id && liveMember.username}
                                                        {/* <div>{console.log(liveMember)}</div> */}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    ))
                                }
                            </div>)
                        }
                    </div>
                </div>
                <div>
                    Messages
                    <div className='msgcontainer'>
                        {
                            messages && messages.map && messages.map((msg, index) => (
                                <div key={index} className={`flex ${ handleClass(msg) ? "msgcontainersend" : "msgcontainerreceive"}`}>                                    
                                    {
                                        selectedUser.username ? ((fromUser._id === (msg.to ? msg.to._id : msg.toGroup._id) && selectedUser._id === msg.from._id) || 
                                        (fromUser._id === msg.from._id && selectedUser._id === (msg.to ? msg.to._id : msg.toGroup._id))) 
                                        && 
                                        (<div className={`msg 
                                        ${selectedUser._id === (msg.to._id) ? "msgsend" : "msgrecieve"}`} >
                                            <div>
                                                <div>
                                                    {msg.content}
                                                </div>
                                                <div className='fromuser'>
                                                    {msg.from.username} 
                                                </div>
                                                                                       
                                            </div>
                                        </div>) : (
                                            (selectedUser._id === (msg.toGroup && msg.toGroup._id)) 
                                                && (<div className={`msg ${fromUser._id === msg.from._id ? "msgsend" : "msgrecieve"}`}><div>
                                                    <div>
                                                        {msg.content}
                                                    </div>
                                                    <div className='fromuser'>
                                                        {msg.from.username}
                                                    </div>

                                                </div></div>))
                                    }
                                    
                                </div>
                            ))
                        }
                    </div>
                    <div>
                        {
                            typing && (handleTyping(typing)) && (<div className='typing'><i>{typing.from} is typing...</i></div>)
                        }
                    </div>
                </div>
            </div>
            <div className='flex'>
                <input className="message" placeholder='Enter your message' type="text" value={message} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} 
                onChange={handleChange } />
                {
                    message && (<button className='send' onClick={sendMessage}>Send</button>)
                }

            </div>
        </div>
    )
}

export default ChattScreen
