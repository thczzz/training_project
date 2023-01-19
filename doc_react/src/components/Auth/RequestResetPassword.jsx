import './Login.css'
import { useState } from 'react';
import { apiRequest } from '../../Data/getData';
import { AuthAlert } from '../Alerts/AuthAlert';
import { GlobalContext } from '../../GlobalContext';

const RequestResetPasswordForm = () => {
    const [email, setEmail] = useState("");

    const handleChange = (ev) => {
        setEmail(ev.target.value);
    }

    const handleSubmit = (ev, props) => {
        ev.preventDefault();
        const data = {
            "user": {
                "email": email,
            }
        }

        const requestOptions = {
            method: 'POST',
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
               if (resp.status === 400) {
                // todo: alert....
               } else {
                // todo: alert....
                setEmail("");
               }
             },
             (error) => {
               console.log("Err");
             }
        );
        
    }

    return (
        <GlobalContext.Consumer>
            {(props) => {
                    return  ( 
                        <form onSubmit={(ev) => {handleSubmit(ev, props)}}>
                            <section>
                                <h1>Reset Password</h1>
            
                                <AuthAlert />
            
                                <div class="login-form">
                                    <h4>Email</h4>
                                    <div class="username-input">
                                        <i class="fas fa-user"></i>
                                        <input name='email' type="email" placeholder="user@example.com" value={email} onChange={handleChange} required/>
                                    </div>
                                </div>
                                <button class="login-btn">
                                    Request Password Reset
                                </button>
                            </section>
                        </form>
                    )

            }}
        </GlobalContext.Consumer>
    )

}


export default RequestResetPasswordForm