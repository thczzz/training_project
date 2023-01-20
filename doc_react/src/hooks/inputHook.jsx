import { useState } from "react";

export const useInput = initialValue => {
  const [value, setValue] = useState(initialValue);

    /////// Example usage in components/Auth/Register.jsx
    // const { value: firstName,            bind: bindFirstName,            reset: resetFirstName }           = useInput('');
    // const { value: lastName,             bind: bindLastName,             reset: resetLastName }            = useInput('');
    // const { value: address,              bind: bindAddress,              reset: resetAdress}               = useInput('');
    // const { value: dateOfBirth,          bind: bindDateOfBirth,          reset: resetDateOfBirth}          = useInput('');
    // const { value: username,             bind: bindUsername,             reset: resetUsername}             = useInput('');
    // const { value: email,                bind: bindEmail,                reset: resetEmail}                = useInput('');
    // const { value: password,             bind: bindPassword,             reset: resetPassword}             = useInput('');
    // const { value: passwordConfirmation, bind: bindPasswordConfirmation, reset: resetPasswordConfirmation} = useInput('');

  return {
    value,
    setValue,
    reset: () => setValue(""),
    bind: {
      value,
      onChange: event => {
        setValue(event.target.value);
      }
    }
  };
};
