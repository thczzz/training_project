import React from "react";
import './Alerts.css'

import { GlobalContext } from '../../GlobalContext';

export const AuthAlert = () => {
    return (
        <GlobalContext.Consumer>
            {(props) => {
                if (props.showAuthAlert) {
                    return (
                        <div id="loginAlertContainer">
                            <div className={`auth ${props.status === "success" ? "success" : "danger"}-alert`}>
                                <h3 id="h3Login">{props.message}</h3>
                            </div>
                        </div>
                    )
                } else {
                    return null;
                }
            }}
        </GlobalContext.Consumer>
    )
};
