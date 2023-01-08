import React from 'react'
import './Sidebar.css'
import Logo from '../../imgs/logo.png'

import {useState} from 'react';
import { SidebarDataDoc } from '../../Data/Data'
import { UilSignOutAlt } from "@iconscout/react-unicons";

export const Sidebar = () => {

    const [selected, setSelected] = useState(0)

  return (
    <div className="Sidebar">
        {/* logo */}
        <div className="logo">
            <img src={Logo} alt="" />
            <span>
                Doc<span>App</span>
            </span>
        </div>

        {/* menu*/}
        <div className="menu">
            {SidebarDataDoc.map((item, index) => {
                return (
                    <div className={selected === index ? 'menuItem active' : 'menuItem'}
                    key={index}
                    onClick={() => setSelected(index)}
                    >
                        <item.icon />
                        <span>
                            {item.heading}
                        </span>
                    </div>
                )
            })}

            <div className="menuItem">
                <UilSignOutAlt/>
                <span>
                    Sign Out
                </span>
            </div>
        </div>
    </div>
  )
}
