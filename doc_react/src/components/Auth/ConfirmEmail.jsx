// http://localhost:3001/confirm_account?confirmation_token=1CrqnpnjsMdKoRFTPPCQ
import { GlobalContext } from "../../GlobalContext";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiRequest } from '../../Data/getData'
import { useContext } from "react";
import { useEffect } from "react";
import { useAuth } from "../../hooks/authHook";

export const ConfirmEmailByToken = () => {
    let [token, setToken] = useSearchParams();
    const alertContext    = useContext(GlobalContext);
    const userType        = useAuth()["userType"];
    const navigate        = useNavigate();

    const afterResetRedirect = () => {
        if (userType === 0) {
            alertContext.setAuthAlertMessage("You confirmed your email successfully! You can now login with your new email", "success");
            navigate("/login");
        } else {
            alertContext.setMessage("You confirmed your email successfully!", "success");
            if (userType === 2) {
                navigate("/doctor");
            } else {
                navigate("/patient");
            }
        }
    }

    const failureResetRedirect = (error) => {
        if (userType === 0) {
            alertContext.setAuthAlertMessage("Your Email confirmation token " + error, "error");
            navigate("/req_account_activation_link");
        } else {
            alertContext.setMessage("Your Email confirmation token " + error, "error");
            if (userType === 2) {
                navigate("/doctor");
            } else {
                navigate("/patient");
            }
        }
    }

    useEffect(() => {
        const confirmation_token = token.get("confirmation_token");
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', "Accept": "application/json" },
        };

        var resp;
        apiRequest(`http://${window.location.hostname}/api/v1/users/confirmation?confirmation_token=${confirmation_token}`, requestOptions)
          .then(
            (response) => {
                resp = response;
                return response.json();
            })
            .then(
             (result) => {
               if (resp.status !== 200) {
                    failureResetRedirect(result["confirmation_token"]);
               } else {
                    afterResetRedirect();
               }
             },
             (error) => {
               console.log("Err");
             }
        ); 

    }, [])

}