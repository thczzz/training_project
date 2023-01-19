import React from 'react'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { Outlet } from 'react-router-dom'

function Patient (){

    console.log('render Patient')

    return (    
        <div className="App">
            <div className="AppGlass">
                <Sidebar context="Patient"/>
                <Outlet />
                <div></div>
            </div>
        </div>
    )
}

export default Patient