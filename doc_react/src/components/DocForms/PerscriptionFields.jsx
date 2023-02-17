import React, { Fragment } from 'react'
import './AttachDrugs.css'
import './Forms.css'
import { SearchDrug } from './SearchDrug,'
import { uniqueID } from '../../Data/getData'

export function PerscriptionFields({drugs, setDrugs, perscriptionDescription, setPerscriptionDescription}) {

    function handleClick(ev) {
        ev.preventDefault();
        ev.target.classList.toggle("active");
        var content = ev.target.nextElementSibling;

        if (content.style.maxHeight){
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = '100%';
        } 
    }

    function handleAttach(ev, i) {
        ev.preventDefault();
        var errorFields = [];
        var textAreaGroup = ev.target.parentNode.previousElementSibling;
        var drugInputGroup = textAreaGroup.previousElementSibling;
        var textArea = textAreaGroup.children[1];
        var drugInput = drugInputGroup.children[0].children[1];

        if (drugInput.id === "") {
            errorFields.push([drugInputGroup, "Drug is a required field."])
        }
        if (textArea.value[0] === undefined) {
            errorFields.push([textAreaGroup, "Description is a required field."])
        }
        if (errorFields[0] !== undefined) {
            addErr(errorFields);
            setTimeout(() => {removeErr(errorFields)}, 3700);
            return false
        }

        const newState = [...drugs]
        newState[i] = {id: drugInput.id, description: textArea.value, title: drugInput.value};
        setDrugs(newState);
    }

    function addErr(groups) {
        groups.forEach(group => {
            group[0].classList.add('error')
            group[0].lastChild.textContent = group[1]
        })
    }

    function removeErr(groups) {
        groups.forEach(group => {
            group[0].classList.remove('error')
        })
    }

    function handleAdd() {
        setDrugs(prev => ( [...prev, {}] ))
    }

    function handleRemove(idx) {
        var newState = [...drugs];
        newState.splice(idx, 1);
        setDrugs(newState);
    }

    const drugContainer = (key, idx, disabled, obj) => {
        return <div key={key} id={key}> 
            <button 
                className="collapsible"
                name="drugContainerBtn" 
                onClick={handleClick}
            >
                {disabled ? obj.title : "New drug"}
            </button>
            <div className="collapsible-content" key="Drugs">
                <div className="group">
                    {disabled 
                    ? 
                        <Fragment >
                            <label htmlFor='Drug'>Drug*</label>
                            <input
                                className="searchFieldInput"
                                type="text"
                                id={obj.id}
                                key={key}
                                name="drug_id"
                                value={obj.title}
                                required
                                disabled
                            />
                        </Fragment>
                    : 
                        <SearchDrug
                            inputFieldLabel="Drug" 
                            url='http://localhost:3000/api/v1/doctors/search_drug/?name=' 
                            searchBy="drug name"
                        /> 
                    }
                    <div class="error-message">Drug is a required field.</div>
                </div>

                <div className='group'>
                    <label htmlFor='usage_description'>Description*</label>
                    <textarea 
                        cols={40} 
                        rows={3} 
                        name="usage_description" 
                        placeholder="Usage Description" 
                        defaultValue={disabled ? obj.description : ''}
                        disabled={disabled}
                        required
                    >
                    </textarea>
                    <div class="error-message">Description is a required field.</div>
                </div>
                <div>
                    {disabled
                    ?
                        <button
                            disabled
                            name="attachDrug"
                        >
                            Attached
                        </button>
                    :
                        <button
                            onClick={(ev) => handleAttach(ev, idx)}
                            name="attachDrug"
                        >
                            Attach this Drug
                        </button>
                    }
                    <button
                        id={key}
                        onClick={(ev) => {
                            ev.preventDefault();
                            handleRemove(idx);
                        }}
                        name="removeDrugContainerBtn"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    }

    return (
        <>
            <div className="group">
                <label for="description">Description*
                    <textarea 
                        rows="3" 
                        cols="30" 
                        name="description" 
                        value={perscriptionDescription}
                        onChange={(ev) => {setPerscriptionDescription(ev.target.value)}}
                        placeholder="Type something here..." 
                        required
                    >
                    </textarea>
                </label>
            </div>
            <div>
                <button 
                onClick={(ev) => {
                    ev.preventDefault();
                    handleAdd();
                }}
                name="addNewDrugBtn"
                >
                    Add new Drug
                </button>
            </div>
            <div className="drugsList">

                {drugs.map((obj, idx) => {
                    const key = uniqueID();
                    // const disabled = true ? obj.id !== undefined : false
                    const disabled = obj.id !== undefined ? true : false
                    return drugContainer(key, idx, disabled, obj)
                })}

            </div>
        </>
    )
}
