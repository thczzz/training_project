import React from 'react'
import './SearchSuggestions.css'
import { search_user } from '../../Data/getData';
import { SearchUserTemplate } from './SearchUserTemplate';

export function SearchUser({inputFieldLabel, url, searchBy, inputId, setInputId, user, setUser}) {
    const [searchResults, setSearchResults] = React.useState([]);
 
    const searchUser = search_user(url, setSearchResults, setInputId)

    const handleClick = (ev) => {
        setSearchResults([]);
        setUser(ev.target.textContent);
        setInputId(ev.target.id);
    }
    
    return (
       <div>
        <SearchUserTemplate 
            user={user} 
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
