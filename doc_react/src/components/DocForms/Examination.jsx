import React from 'react'
import { SearchUser } from './SearchUser'
import { PerscriptionFields } from './PerscriptionFields'
import { apiRequest } from '../../Data/getData'
import { useContext } from 'react'
import { GlobalContext } from "../../GlobalContext";

const Examination = () => {
    const [attachPerscription, setAttachPerscription]           = React.useState(false)
    const [perscriptionDescription, setPerscriptionDescription] = React.useState('');
    const [patientId, setPatientId]                             = React.useState("");
    const [drugs, setDrugs]                                     = React.useState([{}]);
    const [patient, setPatient]                                 = React.useState("");
    const [weight, setWeight]                                   = React.useState("");
    const [height, setHeight]                                   = React.useState("");
    const [anamnesis, setAnamnesis]                             = React.useState("");
    const formRef                                               = React.useRef();

    const alertContext = useContext(GlobalContext);

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
        const form_data = Object.fromEntries(formData);
        form_data["user_id"] = patientId
        if (form_data["attach_perscription"] === "on") {
            // data["perscription_description"] = perscriptionDescription;
            form_data["perscription_drugs"] = drugs
        }
        const data = {
            "examination": form_data
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', "Accept": "application/json" },
            body: JSON.stringify(data)
        };

        var resp;
        apiRequest(`http://${location.hostname}:3000/api/v1/doctors/create_examination`, requestOptions)
          .then(
            (response) => {
                resp = response;
                return response.json();
            })
            .then(
             (result) => {
                if (resp.status === 200) {
                    setPatient("");
                    setHeight("");
                    setWeight("");
                    setAnamnesis("");
                    setPatientId("");
                    setPerscriptionDescription("");
                    setDrugs([{}]);
                    setAttachPerscription(false);
                    alertContext.setMessage("Examination was created successfully", "success")
                } else {
                    alertContext.setMessage(`Error! ${result["errors"][0][0]}`, "error")
                }
             },
             (error) => {
               console.log("Err");
             }
        );
    }

  return (
    <form id="survey-form" ref={formRef} onSubmit={handleSubmit} action="">
        <div class="group">
            <SearchUser 
                inputFieldLabel="Patient" 
                url={`http://${location.hostname}:3000/api/v1/doctors/search_user/?username=`} 
                searchBy="username"
                inputId={patientId}
                setInputId={setPatientId}
                user={patient}
                setUser={setPatient}
            />
        </div>
        <div class="group">
            <label id="number-label" for="weight">
                Weight*
            </label> 
            <input onChange={(ev) => {setWeight(ev.target.value)}} value={weight} type="number" id="weight" placeholder="Weight in KG" name="weight" min="3" required />
        </div>
        <div class="group">
            <label id="number-label" for="height">
                Height*
            </label> 
            <input onChange={(ev) => {setHeight(ev.target.value)}} value={height} type="number" id="height" placeholder="Height in CM" name="height" min="3" required />
        </div>
        <div class="group">
            <label for="comment">Anamnesis*
                <textarea onChange={(ev) => {setAnamnesis(ev.target.value)}} value={anamnesis} rows="3" cols="30" name="anamnesis" placeholder="Anamnesis" required>
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
            <PerscriptionFields 
                drugs={drugs} 
                setDrugs={setDrugs}
                perscriptionDescription={perscriptionDescription} 
                setPerscriptionDescription={setPerscriptionDescription}
            />
        :
            ''
        }

        <div class="group"><input type="submit" id="submit" /></div>
    </form>
  )
}

export default Examination
