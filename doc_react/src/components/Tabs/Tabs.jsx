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
            title: 'Title 1',
            content: 'Las tabs se generan automáticamente a partir de un array de objetos, el cual tiene las propiedades: id, tabTitle, title y content.'
        },
        {
            id: 2,
            tabTitle: 'New Perscription',
            icon: UilPrescriptionBottle,
            form: Perscription,
            title: 'Title 2',
            content: 'Contenido de tab 2.'
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
                    <div className="form" key={i}>
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