import React from 'react'
import './SearchSuggestions.css'
import { search_user } from '../../Data/getData';
import { SearchDrugTemplate } from './SearchDrugTemplate';

export function SearchDrug({inputFieldLabel, url, searchBy, inputId, setInputId}) {
    const [searchResults, setSearchResults] = React.useState([]);
    const [drug, setDrug] = React.useState("");
 
    const searchUser = search_user(url, setSearchResults, setInputId)

    const handleClick = (ev) => {
        ev.preventDefault();
        ev.target.parentNode.parentNode.children[1].value = ev.target.textContent
        setSearchResults([]);
        setInputId(ev.target.id);
    }
    
    return (
       <div>
        <SearchDrugTemplate 
            user={drug} 
            inputFieldLabel={inputFieldLabel} 
            searchBy={searchBy}
            inputId={inputId}
            searchUser={searchUser}
            searchResults={searchResults} 
            handleClick={handleClick}
        />
       </div>
     );
   }