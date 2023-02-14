import './Login.css'
import './Register.css'
import '../DocForms/Forms.css'
import { apiRequest } from '../../Data/getData'
import { useState } from 'react'
import { GlobalContext } from "../../GlobalContext";
import { AuthAlert } from '../Alerts/AuthAlert'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const RegisterForm = () => {
    const [state, setState] = useState({
        first_name: '',
        last_name: '',
        address: '',
        date_of_birth: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: ''
    })
    const navigate = useNavigate();

    const handleChange = (event)=>{
        const {name, value} = event.target;
        setState(current =>( {...current,[name]:value} ));
        document.getElementById(name).classList.remove("error");
    }

    const redirectToLogin = () => {
        navigate("/login")
    }

    function handleSubmit(ev, props) {
        ev.preventDefault();
        const data = {
            "user": {
                "first_name": state.first_name,
                "last_name": state.last_name,
                "address": state.address,
                "date_of_birth": state.date_of_birth,
                "username": state.username,
                "email": state.email, 
                "password": state.password,
                "password_confirmation": state.password_confirmation
            }
        }
        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', "Accept": "application/json" },
            body: JSON.stringify(data)
        };

        var resp;
        apiRequest(`http://localhost:3000/api/v1/users/sign_up`, requestOptions)
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
                 props.setAuthAlertMessage("Error! Couldn't create your account!", "error");
               } else {
                 redirectToLogin();
                 props.setAuthAlertMessage(result["status"]["message"], "success");
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
                    <form onSubmit={(ev) => handleSubmit(ev, props)}>
                        <section className='section'>
                            <h1>Sign Up</h1>

                            <AuthAlert/>

                            <div class="login-form">
                                <div class="username-input">
                                    <div id="first_name" className='group'>
                                        <i class="fas fa-user"></i>
                                        <label className='label' htmlFor='first_name'>First Name*</label>
                                        <input 
                                            name='first_name' 
                                            type="text" 
                                            placeholder="John" 
                                            value={state.first_name} 
                                            onChange={handleChange} 
                                            required
                                        />
                                        <div class="error-message"></div>
                                    </div>
                                </div>
        
                                <div class="username-input">
                                    <div id="last_name" className='group'>
                                        <i class="fas fa-user"></i>
                                        <label className='label' htmlFor='last_name'>Last Name*</label>
                                        <input 
                                            name='last_name' 
                                            type="text" 
                                            placeholder="Doe" 
                                            value={state.last_name} 
                                            onChange={handleChange} 
                                            required
                                        />
                                        <div class="error-message"></div>
                                    </div>
                                </div>
                                <div class="username-input">
                                    <div id="address" className='group'>
                                        <i class="fas fa-user"></i>
                                        <label className='label' htmlFor='address'>Address*</label>
                                        <input 
                                            name='address' 
                                            type="text" 
                                            placeholder="Bul. Patriarh Evtimii 5" 
                                            value={state.address} 
                                            onChange={handleChange} 
                                            required
                                        />
                                        <div class="error-message"></div>
                                    </div>
                                </div>
                                <div class="username-input">
                                    <div id="date_of_birth" className='group'>
                                        <i class="fas fa-user"></i>
                                        <label className='label' htmlFor='date_of_birth'>Date of Birth*</label>
                                        <input 
                                            name='date_of_birth' 
                                            type="date"
                                            value={state.date_of_birth} 
                                            onChange={handleChange}  
                                            required
                                        />
                                        <div class="error-message"></div>
                                    </div>
                                </div>
                                <div class="username-input">
                                    <div id="username" className='group'>
                                        <i class="fas fa-user"></i>
                                        <label className='label' htmlFor='username'>Username*</label>
                                        <input 
                                            name='username' 
                                            type="text" 
                                            value={state.username} 
                                            onChange={handleChange} 
                                            required
                                        />
                                        <div class="error-message"></div>
                                    </div>
                                </div>
                                <div class="username-input">
                                    <div id="email" className='group'>
                                        <i class="fas fa-user"></i>
                                        <label className='label' htmlFor='email'>Email*</label>
                                        <input 
                                            name='email' 
                                            type="email" 
                                            placeholder="user@example.com" 
                                            value={state.email} 
                                            onChange={handleChange} 
                                            required
                                        />
                                        <div class="error-message"></div>
                                    </div>                                
                                </div>
                                <div class="password-input">
                                    <div id="password" className='group'>
                                        <i class="fas fa-lock"></i>
                                        <label className='label' htmlFor='password'>Password*</label>
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
                                        <label className='label' htmlFor='password_confirmation'>Repeat Password*</label>
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
                            <button 
                                type='submit' 
                                class="login-btn"
                            >
                                Sign Up
                            </button>
                            <div class="alternative-signup">
                                <p>Already a member ?
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

export default RegisterForm
