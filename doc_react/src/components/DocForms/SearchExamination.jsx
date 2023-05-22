import React from 'react'
import './SearchSuggestions.css'
import { apiRequest, debounce, search_user } from '../../Data/getData';
import { SearchExaminationTemplate } from './SearchExaminationTemplate';
import { SearchUserTemplate } from './SearchUserTemplate';

export function SearchExamination({inputFieldLabel, searchBy, user, setUser, inputId, setInputId, examinationResults, setExaminationResults}) {
    const [searchResults, setSearchResults] = React.useState([]);
 
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    
    const searchUser = search_user(`http://${location.hostname}:3000/api/v1/doctors/search_user/?username=`, setSearchResults, setInputId, setExaminationResults)

    const getUserExaminations = debounce((event) => {
        apiRequest(`http://${location.hostname}:3000/api/v1/doctors/user_examinations/?user_id=${event.target.id}`, requestOptions)
            .then(res => res.json())
            .then(
            (result) => {
                setExaminationResults(result["data"]);
            },
            (error) => {
                console.log("Err");
            }
        );
    }, 500)

    const handleClick = (ev) => {
        setUser(ev.target.textContent);
        setSearchResults([]);
        setInputId(ev.target.id);
        getUserExaminations(ev);
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
    
            <SearchExaminationTemplate
                examinationResults={examinationResults}
            />
       </div>
     );
   }
