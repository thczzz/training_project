import './Login.css'
import { useInput } from '../../hooks/inputHook'
import { apiRequest } from '../../Data/getData';
import { GlobalContext } from "../../GlobalContext";
import { AuthAlert } from '../Alerts/AuthAlert';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from '../../hooks/authHook';

const LoginForm = () => {
    const {value: email,    bind: bindEmail,    reset: resetEmail}    = useInput('');
    const {value: password, bind: bindPassword, reset: resetPassword} = useInput('');
    const navigate = useNavigate();
    const userType = useAuth()["userType"];

    const afterLoginRedirect = () => {
        if (userType === 1 || userType === 2) {
            navigate("/doctor")
        } else {
            navigate("/patient")
        }
    }

    const handleSubmit = (ev, props) => {
        ev.preventDefault();

        const data = {
            "grant_type": "password",
            "email": email,
            "password": password
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', "Accept": "application/json" },
            body: JSON.stringify(data)
        };

        var resp;
        apiRequest(`http://${window.location.hostname}:3000/api/v1/oauth/token`, requestOptions)
          .then(
            (response) => {
                resp = response;
                return response.json();
            })
            .then(
             (result) => {
               if (resp.status === 200) {
                    localStorage.clear();
                    props.setAuthAlertMessage("Success! Redirecting..", "success");
                    return afterLoginRedirect();
               } else if (resp.status === 400) {
                    props.setAuthAlertMessage("Error! Wrong Email or Password!", "error");
               } else {
                    props.setAuthAlertMessage(result["message"], "error");
               }
             },
             (error) => {
               console.log("Err");
             }
        );
        
        resetEmail();
        resetPassword();
    }

    return (
        <GlobalContext.Consumer>
            {(props) => {
                return (
                    <form onSubmit={(ev) => {handleSubmit(ev, props)}}>
                        <section>
                            <h1>Login</h1>

                            <AuthAlert/>

                            <div class="login-form">
                                <h4>Email</h4>
                                <div class="username-input">
                                    <i class="fas fa-user"></i>
                                    <input name='email' type="email" placeholder="user@example.com" {...bindEmail} required/>
                                </div>
                                <h4>Password</h4>
                                <div class="password-input">
                                    <i class="fas fa-lock"></i>
                                    <input name='password' type="password" placeholder="Type your password" {...bindPassword} required/>
                                </div>
                                <Link reloadDocument to="../req_password_reset"><p>Forgot password?</p></Link>
                                
                            </div>
                            <button class="login-btn">
                                LOGIN
                            </button>
                            <div class="alternative-signup">
                                <p>Not a member?
                                    <Link reloadDocument to="../register">
                                        <span>Sign-up</span>
                                    </Link>
                                </p>
                                <p>Account not active ?
                                    <Link reloadDocument to="../req_account_activation_link">
                                        <span>Request link</span>
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

export default LoginForm
