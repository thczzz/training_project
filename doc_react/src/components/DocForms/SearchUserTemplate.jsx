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
              name={props.inputFieldLabel}
              placeholder={'Search by ' + props.inputFieldLabel}
              defaultValue={props.user}
              key={props.inputId}
              onChange={props.searchUser}
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
