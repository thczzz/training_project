import React from "react";
import './Alerts.css'

import { GlobalContext } from '../../GlobalContext';

export const Notification = () => {
    return (
        <GlobalContext.Consumer>
            {(props) => {
                if (props.showFlash) {
                    return (
                        <div id="notification">
                            <div
                                className={`alert ${
                                props.status === "success" ? "success" : "danger"
                                }-alert`}
                            >
                                <h3>{props.message}</h3>
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
