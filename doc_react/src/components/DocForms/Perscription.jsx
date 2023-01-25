import React from 'react'
import { SearchExamination } from './SearchExamination'
import { PerscriptionFields } from './PerscriptionFields'

const Perscription = () => {
  const [drugs, setDrugs] = React.useState([{}]);
  const [perscriptionDescription, setPerscriptionDescription] = React.useState('');

  return (
    <form id="survey-form" method="post" action="">
        <div className="group">
            <SearchExamination inputFieldLabel="Examination" searchBy="user"/>
        </div>
        <div className="group">
            <PerscriptionFields
              drugs={drugs} 
              setDrugs={setDrugs} 
              perscriptionDescription={perscriptionDescription} 
              setPerscriptionDescription={setPerscriptionDescription}
            />
        </div>
        <div className="group">
            <input type="submit" id="submit" />
        </div>
    </form>
  )
}

export default Perscription
