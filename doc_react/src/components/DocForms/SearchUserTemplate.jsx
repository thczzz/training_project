import { Fragment } from "react"

export function SearchUserTemplate(props) {

    return (
        <Fragment>
            <label id="name-label" for="user">
               {props.inputFieldLabel}*
            </label> 
            <input
              className="searchFieldInput"
              type="text"
              id={props.inputId}
              name="user_id"
              placeholder={'Search by ' + props.searchBy}
              defaultValue={props.user}
              onChange={props.searchUser}
              key={props.inputId}
              required
            />
            
            {(!props.searchResults.length ? "" : 
               <ul className="suggestions">
                   {props.searchResults.map(itemArr => {
                       return <li 
                                className='suggestion' 
                                id={itemArr[0]} 
                                key={itemArr[0]}
                                onClick={(ev) => {props.handleClick(ev)}}
                            >
                                {itemArr[1]}
                            </li>
                   }
                   )}
               </ul>
            )}
        </Fragment>
    )
}
