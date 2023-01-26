import { Fragment } from "react"

export function SearchDrugTemplate(props) {

    return (
        <Fragment>
            <label id="name-label" for="user">
               {props.inputFieldLabel}*
            </label> 
            <input
              className="searchFieldInput"
              type="text"
              name={props.inputFieldLabel}
              placeholder={'Search by ' + props.searchBy}
              onChange={props.searchUser}
            //   key={props.inputId}
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
