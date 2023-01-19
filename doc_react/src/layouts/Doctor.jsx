import React from 'react'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { Outlet } from 'react-router-dom'

function Doctor () {

    console.log('render Doc')

    return (    
        <div className="App">
            <div className="AppGlass">
                <Sidebar context="Doctor"/>
                <Outlet />
                <div></div>
            </div>
        </div>
    )
}

export default Doctor