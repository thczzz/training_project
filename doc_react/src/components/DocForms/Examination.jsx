import React from 'react'
import { SearchForDocForms } from './Search'

const Examination = () => {
  return (
    <form id="survey-form" method="post" action="">
        <div class="group">
            <SearchForDocForms
            inputFieldLabel="Patient"
            requestUrl="http://localhost:3000/api/v1/doctors/search_user/?username=" />
        </div>
        <div class="group">
            <label id="number-label" for="weight">
                Weight*
            </label> 
            <input type="number" id="weight" placeholder="Weight in KG" name="weight" min="3" required />
        </div>
        <div class="group">
            <label id="number-label" for="height">
                Height*
            </label> 
            <input type="number" id="height" placeholder="Height in CM" name="height" min="3" required />
        </div>
        <div class="group">
            <label for="comment">Anamnesis*
                <textarea rows="5" cols="30" name="anamnesis" placeholder="Anamnesis">
                </textarea>
            </label>
        </div>
        <div class="group"><input type="submit" id="submit" /></div>
    </form>
  )
}

export default Examination