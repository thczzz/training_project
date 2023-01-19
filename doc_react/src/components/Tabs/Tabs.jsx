import React, { useState } from 'react';
import './Tabs.css'
import {
    UilPrescriptionBottle, // + Perscription
    UilBookMedical, // Add Examination
    UilTablets, // Drug
} from "@iconscout/react-unicons";
import Examination from '../DocForms/Examination';
import Perscription from '../DocForms/Perscription';

const Tabs = () => {

    const [currentTab, setCurrentTab] = useState('1');
    const tabs = [
        {
            id: 1,
            tabTitle: 'New Examination',
            icon: UilBookMedical,
            form: Examination,
        },
        {
            id: 2,
            tabTitle: 'New Perscription',
            icon: UilPrescriptionBottle,
            form: Perscription,
        },

    ];

    const handleTabClick = (e) => {
        setCurrentTab(e.target.id);
    }

    return (
        <div className='container'>
            <div className='tabs'>
                {tabs.map((tab, i) =>
                    <button 
                    key={i} id={tab.id} 
                    disabled={currentTab === `${tab.id}`} 
                    onClick={(handleTabClick)}
                    >
                        <tab.icon/>
                        {tab.tabTitle}
                    </button>
                )}
            </div>
            <div className='content'>
                {tabs.map((tab, i) =>
                    <div className="form" key={tab.tabTitle}>
                        {currentTab === `${tab.id}` && 
                           <tab.form/>
                        }
                    </div>
                )}
            </div>
        </div>
    );
}

export default Tabs;