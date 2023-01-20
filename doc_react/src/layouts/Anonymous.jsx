import React from 'react'
import { Outlet } from 'react-router-dom'

function Anonymous() {

    console.log('render Anonymous')

    return (    
        <div className="Auth">
            <Outlet />
        </div>
    )
}

export default Anonymous
