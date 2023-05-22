import { apiRequest } from "../../Data/getData";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/authHook";
import { useEffect } from "react";
import { useContext } from "react";
import { GlobalContext } from "../../GlobalContext";

export const Logout = () => {
    const navigate     = useNavigate();
    const setUserType  = useAuth()["manuallySetUserType"];
    const alertContext = useContext(GlobalContext);

    const afterLogoutRedirect = () => {
        navigate("/login");
    };

    useEffect(() => {
        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                "Accept": "application/json",
                "Authorization": `Basic ${btoa('v4s4PyFR-J_Ecnimxd9tukG8lUMH05KGE1autNE1hVs:eo939spJ8AdxEI9EKrM3fzEu-D3x-KAm2IPBFd2-HLg')}`
            },
        };

        var resp;
        apiRequest(`http://${window.location.hostname}:3000/api/v1/oauth/revoke`, requestOptions)
          .then(
            (response) => {
                resp = response;
                return response.json();
            })
            .then(
             (result) => {
               if (resp.status === 200) {
                    setUserType(null);
                    localStorage.clear();
                    alertContext.setAuthAlertMessage("You logged out.", "success");
                    afterLogoutRedirect();
               } else {
                    alertContext.setMessage("Failed to log out, please try again.", "error")
               }
             },
             (error) => {
               console.log("Err");
             }
        ); 
    }, [])
}
