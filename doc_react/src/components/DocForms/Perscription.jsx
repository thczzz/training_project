import React from 'react'
import { SearchExamination } from './SearchExamination'
import { PerscriptionFields } from './PerscriptionFields'

const Perscription = () => {
  return (
    <form id="survey-form" method="post" action="">
        <div className="group">
            <SearchExamination inputFieldLabel="Examination" />
        </div>
        <div className="group">
            <PerscriptionFields />
        </div>
        <div className="group">
            <input type="submit" id="submit" />
        </div>
    </form>
  )
}

export default Perscription
