import React from "react";
import { apiRequest } from "../../Data/getData";
import { GlobalContext } from "../../GlobalContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/authHook";

const EditProfileForm = () => {
    const [state, setState] = React.useState({
        first_name: '',
        last_name: '',
        address: '',
        date_of_birth: '',
        username: '',
        email: '',
        current_password: '',
        password: '',
        password_confirmation: ''
    })
    const navigate = useNavigate();
    const setUserType = useAuth()["manuallySetUserType"];

    React.useEffect(() => {
        getAndSetUserInfoEditProfile(state, setState);
    }, [])

    function getAndSetUserInfoEditProfile () {
        const requestOptions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', "Accept": "application/json" },
        };
      
        var resp;
        fetch(`http://localhost:3000/api/v1/user_info`, {...requestOptions, credentials: 'include'})
          .then(
            (response) => {
                resp = response;
                if (response.status === 401) {
                    setUserType(0);
                    navigate("/login");
                }
                return response.json();
            })
            .then(
            (result) => {
              if (resp.status === 200) {
                const data = result["data"]["data"]["attributes"];
                
                setState({
                    ...state,
                    first_name:    data["first_name"],
                    last_name:     data["last_name"],
                    address:       data["address"],
                    date_of_birth: data["date_of_birth"],
                    username:      data["username"],
                    email:         data["email"],
                    current_password: '',
                    password: '',
                    password_confirmation: ''
                });
      
              }
            },
            (error) => {
              
            }
        ); 
      }

    const handleSubmit = (ev, props) => {
        ev.preventDefault();
        console.log(props);
        const data = {
            "user": {
                "first_name": state.first_name,
                "last_name": state.last_name,
                "address": state.address,
                "date_of_birth": state.date_of_birth,
                "username": state.username,
                "email": state.email, 
                "current_password": state.current_password,
                "password": state.password,
                "password_confirmation": state.password_confirmation
            }
        }
        
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', "Accept": "application/json" },
            body: JSON.stringify(data)
        };

        var resp;
        apiRequest(`http://localhost:3000/api/v1/users`, requestOptions)
          .then(
            (response) => {
                resp = response;
                return response.json();
            })
            .then(
             (result) => {
               if (resp.status === 422) {
                 for (const [key, value] of Object.entries(result["errors"])) {
                    if (state[key] !== undefined) {
                       const el = document.getElementById(key);
                       el.classList.add("error");
                       el.lastChild.textContent = value[0];
                    }
                 }
                 props.setMessage("Error! Failed to Edit Profile", "error");

                 setState({
                    ...state,
                    password: '',
                    password_confirmation: ''
                 });
                 
               } else {

                    getAndSetUserInfoEditProfile();

                    if (result["status"]["message"] !== null) {
                        let messages = '';
                        result["status"]["message"].forEach(message => {
                            messages += message + `\n`
                        })
                        if (result["actions"]["pw_updated"] === true) {
                            props.setAuthAlertMessage(messages, "success");
                        } else {
                            props.setMessage(messages, "success");
                        }
                    }

               }

             },
             (error) => {
               console.log("Err");
             }
        );            

            console.log('form submitted')
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setState(current =>( {...current,[name]:value} ));
        document.getElementById(name).classList.remove("error");
    }

    return (
        <GlobalContext.Consumer>
            {(props) => {
                return (
                    <form id="survey-form" onSubmit={(ev) => {handleSubmit(ev, props)}} action="">
                        <div id="first_name" class="group">
                            <label id="name-label" for="first_name">
                                First Name*
                            </label> 
                            <input type="text" value={state.first_name} onChange={handleChange} name="first_name" required />
                            <div class="error-message"></div>
                        </div>
                        <div id="last_name" class="group">
                            <label id="name-label" for="last_name">
                                Last Name*
                            </label> 
                            <input type="text"  value={state.last_name} onChange={handleChange} name="last_name" required />
                            <div class="error-message"></div>
                        </div>
                        <div id="address" class="group">
                            <label id="name-label" for="address">
                                Address*
                            </label> 
                            <input type="text"  value={state.address} onChange={handleChange} name="address" required />
                            <div class="error-message"></div>
                        </div>
                        <div id="date_of_birth" class="group">
                            <label id="name-label" for="date_of_birth">
                                Date of Birth*
                            </label> 
                            <input type="date"  value={state.date_of_birth} onChange={handleChange} name="date_of_birth" required />
                            <div class="error-message"></div>
                        </div>
                        <div id="email" class="group">
                            <label id="email-label" for="email">
                                Email*
                            </label> 
                            <input type="email"  value={state.email} onChange={handleChange} name="email" required />
                        </div>
                        <div id="current_password" class="group">
                            <label id="name-label" for="current_password">
                                Current Password*
                            </label> 
                            <input type="password" value={state.current_password} onChange={handleChange} name="current_password" required/>
                            <div class="error-message"></div>
                        </div>
                        <div id="password" class="group">
                            <label id="name-label" for="password">
                                New Password (not required)
                            </label> 
                            <input type="password" value={state.password} onChange={handleChange} name="password" />
                            <div class="error-message"></div>
                        </div>
                        <div id="password_confirmation" class="group">
                            <label id="name-label" for="password_confirmation">
                                Repeat New Password
                            </label> 
                            <input type="password" value={state.password_confirmation} onChange={handleChange} name="password_confirmation" />
                            <div class="error-message"></div>
                        </div>
                        <div class="group"><input type="submit" id="submit" /></div>
                    </form>
                )
            }}
        </GlobalContext.Consumer>
    )
}

export default EditProfileForm
