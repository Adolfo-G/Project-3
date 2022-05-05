import React from 'react';
import './Sidebar.css';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import SidebarChannel from './SidebarChannel';
import getChannels from './components/GetChannels';
import { Avatar } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useSelector } from 'react-redux';
import { selectUser } from './features/userSlice';
import db, { auth } from './firebase';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from './axios';

//import Pusher from 'pusher-js';
// const pusher = new Pusher('3a3001939979161ff763', {
//     cluster: 'us2'
//   });

const { io } = require("socket.io-client");
const socket = io.connect();


const Sidebar = () => {
    const user = useSelector(selectUser);
    const [channels, setChannels] = useState([]);

    const getChannels = () => {
        axios.get('/get/channelList')
            .then((res) => {
                setChannels(res.data);
            })
    };


    // trying to add delete
    const deleteChannel = (_id) => {

        axios.delete('/delete/channelList', {
            headers : {
                'Content-Type': 'application/json'
            },
            params : {
                id: _id
            }
        })
            .then( resp => {
                console.log(resp.message);
            })
            .catch( err => console.error );
    };
////Error channel.bind is not a function
    // useEffect(() => {
        
    //     getChannels();

    //     const channel = socket.emit('subscribe','channels');
    //     channel.bind('newChannel', function (data) {
    //         getChannels();

    //     });

    // }, []);

    const handleAddChannel = (e) => {
        e.preventDefault()

        const channelName = prompt('Enter a new channel name')

        if (channelName) {
            axios.post('/new/channel', {
                channelName: channelName
            })
        }
    };

    return (
        <div className='sidebar' >
            <div className="sidebar__top">
                <h3>Accord</h3>
                <ExpandMoreIcon />
            </div>

            <div className="sidebar__channels">
                <div className="sidebar__channelsHeader">
                    <div className="sidebar__header">
                        <ExpandMoreIcon />
                        <h4>Chat Channels</h4>
                    </div>

                    <AddIcon onClick={handleAddChannel} className='sidebar__addChannel' />
                </div>
                <div className="sidebar__channelsList">
                
                    {
                        
                        channels.map(channel => (
                            <SidebarChannel key={channel.id} id={channel.id} channelName={channel.name} />
                        ))
                    }
                </div>
            </div>

            <div className="sidebar__voice">
                <div className="sidebar__voiceInfo">
                    <h3>Connected</h3>
                    <p>To Chat</p>
                </div>

                <div className="sidebar__voiceIcons">

                </div>
            </div>
            <div className="sidebar__profile">
                
               <Avatar src={user.photo} />
                

                <div className="sidebar__profileInfo">
                    <h3>{user.displayName}</h3>
                    <p>#{user.uid.substring(0, 5)}</p>
                </div>

                <div className="sidebar__profileIcons">
                    <ExitToAppIcon onClick={() => auth.signOut()} />
                </div>
            </div>
        </div>
    )
}

export default Sidebar
