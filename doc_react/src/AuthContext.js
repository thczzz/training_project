import React from "react";
import { useLocation } from "react-router-dom";
import { apiRequest } from "./Data/getData";
export const AuthContext = new React.createContext();

const userActivityTrackingEvents = [
    "load",
    "mousemove",
    "mousedown",
    "click",
    "scroll",
    "keypress",
];

const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', "Accept": "application/json" },
};

export const AuthContextProvider = ({ children }) => {
    const [userType, setUserType] = React.useState(null);
    let location = useLocation();

    // Track user_type
    React.useEffect(() => {
        async function get_user_type() {
            const response = await fetch(`http://${window.location.hostname}:3000/api/v1/user_type`, {...requestOptions, credentials: 'include'})

            if (response.status === 401) {
                setUserType(0);
            } else {
                await response.json()
                 .then(
                     (result) => {
                        setUserType(result["data"][0]);
                        localStorage.setItem("email", result["data"][1]);
                     },
                     (error) => {
                     
                     }
                 ); 
            }
        }
        get_user_type();
    }, [location])

    // Refresh token ?
    React.useEffect(() => {
        if (userType !== 0 && userType !== null) {
            console.log("started tracking")
            trackUserLastActivity();

            let ref_interval = refreshInterval();
            const refreshTimeout = setTimeout( async function test() {
                let refresh = shouldRefresh();
                if (refresh) {
                    let success = await handleRefresh(localStorage.getItem("email"));
                    console.log(success)
                    if (success === true) {
                        localStorage.setItem("startTime", new Date());
                        let r_interval = refreshInterval();
                        setTimeout(test, r_interval); 
                    } else {
                        return false
                    }
                } else {
                    console.log("Will be logged out automatically")
                }
            }, ref_interval);
            return () => {
                clearTimeout(refreshTimeout);
                userActivityTrackingEvents.forEach(event => {
                    document.removeEventListener(event, setLastActivity());
                })
            };
        }
    }, [userType])


    function refreshInterval() {
        var oldStartTime = localStorage.getItem('startTime');
        var startTime = oldStartTime ? new Date(oldStartTime) : new Date();
        localStorage.setItem('startTime', startTime);

        var currentTime = new Date()
        var elapsed = currentTime.getTime() - startTime.getTime()
        var duration = 865000 - elapsed; // 14.41m
        return duration;
    }

    function shouldRefresh() {
        let lastAcivity = localStorage.getItem('lastActivity')
        var d1 = new Date(lastAcivity)
        var d2 = new Date()
        var diffMs = Math.abs(d1 - d2); // milliseconds between now & last activity
        var seconds = Math.floor((diffMs/1000));
        var minute = Math.floor((seconds/60));
        console.log(seconds +' sec or '+minute+' min since last activity')
        return minute <= 14
    }

    async function handleRefresh(email) {
        const data = {
            "grant_type": "refresh_token",
            "email": email
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', "Accept": "application/json" },
            body: JSON.stringify(data)
        };

       let success = false;
       var resp;
       await apiRequest(`http://${window.location.hostname}:3000/api/v1/oauth/token`, requestOptions)
        .then(
          (response) => {
              resp = response;
              return response.json();
          })
          .then(
           (result) => {
             if (resp.status === 200) {
                success = true;
             } else {
                success = false;
             }
           },
           (error) => {
             console.log("Err");
           }
      );

      return success;
    }

    function trackUserLastActivity()  {
        userActivityTrackingEvents.forEach(event => {
            document.addEventListener(event, () => {
                setLastActivity();
            })
        })
    }

    function setLastActivity () {
        localStorage.setItem("lastActivity", new Date());
    }

    const manuallySetUserType = (type) => {
        setUserType(type)
    }

    const value = {
        userType,
        manuallySetUserType
    }

    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  };
