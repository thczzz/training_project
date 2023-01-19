import React from 'react'
import './SearchSuggestions.css'
import { apiRequest, debounce, search_user } from '../../Data/getData';
import { SearchExaminationTemplate } from './SearchExaminationTemplate';
import { SearchUserTemplate } from './SearchUserTemplate';

export function SearchExamination({inputFieldLabel}) {
    const [user, setUser]                             = React.useState("");
    const [searchResults, setSearchResults]           = React.useState([]);
    const [examinationResults, setExaminationResults] = React.useState([]);
    const [inputId, setInputId]                       = React.useState("");
 
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    
    const searchUser = search_user('http://localhost:3000/api/v1/doctors/search_user/?username=', setSearchResults, setInputId, setExaminationResults)

    const getUserExaminations = debounce((event) => {
        apiRequest(`http://localhost:3000/api/v1/doctors/user_examinations/?user_id=${event.target.id}`, requestOptions)
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