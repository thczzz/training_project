import React from "react";

// Step 1. create the context
export const GlobalContext = new React.createContext();

// Step 2. create the context provider
// This is the React class that provides global state
export default class GlobalProvider extends React.Component {
  constructor(props) {
    super(props);
    // Initialize the state
    this.state = {
      showFlash: false, // whether or not to return html or null
      showAuthAlert: false,
      message: "", // The message within the notification
      status: "", // Success or error notification type
      setMessage: this.setMessage, // The function to update the state
      setAuthAlertMessage: this.setAuthAlertMessage
    };
  }

  // Fat arrow function to automatically bind this
  // function to this class
  setMessage = (message, status) => {
    // Only change the state if it's already false
    if (!this.state.showFlash) {
      this.setState({
        ...this.state,
        showFlash: true,
        message: message,
        status: status
      });

      // After 3 seconds change the state to
      // not show the notification
      setTimeout(() => {
        this.setState({
          ...this.state,
          showFlash: false
        });
      }, 7000); // 3000 milliseconds = 3 seconds
    }
  };

  setAuthAlertMessage = (message, status) => {
    this.setState({
        ...this.state,
        showAuthAlert: true,
        message: message,
        status: status
    });
  };

  render() {
    // Now that we have created a class that
    // Contains the state and functions we want
    // To be global
    // We turn it into a context provider by
    // Creating the Provider from the context
    // we created earlier
    // Then we pass the state as the value
    // and render the children so that
    // any components created within the ContextProvider
    // has access to the value (this.state)
    // Check out App.js to see how we wrap the app in this provider
    return (
      <GlobalContext.Provider value={this.state}>
        {this.props.children}
      </GlobalContext.Provider>
    );
  }
}
