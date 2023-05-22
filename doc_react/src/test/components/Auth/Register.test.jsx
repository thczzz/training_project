import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useAuth } from "../../../hooks/authHook";
import GlobalProvider from "../../../GlobalContext";
import { Notification } from "../../../components/Alerts/Notification";
import { server } from "../../../mocks/server";
import { rest } from 'msw'
import { LoginView } from "../../../views/LoginView";
import RegisterForm from "../../../components/Auth/Register";

jest.mock('../../../hooks/authHook.jsx', () => ({ useAuth: jest.fn() }))

describe("Test RegisterForm Component", () => {
  function getOnChangeFields (container) {
    return {
      "first_name":            container.querySelector('input[name="first_name"]'),
      "last_name":             container.querySelector('input[name="last_name"]'),
      "address":               container.querySelector('input[name="address"]'),
      "date_of_birth":         container.querySelector('input[name="date_of_birth"]'),
      "username":              container.querySelector('input[name="username"]'),
      "email":                 container.querySelector('input[name="email"]'),
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

  describe("Test Form elements and fields", () => {
    test("The Form should have", async () => {

      const { container } = render(RenderHelper(<RegisterForm />));
  
      await waitFor(() => {
        expect(container.querySelector('input[name="first_name"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="last_name"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="address"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="date_of_birth"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="username"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="email"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="password"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="password_confirmation"]')).toBeInTheDocument();

        const links = screen.getAllByRole('link');
        expect(links[0].href).toEqual(window.location + 'login');
        expect(screen.getByText(/Already a member ?/)).toBeInTheDocument();
        expect(screen.getByRole("button").textContent).toEqual("Sign Up");
      })
    });

    test("HTML expected Validation on form fields", async () => {
      const { container } = render(RenderHelper(<RegisterForm />));
      let onChangeFields = getOnChangeFields(container);

      fireEvent.change(onChangeFields["first_name"],            { target: { value: "" } });
      fireEvent.change(onChangeFields["last_name"],             { target: { value: "" } });
      fireEvent.change(onChangeFields["address"],               { target: { value: "" } });
      fireEvent.change(onChangeFields["date_of_birth"],         { target: { value: "invalidDate" } });
      fireEvent.change(onChangeFields["username"],              { target: { value: "" } });
      fireEvent.change(onChangeFields["email"],                 { target: { value: "invalidEmail" } });
      fireEvent.change(onChangeFields["password"],              { target: { value: "" } });
      fireEvent.change(onChangeFields["password_confirmation"], { target: { value: "" } });

      await waitFor(() => {
        expect(onChangeFields["first_name"]).toBeInvalid()
        expect(onChangeFields["last_name"]).toBeInvalid()
        expect(onChangeFields["address"]).toBeInvalid()
        expect(onChangeFields["date_of_birth"]).toBeInvalid()
        expect(onChangeFields["username"]).toBeInvalid()
        expect(onChangeFields["email"]).toBeInvalid()
        expect(onChangeFields["password"]).toBeInvalid()
        expect(onChangeFields["password_confirmation"]).toBeInvalid()
      })
    });

    test("onChange events on fields should change their value", async () => {
      const { container } = render(RenderHelper(<RegisterForm />));
      const onChangeFields = getOnChangeFields(container);

      fireEvent.change(onChangeFields["first_name"],            { target: { value: "Peter" } });
      fireEvent.change(onChangeFields["last_name"],             { target: { value: "Smith" } });
      fireEvent.change(onChangeFields["address"],               { target: { value: "Stara Zagora" } });
      fireEvent.change(onChangeFields["date_of_birth"],         { target: { value: "2000-05-12" } });
      fireEvent.change(onChangeFields["username"],              { target: { value: "dummyusername" } });
      fireEvent.change(onChangeFields["email"],                 { target: { value: "dummymail@mail.com" } });
      fireEvent.change(onChangeFields["password"],              { target: { value: "dummypw" } });
      fireEvent.change(onChangeFields["password_confirmation"], { target: { value: "dummypw" } });

      await waitFor(() => {
        expect(onChangeFields["first_name"].value).toBe("Peter");
        expect(onChangeFields["last_name"].value).toBe("Smith");
        expect(onChangeFields["address"].value).toBe("Stara Zagora");
        expect(onChangeFields["date_of_birth"].value).toBe("2000-05-12");
        expect(onChangeFields["username"].value).toBe("dummyusername");
        expect(onChangeFields["email"].value).toBe("dummymail@mail.com");
        expect(onChangeFields["password"].value).toBe("dummypw");
        expect(onChangeFields["password_confirmation"].value).toBe("dummypw");
      })
    });
  });

  describe("Test Form Submit requests", () => {
    test("If User is registered succesffully it should redirect to /login and display success message from JSON response", async () => {
      useAuth.mockImplementation(() => ({"userType": 0}))
      const { container } = render(RenderHelper(<RegisterForm />));
      let onChangeFields = getOnChangeFields(container);

      fireEvent.change(onChangeFields["first_name"],            { target: { value: "Peter" } });
      fireEvent.change(onChangeFields["last_name"],             { target: { value: "Smith" } });
      fireEvent.change(onChangeFields["address"],               { target: { value: "Stara Zagora" } });
      fireEvent.change(onChangeFields["date_of_birth"],         { target: { value: "2000-05-12" } });
      fireEvent.change(onChangeFields["username"],              { target: { value: "dummyusername" } });
      fireEvent.change(onChangeFields["email"],                 { target: { value: "dummymail@mail.com" } });
      fireEvent.change(onChangeFields["password"],              { target: { value: "dummypw" } });
      fireEvent.change(onChangeFields["password_confirmation"], { target: { value: "dummypw" } });
      expect(onChangeFields["first_name"]).toBeValid()
      expect(onChangeFields["last_name"]).toBeValid()
      expect(onChangeFields["address"]).toBeValid()
      expect(onChangeFields["date_of_birth"]).toBeValid()
      expect(onChangeFields["username"]).toBeValid()
      expect(onChangeFields["email"]).toBeValid()
      expect(onChangeFields["password"]).toBeValid()
      expect(onChangeFields["password_confirmation"]).toBeValid()

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(window.location.pathname).toEqual('/login');
        expect(screen.getAllByText('You have registered successfully!')[0]).toBeInTheDocument();
      });
    });

    test("If User didn't register(status=422), it should display AuthAlert message, \
      form field errors from JSON response. It should also remove 'error' class \
        from parent div on input fields change", async () => {
      useAuth.mockImplementation(() => ({"userType": 0}))

      server.use(
        rest.post(`http://${window.location.hostname}:3000/api/v1/users/sign_up`, (req, res, ctx) => {
          return res(
            ctx.status(422),
            ctx.json({ errors: {
              "first_name":            ["is invalid."],
              "last_name":             ["is invalid."],
              "address":               ["cannot be blank."],
              "username":              ["has already been taken."], 
              "password":              ["is too short."], 
              "password_confirmation": ["didn't match password"],
              "date_of_birth":         ["cannot be in the future."],
              "email":                 ["has already been taken."]
            } })
          );
        }),
      );

      const { container } = render(RenderHelper(<RegisterForm />))

      const inputParentDivs = {
        "first_name":            container.querySelector('#first_name'),
        "last_name":             container.querySelector('#last_name'),
        "address":               container.querySelector('#address'),
        "date_of_birth":         container.querySelector('#date_of_birth'),
        "username":              container.querySelector('#username'),
        "email":                 container.querySelector('#email'),
        "password":              container.querySelector('#password'),
        "password_confirmation": container.querySelector('#password_confirmation')
      }

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText("Error! Couldn't create your account!")).toBeInTheDocument();

        expect(inputParentDivs["first_name"].classList.contains("error")).toBe(true);
        expect(inputParentDivs["last_name"].classList.contains("error")).toBe(true);
        expect(inputParentDivs["address"].classList.contains("error")).toBe(true);
        expect(inputParentDivs["username"].classList.contains("error")).toBe(true);
        expect(inputParentDivs["password"].classList.contains("error")).toBe(true);
        expect(inputParentDivs["password_confirmation"].classList.contains("error")).toBe(true);
        expect(inputParentDivs["date_of_birth"].classList.contains("error")).toBe(true);
        expect(inputParentDivs["email"].classList.contains("error")).toBe(true);

        // Form fields error description
        expect(inputParentDivs["first_name"].lastChild.textContent).toBe('is invalid.');
        expect(inputParentDivs["last_name"].lastChild.textContent).toBe('is invalid.');
        expect(inputParentDivs["address"].lastChild.textContent).toBe('cannot be blank.');
        expect(inputParentDivs["username"].lastChild.textContent).toBe("has already been taken.");
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
        fireEvent.change(onChangeFields["password"],              { target: { value: "dummypw" } });
        fireEvent.change(onChangeFields["password_confirmation"], { target: { value: "dummypw" } });
        expect(inputParentDivs["first_name"].classList.contains("error")).toBe(false);
        expect(inputParentDivs["last_name"].classList.contains("error")).toBe(false);
        expect(inputParentDivs["address"].classList.contains("error")).toBe(false);
        expect(inputParentDivs["username"].classList.contains("error")).toBe(false);
        expect(inputParentDivs["password"].classList.contains("error")).toBe(false);
        expect(inputParentDivs["password_confirmation"].classList.contains("error")).toBe(false);
        expect(inputParentDivs["date_of_birth"].classList.contains("error")).toBe(false);
        expect(inputParentDivs["email"].classList.contains("error")).toBe(false);
      });
    });
  });
})
