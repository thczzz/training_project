import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { ConfirmEmailByToken } from "../../../components/Auth/ConfirmEmail";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useAuth } from "../../../hooks/authHook";
import GlobalProvider from "../../../GlobalContext";
import { LoginView } from "../../../views/LoginView";
import { DoctorDashboardView } from "../../../views/DoctorDashboardView";
import { PatientDashboardView } from "../../../views/PatientDashboardView";
import { EmailActivationView } from "../../../views/EmailActivationView";
import { server } from "../../../mocks/server";
import { rest } from 'msw'
import { Notification } from "../../../components/Alerts/Notification";

jest.mock('../../../hooks/authHook.jsx', () => ({ useAuth: jest.fn() }))

describe("Confirming Email tests", () => {
  const RenderHelper = (children) => {
    return (
      <Router>
          <GlobalProvider>
            <Notification show={true} />
            {children},
            <Routes>
              <Route path='/login' element={<LoginView/>} />
              <Route path='/req_account_activation_link' element={<EmailActivationView/>} />
              <Route path='/doctor' element={<DoctorDashboardView/>} />
              <Route path='/patient' element={<PatientDashboardView/>} />
            </Routes>
          </GlobalProvider>
      </Router>
    )
  }

  describe("When User is Anonymous", () => {
    test("When Successfully confirmed", async () => {
      useAuth.mockImplementation(() => ({"userType": 0}))
  
      render(
        RenderHelper(<ConfirmEmailByToken />)
      );
  
      await waitFor(() => {
        expect(window.location.pathname).toEqual('/login');
        expect(screen.getByText('You confirmed your email successfully! You can now login with your new email')).toBeInTheDocument();
      })
    });

    test("When Failed to confirm", async () => {
      useAuth.mockImplementation(() => ({"userType": 0}))

      server.use(
        rest.get(`http://localhost:3000/api/v1/users/confirmation`, (req, res, ctx) => {
          return res(
            ctx.status(401),
            ctx.json({ "confirmation_token": "is invalid" })
          );
        }),
      );
  
      render(
        RenderHelper(<ConfirmEmailByToken />)
      );
  
      await waitFor(() => {
        expect(window.location.pathname).toEqual('/req_account_activation_link');
        expect(screen.getByText('Your Email confirmation token is invalid')).toBeInTheDocument();
      })
    });
  });

  describe("When User is a Doctor", () => {
    test("When Successfully confirmed", async () => {
      useAuth.mockImplementation(() => ({"userType": 2}))
  
      render(
        RenderHelper(<ConfirmEmailByToken />)
      );
  
      await waitFor(() => {
        expect(window.location.pathname).toEqual('/doctor');
        expect(screen.getByText('You confirmed your email successfully!')).toBeInTheDocument();
      })
    });

    test("When Failed to confirm", async () => {
      useAuth.mockImplementation(() => ({"userType": 2}))

      server.use(
        rest.get(`http://localhost:3000/api/v1/users/confirmation`, (req, res, ctx) => {
          return res(
            ctx.status(401),
            ctx.json({ "confirmation_token": "is invalid" })
          );
        }),
      );
  
      render(
        RenderHelper(<ConfirmEmailByToken />)
      );
  
      await waitFor(() => {
        expect(window.location.pathname).toEqual('/doctor');
        expect(screen.getByText('Your Email confirmation token is invalid')).toBeInTheDocument();
      })
    });
  });

  describe("When User is a Patient", () => {
    test("When Successfully confirmed", async () => {
      useAuth.mockImplementation(() => ({"userType": 3}))
  
      render(
        RenderHelper(<ConfirmEmailByToken />)
      );
  
      await waitFor(() => {
        expect(window.location.pathname).toEqual('/patient');
        expect(screen.getByText('You confirmed your email successfully!')).toBeInTheDocument();
      })
    });

    test("When Failed to confirm", async () => {
      useAuth.mockImplementation(() => ({"userType": 3}))

      server.use(
        rest.get(`http://localhost:3000/api/v1/users/confirmation`, (req, res, ctx) => {
          return res(
            ctx.status(401),
            ctx.json({ "confirmation_token": "is invalid" })
          );
        }),
      );
  
      render(
        RenderHelper(<ConfirmEmailByToken />)
      );
  
      await waitFor(() => {
        expect(window.location.pathname).toEqual('/patient');
        expect(screen.getByText('Your Email confirmation token is invalid')).toBeInTheDocument();
      })
    });
  });

})
