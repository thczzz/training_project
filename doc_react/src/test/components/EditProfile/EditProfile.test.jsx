import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useAuth } from "../../../hooks/authHook";
import GlobalProvider from "../../../GlobalContext";
import { Notification } from "../../../components/Alerts/Notification";
import { server } from "../../../mocks/server";
import { rest } from 'msw'
import { LoginView } from "../../../views/LoginView";
import EditProfileForm from "../../../components/EditProfile/EditProfile";

jest.mock('../../../hooks/authHook.jsx', () => ({ useAuth: jest.fn() }))

describe("Test EditProfileForm Component", () => {
  function getOnChangeFields (container) {
    return {
      "first_name":            container.querySelector('input[name="first_name"]'),
      "last_name":             container.querySelector('input[name="last_name"]'),
      "address":               container.querySelector('input[name="address"]'),
      "date_of_birth":         container.querySelector('input[name="date_of_birth"]'),
      "username":              container.querySelector('input[name="username"]'),
      "email":                 container.querySelector('input[name="email"]'),
      "current_password":      container.querySelector('input[name="current_password"]'),
      "password":              container.querySelector('input[name="password"]'),
      "password_confirmation": container.querySelector('input[name="password_confirmation"]')
    }
  }

  const RenderHelper = (children) => {
    return (
      <Router>
          <GlobalProvider>
            <Notification show={true} />
            {children},
            <Routes>
              <Route path='/login' element={<LoginView/>} />
            </Routes>
          </GlobalProvider>
      </Router>
    )
  }

  let userType = 2;
  const manuallySetUserType = (value) => {
    userType = value;
  }

  describe("Test Form elements and fields", () => {
    test("The Form should have", async () => {
      useAuth.mockImplementation(() => ({"userType": userType, "manuallySetUserType": manuallySetUserType}));
      const { container } = render(RenderHelper(<EditProfileForm />));
      let onChangeFields = getOnChangeFields(container);
  
      await waitFor(() => {
        expect(onChangeFields["first_name"].value).toEqual('John');
        expect(onChangeFields["last_name"].value).toEqual('Smith');
        expect(onChangeFields["address"].value).toEqual('Stara Zagora');
        expect(onChangeFields["date_of_birth"].value).toEqual('2001-05-06');
        expect(onChangeFields["username"].value).toEqual('testuser');
        expect(onChangeFields["email"].value).toEqual('testuser@mail.com');
        expect(onChangeFields["current_password"].value).toEqual('');
        expect(onChangeFields["password"].value).toEqual('');
        expect(onChangeFields["password_confirmation"].value).toEqual('');

        expect(container.querySelector('input[id="submit"]')).toBeInTheDocument();
      })
    });

    test("HTML expected Validation on form fields", async () => {
      useAuth.mockImplementation(() => ({"userType": userType, "manuallySetUserType": manuallySetUserType}));
      const { container } = render(RenderHelper(<EditProfileForm />));
      let onChangeFields = getOnChangeFields(container);

      await waitFor(() => {
        fireEvent.change(onChangeFields["first_name"],            { target: { value: "" } });
        fireEvent.change(onChangeFields["last_name"],             { target: { value: "" } });
        fireEvent.change(onChangeFields["address"],               { target: { value: "" } });
        fireEvent.change(onChangeFields["date_of_birth"],         { target: { value: "invalidDate" } });
        fireEvent.change(onChangeFields["username"],              { target: { value: "" } });
        fireEvent.change(onChangeFields["email"],                 { target: { value: "invalidEmail" } });
        fireEvent.change(onChangeFields["current_password"],      { target: { value: "" } });     
        fireEvent.change(onChangeFields["password"],              { target: { value: "" } });
        fireEvent.change(onChangeFields["password_confirmation"], { target: { value: "" } });
        
        expect(onChangeFields["first_name"]).toBeInvalid();
        expect(onChangeFields["last_name"]).toBeInvalid();
        expect(onChangeFields["address"]).toBeInvalid();
        expect(onChangeFields["date_of_birth"]).toBeInvalid();
        expect(onChangeFields["username"]).toBeInvalid();
        expect(onChangeFields["email"]).toBeInvalid();
        expect(onChangeFields["current_password"]).toBeInvalid();
        expect(onChangeFields["password"]).toBeValid();
        expect(onChangeFields["password_confirmation"]).toBeValid();
      })
    });
  })

  describe("Test Form Submit requests", () => {
    test("When successful but password was changed, it is expected to redirect to /login page and display alert msg", async () => {
      useAuth.mockImplementation(() => ({"userType": userType, "manuallySetUserType": manuallySetUserType}));
      const { container } = render(RenderHelper(<EditProfileForm />));

      fireEvent.click(container.querySelector('input[id="submit"]'));

      server.use(
        rest.get(`http://${location.hostname}:3000/api/v1/user_info`, (req, res, ctx) => {
          return res(
            ctx.status(401),
            ctx.json(
              { 
                success: false
              }
            )
          );
        }),
      );

      await waitFor(() => {
        expect(screen.getByText(/Your acc. was updated successfully. Your acc. was updated but since your pw was changed you'll have to login again./)
        ).toBeInTheDocument();
        expect(window.location.pathname).toEqual('/login')

      })

    });

    test("When successful but pw was not changed, it should update the updated fields except for email", async () => {
      useAuth.mockImplementation(() => ({"userType": userType, "manuallySetUserType": manuallySetUserType}));

      server.use(
        rest.patch(`http://${location.hostname}:3000/api/v1/users`, (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json(
              { 
                status: {
                  message: ["Your acc. was updated successfully."]
                },
                actions: {
                  "pw_updated": false
                }
              }
            )
          );
        })
      );

      const { container } = render(RenderHelper(<EditProfileForm />));

      await waitFor(() => {
        let onChangeFields = getOnChangeFields(container);
        expect(onChangeFields["first_name"].value).toEqual('John');
        expect(onChangeFields["last_name"].value).toEqual('Smith');
        expect(onChangeFields["address"].value).toEqual('Stara Zagora');
        expect(onChangeFields["date_of_birth"].value).toEqual('2001-05-06');
        expect(onChangeFields["username"].value).toEqual('testuser');
        expect(onChangeFields["email"].value).toEqual('testuser@mail.com');
        expect(onChangeFields["current_password"].value).toEqual('');
        expect(onChangeFields["password"].value).toEqual('');
        expect(onChangeFields["password_confirmation"].value).toEqual('');
  
        fireEvent.change(onChangeFields["current_password"],      { target: { value: "123456" } });     
        fireEvent.change(onChangeFields["password"],              { target: { value: "1234567" } });
        fireEvent.change(onChangeFields["password_confirmation"], { target: { value: "1234567" } });
        fireEvent.click(container.querySelector('input[id="submit"]'));
      })

      server.use(
        rest.get(`http://${location.hostname}:3000/api/v1/user_info`, (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json(
              { 
                data: 
                {
                  data: 
                  { 
                    attributes: {
                      "first_name": "Peter",
                      "last_name": "Johnson",
                      "address": "Sofia",
                      "date_of_birth": "2002-05-06",
                      "username": "testuserz",
                      "email": "testuserz@mail.com"
                    }
                  }
                } 
              }
            )
          );
        }),
      )

      await waitFor(() => {
        let onChangeFields = getOnChangeFields(container);
        expect(onChangeFields["first_name"].value).toEqual('Peter');
        expect(onChangeFields["last_name"].value).toEqual('Johnson');
        expect(onChangeFields["address"].value).toEqual('Sofia');
        expect(onChangeFields["date_of_birth"].value).toEqual('2002-05-06');
        expect(onChangeFields["username"].value).toEqual('testuserz');
        expect(onChangeFields["email"].value).toEqual('testuserz@mail.com');
        expect(onChangeFields["current_password"].value).toEqual('');
        expect(onChangeFields["password"].value).toEqual('');
        expect(onChangeFields["password_confirmation"].value).toEqual('');
        expect(screen.getByText(/Your acc. was updated successfully./)).toBeInTheDocument();

      })

    });

    test("When fail to Edit Profile(status=422), it should display notification message, \
      form field errors from JSON response. It should also remove 'error' class \
        from parent div on input fields change", async () => {
      useAuth.mockImplementation(() => ({"userType": userType, "manuallySetUserType": manuallySetUserType}));

      server.use(
        rest.patch(`http://${location.hostname}:3000/api/v1/users`, (req, res, ctx) => {
          return res(
            ctx.status(422),
            ctx.json({ errors: {
              "first_name":            ["is invalid."],
              "last_name":             ["is invalid."],
              "address":               ["cannot be blank."],
              "username":              ["has already been taken."], 
              "current_password":      ["is invalid."],
              "password":              ["is too short."], 
              "password_confirmation": ["didn't match password"],
              "date_of_birth":         ["cannot be in the future."],
              "email":                 ["has already been taken."]
            } })
          );
        }),
      );

      const { container } = render(RenderHelper(<EditProfileForm />))

      const inputParentDivs = {
        "first_name":            container.querySelector('#first_name'),
        "last_name":             container.querySelector('#last_name'),
        "address":               container.querySelector('#address'),
        "date_of_birth":         container.querySelector('#date_of_birth'),
        "username":              container.querySelector('#username'),
        "email":                 container.querySelector('#email'),
        "current_password":      container.querySelector('#current_password'),
        "password":              container.querySelector('#password'),
        "password_confirmation": container.querySelector('#password_confirmation')
      }

      fireEvent.click(container.querySelector('input[id="submit"]'));

      await waitFor(() => {
        expect(screen.getByText(/Error! Failed to Edit Profile/)).toBeInTheDocument();

        expect(inputParentDivs["first_name"].classList.contains("error")).toBe(true);
        expect(inputParentDivs["last_name"].classList.contains("error")).toBe(true);
        expect(inputParentDivs["address"].classList.contains("error")).toBe(true);
        expect(inputParentDivs["username"].classList.contains("error")).toBe(true);
        expect(inputParentDivs["current_password"].classList.contains("error")).toBe(true);
        expect(inputParentDivs["password"].classList.contains("error")).toBe(true);
        expect(inputParentDivs["password_confirmation"].classList.contains("error")).toBe(true);
        expect(inputParentDivs["date_of_birth"].classList.contains("error")).toBe(true);
        expect(inputParentDivs["email"].classList.contains("error")).toBe(true);

        // Form fields error description
        expect(inputParentDivs["first_name"].lastChild.textContent).toBe('is invalid.');
        expect(inputParentDivs["last_name"].lastChild.textContent).toBe('is invalid.');
        expect(inputParentDivs["address"].lastChild.textContent).toBe('cannot be blank.');
        expect(inputParentDivs["username"].lastChild.textContent).toBe("has already been taken.");
        expect(inputParentDivs["current_password"].lastChild.textContent).toBe('is invalid.');
        expect(inputParentDivs["password"].lastChild.textContent).toBe("is too short.");
        expect(inputParentDivs["password_confirmation"].lastChild.textContent).toBe("didn't match password");
        expect(inputParentDivs["date_of_birth"].lastChild.textContent).toBe("cannot be in the future.");
        expect(inputParentDivs["email"].lastChild.textContent).toBe("has already been taken.");

        // Changing the input values after errors should remove `error` from inputParentDivs classList.
        const onChangeFields = getOnChangeFields(container);
        fireEvent.change(onChangeFields["first_name"],            { target: { value: "Peter" } });
        fireEvent.change(onChangeFields["last_name"],             { target: { value: "Smith" } });
        fireEvent.change(onChangeFields["address"],               { target: { value: "Stara Zagora" } });
        fireEvent.change(onChangeFields["date_of_birth"],         { target: { value: "2000-05-12" } });
        fireEvent.change(onChangeFields["username"],              { target: { value: "dummyusername" } });
        fireEvent.change(onChangeFields["email"],                 { target: { value: "dummymail@mail.com" } });
        fireEvent.change(onChangeFields["current_password"],      { target: { value: "dummypw" } });
        fireEvent.change(onChangeFields["password"],              { target: { value: "dummypw" } });
        fireEvent.change(onChangeFields["password_confirmation"], { target: { value: "dummypw" } });
        expect(inputParentDivs["first_name"].classList.contains("error")).toBe(false);
        expect(inputParentDivs["last_name"].classList.contains("error")).toBe(false);
        expect(inputParentDivs["address"].classList.contains("error")).toBe(false);
        expect(inputParentDivs["username"].classList.contains("error")).toBe(false);
        expect(inputParentDivs["current_password"].classList.contains("error")).toBe(false);
        expect(inputParentDivs["password"].classList.contains("error")).toBe(false);
        expect(inputParentDivs["password_confirmation"].classList.contains("error")).toBe(false);
        expect(inputParentDivs["date_of_birth"].classList.contains("error")).toBe(false);
        expect(inputParentDivs["email"].classList.contains("error")).toBe(false);
      });
    });

  })
})
