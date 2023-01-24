import React from 'react'
import { SearchExamination } from './SearchExamination'
import { SearchUser } from './SearchUser'
import { PerscriptionFields } from './PerscriptionFields'

const Examination = () => {
    const [attachPerscription, setAttachPerscription] = React.useState(false)
    const formRef = React.useRef();

    function handleChange() {
        if (attachPerscription === false) {
            setAttachPerscription(true)
        } else {
            setAttachPerscription(false)
        }
    }

    const handleSubmit = (ev) => {
        ev.preventDefault();
        const formData = new FormData(formRef.current);
        const data = Object.fromEntries(formData);
        console.log(data);
        console.log(PerscriptionFields.drugs)
    }

  return (
    <form id="survey-form" ref={formRef} onSubmit={handleSubmit} action="">
        <div class="group">
            <SearchUser inputFieldLabel="Patient" url='http://localhost:3000/api/v1/doctors/search_user/?username=' />
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
                <textarea rows="3" cols="30" name="anamnesis" placeholder="Anamnesis">
                </textarea>
            </label>
        </div>
        <div class="group inline">
            <label htmlFor='attach_perscription'> 
                <input 
                    type="checkbox" 
                    name="attach_perscription" 
                    checked={attachPerscription}
                    onChange={handleChange}
                >
                </input>
            Attach Perscription ?
            </label>
        </div>
        {attachPerscription     
        ?
            <PerscriptionFields/>
        :
            ''
        }

        <div class="group"><input type="submit" id="submit" /></div>
    </form>
  )
}

export default Examination
