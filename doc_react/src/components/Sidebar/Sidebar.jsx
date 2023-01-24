import React from 'react'
import './Sidebar.css'
import Logo from '../../imgs/logo.png'
import { motion } from 'framer-motion'
import {useState} from 'react';
import { SidebarDataDoc, SidebarDataPatient } from '../../Data/Data'
import { UilSignOutAlt, UilBars } from "@iconscout/react-unicons";
import { Link } from 'react-router-dom';

export const Sidebar = ({context}) => {

    const [selected, setSelected] = useState(0)
    const [expanded, setExpanded] = useState(false)
    let sideBarItems;

    const sidebarVariants = {
        true:{
            left: '0'
        },
        false:{
            left: '-60%'
        }
    }

    if (context === "Patient") {
        sideBarItems = SidebarDataPatient
    } else {
        sideBarItems = SidebarDataDoc
    }

  return (
    <>
        <motion.div className="Sidebar"
            variants={sidebarVariants}
            animate={window.innerWidth<=768 ? `${expanded}` : ''}
        >
            <div 
                className='bars' 
                style={expanded ? {left: '57%'} : {left: '5%'}}
                onClick={() => setExpanded(!expanded)}
            >
                <UilBars/>
            </div>
            {/* logo */}
            <div className="logo">
                <img src={Logo} alt="" />
                <span>
                    Doc<span>App</span>
                </span>
            </div>

            {/* menu*/}
            <div className="menu">
                {sideBarItems.map((item, index) => {
                    return (
                        <div 
                            className={selected === index ? 'menuItem active' : 'menuItem'}
                            key={index}
                            onClick={() => setSelected(index)}
                        >
                            <Link to={item.url} replace>
                            
                                <item.icon />
                                <span>
                                    {item.heading}
                                </span>
                            </Link>
                        </div>
                    )
                })}

                <div className="menuItem">
                    <Link to="/logout" replace>
                        <UilSignOutAlt/>
                        <span>
                            Sign Out
                        </span>
                    </Link>
                </div>
            </div>
        </motion.div>
    </>
  )
}
