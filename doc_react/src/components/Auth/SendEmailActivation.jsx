import './Login.css'
import { useState } from 'react';
import { apiRequest } from '../../Data/getData';
import { AuthAlert } from '../Alerts/AuthAlert';
import { GlobalContext } from '../../GlobalContext';
import { Link } from 'react-router-dom';

const ReSendEmailActivationForm = () => {
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
        apiRequest(`http://${window.location.hostname}/api/v1/users/confirmation`, requestOptions)
          .then(
            (response) => {
                resp = response;
                return response.json();
            })
            .then(
             (result) => {
                props.setAuthAlertMessage(result["status"]["message"], "success");
                setEmail("");
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
                            <h1>New Activation Link</h1>
        
                            <AuthAlert/>
        
                            <div class="login-form">
                                <h4>Email</h4>
                                <div class="username-input">
                                    <i class="fas fa-user"></i>
                                    <input name='email' type="email" placeholder="user@example.com" value={email} onChange={handleChange} required/>
                                </div>
                            </div>
                            <button class="login-btn">
                                Request new Activation Link
                            </button>
                            <div class="alternative-signup">
                                <p>
                                    <Link reloadDocument to="../login">
                                        <span>Log-in</span>
                                    </Link>
                                </p>
                            </div>
                        </section>
                    </form>
                )
            }}
        </GlobalContext.Consumer>
    )
}

export default ReSendEmailActivationForm
