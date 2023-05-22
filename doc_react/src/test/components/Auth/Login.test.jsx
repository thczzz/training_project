import React from "react";
import { render, screen, fireEvent, waitFor, act, cleanup } from "@testing-library/react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useAuth } from "../../../hooks/authHook";
import GlobalProvider from "../../../GlobalContext";
import { DoctorDashboardView } from "../../../views/DoctorDashboardView";
import { PatientDashboardView } from "../../../views/PatientDashboardView";
import { Notification } from "../../../components/Alerts/Notification";
import { server } from "../../../mocks/server";
import { rest } from 'msw'
import LoginForm from "../../../components/Auth/Login";

jest.mock('../../../hooks/authHook.jsx', () => ({ useAuth: jest.fn() }))

describe("Test Login Form Component", () => {
  const RenderHelper = (children) => {
    return (
      <Router>
          <GlobalProvider>
            <Notification show={true} />
            {children},
            <Routes>
              <Route path='/doctor' element={<DoctorDashboardView/>} />
              <Route path='/patient' element={<PatientDashboardView/>} />
            </Routes>
          </GlobalProvider>
      </Router>
    )
  }

  describe("Test the Form Element", () => {
    test("It should contain", async () => {
      useAuth.mockImplementation(() => ({"userType": 0}))
  
      render(
        RenderHelper(<LoginForm />)
      );
  
      await waitFor(() => {
        expect(screen.getByPlaceholderText("user@example.com")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Type your password")).toBeInTheDocument();
        expect(screen.getByText('Forgot password?')).toBeInTheDocument();
        expect(screen.getByText('Not a member?')).toBeInTheDocument();
        expect(screen.getByText('Account not active ?')).toBeInTheDocument();
        expect(screen.getByText('LOGIN', {exact: true})).toBeInTheDocument(); // The Submit Button

        const links = screen.getAllByRole('link');
        expect(links[0].href).toEqual(window.location + 'req_password_reset');
        expect(links[1].href).toEqual(window.location + 'register');
        expect(links[2].href).toEqual(window.location + 'req_account_activation_link');
        expect(links.length).toEqual(3);
      })
    });

    test("HTML expected Validation on form fields", async () => {
      useAuth.mockImplementation(() => ({"userType": 0}))
  
      render(
        RenderHelper(<LoginForm />)
      );

      fireEvent.change(screen.getByPlaceholderText("user@example.com"), { target: { value: "invalidEmail" } })

      await waitFor(() => {
        expect(screen.getByPlaceholderText("user@example.com")).toBeInvalid();
        expect(screen.getByPlaceholderText("Type your password")).toBeInvalid();
      })
    });

    test("It should change email and pw inputs onChange", async () => {
      useAuth.mockImplementation(() => ({"userType": 0}))
  
      render(
        RenderHelper(<LoginForm />)
      );
      
      const emailInput = screen.getByPlaceholderText("user@example.com");
      const pwInput    = screen.getByPlaceholderText("Type your password");

      fireEvent.change(emailInput, { target: { value: "dummymail@abv.bg" } });
      fireEvent.change(pwInput,    { target: { value: "dummypw" } });

      await waitFor(() => {
        expect(emailInput.value).toBe("dummymail@abv.bg");
        expect(pwInput.value).toBe("dummypw");
      })
    })
  });

  describe("Test Handling Submit(Login request)", () => {
    test("On Successfull log in as Patient it should return success message and redirect", async () => {
      useAuth.mockImplementation(() => ({"userType": 3}))
  
      render(
        RenderHelper(<LoginForm />)
      );

      fireEvent.change(screen.getByPlaceholderText("user@example.com"), { target: { value: "dummymail@mail.com" } });
      fireEvent.change(screen.getByPlaceholderText("Type your password"), { target: { value: "dummypw" } });
      
      expect(screen.getByPlaceholderText("user@example.com")).toBeValid();
      expect(screen.getByPlaceholderText("Type your password")).toBeValid();
      
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Success! Redirecting..')).toBeInTheDocument();
        expect(window.location.pathname).toEqual('/patient');
        expect(screen.getByPlaceholderText("user@example.com").value).toEqual('');
        expect(screen.getByPlaceholderText("Type your password").value).toEqual('');
      })
    });

    test("On Successfull log in as Doctor it should return success message and redirect", async () => {
      useAuth.mockImplementation(() => ({"userType": 2}))
  
      render(
        RenderHelper(<LoginForm />)
      );

      fireEvent.change(screen.getByPlaceholderText("user@example.com"), { target: { value: "dummymail@mail.com" } });
      fireEvent.change(screen.getByPlaceholderText("Type your password"), { target: { value: "dummypw" } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Success! Redirecting..')).toBeInTheDocument();
        expect(window.location.pathname).toEqual('/doctor');
        expect(screen.getByPlaceholderText("user@example.com").value).toEqual('');
        expect(screen.getByPlaceholderText("Type your password").value).toEqual('');
      })
    })

    test("Failure to log in (Status 400) Should return Error message", async () => {
      useAuth.mockImplementation(() => ({"userType": 0}))

      server.use(
        rest.post(`http://${window.location.hostname}:3000/api/v1/oauth/token`, (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({ success: false })
          );
        }),
      );

      render(
        RenderHelper(<LoginForm />)
      );

      fireEvent.change(screen.getByPlaceholderText("user@example.com"), { target: { value: "dummymail@mail.com" } });
      fireEvent.change(screen.getByPlaceholderText("Type your password"), { target: { value: "dummypw" } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Error! Wrong Email or Password!')).toBeInTheDocument();
        expect(screen.getByPlaceholderText("user@example.com").value).toEqual('');
        expect(screen.getByPlaceholderText("Type your password").value).toEqual('');
      })

    })

    test("Failure to log in (Status !== 400) Should return Error message from API response", async () => {
      useAuth.mockImplementation(() => ({"userType": 0}))

      server.use(
        rest.post(`http://${window.location.hostname}:3000/api/v1/oauth/token`, (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({ message: "Error message from API response." })
          );
        }),
      );

      render(
        RenderHelper(<LoginForm />)
      );

      fireEvent.change(screen.getByPlaceholderText("user@example.com"), { target: { value: "dummymail@mail.com" } });
      fireEvent.change(screen.getByPlaceholderText("Type your password"), { target: { value: "dummypw" } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Error message from API response.')).toBeInTheDocument();
        expect(screen.getByPlaceholderText("user@example.com").value).toEqual('');
        expect(screen.getByPlaceholderText("Type your password").value).toEqual('');
      })
    })
  });
})
