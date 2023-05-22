import React from 'react'
import { SearchExamination } from './SearchExamination'
import { PerscriptionFields } from './PerscriptionFields'
import { apiRequest } from '../../Data/getData'
import { useContext } from 'react'
import { GlobalContext } from "../../GlobalContext";

const Perscription = () => {
  const [drugs, setDrugs]                                     = React.useState([{}]);
  const [perscriptionDescription, setPerscriptionDescription] = React.useState('');
  const [user, setUser]                                       = React.useState("");
  const [inputId, setInputId]                                 = React.useState("");
  const [examinationResults, setExaminationResults]           = React.useState([]);
  const formRef                                               = React.useRef();
  const alertContext                                          = useContext(GlobalContext);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const formData = new FormData(formRef.current);
    const form_data = Object.fromEntries(formData);
    const data = {
      "perscription": {
        "examination_id": form_data["examination_id"],
        "description":    form_data["description"]
      }
    }
    data["perscription"]["perscription_drugs"] = drugs;

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', "Accept": "application/json" },
      body: JSON.stringify(data)
    };

    var resp;
    apiRequest(`http://${window.location.hostname}:3000/api/v1/doctors/create_perscription`, requestOptions)
      .then(
        (response) => {
            resp = response;
            return response.json();
        })
        .then(
        (result) => {
            if (resp.status === 200) {
                setPerscriptionDescription("");
                setDrugs([{}]);
                setInputId("");
                setUser("");
                setExaminationResults([]);
                alertContext.setMessage("Perscription was created successfully", "success")
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
    <form  ref={formRef} onSubmit={handleSubmit}>
        <div className="group">
            <SearchExamination 
              inputFieldLabel="Examination" 
              searchBy="user" 
              user={user}
              setUser={setUser} 
              inputId={inputId} 
              setInputId={setInputId}
              examinationResults={examinationResults}
              setExaminationResults={setExaminationResults}
            />
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
