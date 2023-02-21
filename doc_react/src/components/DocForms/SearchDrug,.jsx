import React from 'react'
import './SearchSuggestions.css'
import { search_user } from '../../Data/getData';
import { SearchDrugTemplate } from './SearchDrugTemplate';

export function SearchDrug({inputFieldLabel, url, searchBy}) {
    const [searchResults, setSearchResults] = React.useState([]);

    const searchUser = search_user(url, setSearchResults)

    const handleClick = (ev) => {
        ev.preventDefault();
        // console.log(ev.target.parentNode.parentNode.children[1].id)
        // console.log(ev.target.parentNode.parentNode.children[1].value)

        ev.target.parentNode.parentNode.children[1].id = ev.target.id;
        ev.target.parentNode.parentNode.children[1].value = ev.target.textContent;

        // console.log(ev.target.parentNode.parentNode.children[1].id)
        // console.log(ev.target.parentNode.parentNode.children[1].value)

        setSearchResults([]);
    }
    
    return (
       <div>
        <SearchDrugTemplate
            inputFieldLabel={inputFieldLabel} 
            searchBy={searchBy}
            searchUser={searchUser}
            searchResults={searchResults} 
            handleClick={handleClick}
        />
       </div>
     );
   }