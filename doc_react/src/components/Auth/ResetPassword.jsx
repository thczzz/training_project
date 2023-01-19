import { useState } from 'react'
import { apiRequest } from '../../Data/getData'
import { AuthAlert } from '../Alerts/AuthAlert'
import { GlobalContext } from "../../GlobalContext";

const ResetPasswordForm = () => {
    const [state, setState] = useState({
        password: '',
        password_confirmation: ''
    })

    const handleChange = (event)=>{
        const {name, value} = event.target;
        setState(current =>( {...current,[name]:value} ));
        document.getElementById(name).classList.remove("error");
    }

    function handleSubmit(ev, props) {
        ev.preventDefault();
        const data = {
            "user": {
                "password": state.password,
                "password_confirmation": state.password_confirmation,
                "reset_password_token": "svJ6HCzG1G4Eyk6KBXkJ" // todo: get this value from URL params
            }
        }
        
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', "Accept": "application/json" },
            body: JSON.stringify(data)
        };

        var resp;
        apiRequest(`http://localhost:3000/api/v1/users/password`, requestOptions)
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
                    } else {
                        // setAlertMessage("Your Password reset token is " + value[0]); => old
                        // setAlertType("danger");                                      => old
                        /// todo: alert..... +  handle ...
                    }
                 }
               } else {
                    // setAlertMessage("Success!Redirecting to the login page");        => old
                    // setAlertType("success");                                         => old
                    /// todo: alert..... + handle ...
               }
             },
             (error) => {
               console.log("Err");
             }
        );            

            console.log('form submitted')
    }

    return (
        <GlobalContext.Consumer>
            {(props) => {
                return (
                    <form onSubmit={(ev) => handleSubmit(ev, props)}>
                        <section>
                            <h1>Reset Password</h1>
            
                            <AuthAlert/>
            
                            <div class="login-form">
                                <div class="password-input">
                                    <div id="password" className='group'>
                                        <i class="fas fa-lock"></i>
                                        <label className='label' htmlFor='password'>New Password*</label>
                                        <input 
                                            name='password' 
                                            type="password" 
                                            placeholder="password" 
                                            value={state.password} 
                                            onChange={handleChange} 
                                            required
                                        />
                                        <div class="error-message"></div>
                                    </div>                                 
                                </div>
                                <div class="password-input">
                                    <div id="password_confirmation" className='group'>
                                        <i class="fas fa-lock"></i>
                                        <label className='label' htmlFor='password_confirmation'>Repeat new Password*</label>
                                        <input 
                                            name='password_confirmation' 
                                            type="password" 
                                            placeholder="repeat password" 
                                            value={state.password_confirmation} 
                                            onChange={handleChange} 
                                            required
                                        />
                                        <div class="error-message"></div>
                                    </div>                                  
                                </div>
                            </div>
                            <button type="submit" class="login-btn">
                                    Reset Password
                            </button>
                        </section>
                    </form>
                )

            }}
        </GlobalContext.Consumer>
    )
}

export default ResetPasswordForm