import React from 'react'
import './SearchSuggestions.css'
import { apiRequest, debounce } from '../../Data/getData';

export function SearchForDocForms({inputFieldLabel, requestUrl}) {
    const [user, setUser] = React.useState("");
    const [searchResults, setSearchResults] = React.useState([]);
    const [inputId, setInputId] = React.useState("");

    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    
    const handleChange = debounce((event) => {
        let userInput = event.target.value;
        if (userInput.length > 2) {
            apiRequest(requestUrl + userInput, requestOptions)
             .then(res => res.json())
             .then(
               (result) => {
                  setSearchResults(result["data"]);
               },
               (error) => {
                  console.log("Err");
               }
            );
        } else {
            setSearchResults([]);
        }
    }, 400)
    
    return (
       <div>
         <label id="name-label" for="user">
            {inputFieldLabel}*
         </label> 
         <input
           className="searchFieldInput"
           type="text"
           id={inputId}
           name="user"
           placeholder="Search by username.."
           defaultValue={user}
           key={user}
           onChange={handleChange}
         />
         <ul className="suggestions">
            {(!searchResults.length ? "" : searchResults.map(itemArr => {
                return <li 
                 className='suggestion' 
                 id={itemArr[0]} 
                 key={itemArr[0]} 
                 onClick={(ev) => {
                     setUser(ev.target.textContent);
                     setSearchResults([]);
                     setInputId(ev.target.id);
                    }}
                >
                    {itemArr[1]}
                </li>
            }))}
         </ul>
       </div>
     );
   }