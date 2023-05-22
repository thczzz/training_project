import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useAuth } from "../../../hooks/authHook";
import GlobalProvider from "../../../GlobalContext";
import { Notification } from "../../../components/Alerts/Notification";
import { server } from "../../../mocks/server";
import { rest } from 'msw'
import { LoginView } from "../../../views/LoginView";
import { Logout } from "../../../components/Auth/Logout";

jest.mock('../../../hooks/authHook.jsx', () => ({ useAuth: jest.fn() }))

describe("Test Logout Component", () => {
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

  describe("Test Handling Logout request", () => {
    test("On Successfull log out It should redirect to the /login page, \
      display success message, clear LocalStorage and set userType to null", async () => {

      let userType = 2;
      const manuallySetUserType = (value) => {
        userType = value;
      }

      useAuth.mockImplementation(() => ({"userType": userType, "manuallySetUserType": manuallySetUserType}));
      localStorage.setItem("testing", ["hello"]);

      expect(localStorage.getItem("testing")).toEqual("hello")
  
      render(
        RenderHelper(<Logout />)
      );

      await waitFor(() => {
        expect(window.location.pathname).toEqual('/login');
        expect(screen.getByText('You logged out.')).toBeInTheDocument();
        expect(localStorage.getItem("testing")).toEqual(null);
        expect(userType).toEqual(null);
      })
    });

    test("On Unsuccessfull logout (status !== 200), It should display Error message", async () => {
      let userType = 2;
      const manuallySetUserType = (value) => {
        userType = value;
      }

      useAuth.mockImplementation(() => ({"userType": userType, "manuallySetUserType": manuallySetUserType}));
      localStorage.setItem("testing", ["hello"]);

      expect(localStorage.getItem("testing")).toEqual("hello");

      server.use(
        rest.post(`http://${window.location.hostname}:3000/api/v1/oauth/revoke`, (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({ success: false })
          );
        }),
      );

      render(
        RenderHelper(<Logout />)
      );

      await waitFor(() => {
        expect(screen.getByText('Failed to log out, please try again.')).toBeInTheDocument();
        expect(localStorage.getItem("testing")).toEqual("hello");
        expect(userType).toEqual(2);
      })
    });

  })
})
