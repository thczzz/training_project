import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useAuth } from "../../../hooks/authHook";
import GlobalProvider from "../../../GlobalContext";
import { Notification } from "../../../components/Alerts/Notification";
import { server } from "../../../mocks/server";
import { rest } from 'msw'
import { LoginView } from "../../../views/LoginView";
import ResetPasswordForm from "../../../components/Auth/ResetPassword";

jest.mock('../../../hooks/authHook.jsx', () => ({ useAuth: jest.fn() }))

describe("Test ResetPasswordForm Component", () => {
  function getOnChangeFields (container) {
    return {
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
      const { container } = render(RenderHelper(<ResetPasswordForm />));
      const form_fields = getOnChangeFields(container);

      await waitFor(() => {
        expect(form_fields["password"]).toBeInTheDocument();
        expect(form_fields["password_confirmation"]).toBeInTheDocument();
        expect(screen.getByRole("button").textContent).toEqual("Reset Password");
      })
      
    });

    test("onChange events on fields should change their value", async () => {
      const { container } = render(RenderHelper(<ResetPasswordForm />));
      const onChangeFields = getOnChangeFields(container);

      expect(onChangeFields["password"].value).toEqual('');
      expect(onChangeFields["password_confirmation"].value).toEqual('');
      fireEvent.change(onChangeFields["password"],              { target: { value: "dummypw" } });
      fireEvent.change(onChangeFields["password_confirmation"], { target: { value: "dummypw" } });

      await waitFor(() => {
        expect(onChangeFields["password"].value).toEqual('dummypw');
        expect(onChangeFields["password_confirmation"].value).toEqual('dummypw');
      })
    });
  });

  describe("Test Form Submit requests", () => {
    test("When Password is changed succesffully it should redirect to /login and display static success message", async () => {
      useAuth.mockImplementation(() => ({"userType": 0}))

      render(RenderHelper(<ResetPasswordForm />));

      fireEvent.click(screen.getByRole('button'));
    
      await waitFor(() => {
        expect(window.location.pathname).toEqual('/login');
        expect(screen.getAllByText(/Your password was changed successfully!/)[0]).toBeInTheDocument();
      })
    });

    test("When PW change was unsuccessful, it should display form field errors from JSON response if \
      any(e.g pws do not match). It should also remove 'error' class \
        from parent div on input fields change", async () => {
          
      server.use(
        rest.patch(`http://${window.location.hostname}/api/v1/users/password`, (req, res, ctx) => {
          return res(
            ctx.status(422),
            ctx.json({ errors: {
              "password":              ["is too short."],
              "password_confirmation": ["didn't match password"],
            } })
          );
        }),
      );

      const { container } = render(RenderHelper(<ResetPasswordForm />));

      const inputParentDivs = {
        "password":              container.querySelector('#password'),
        "password_confirmation": container.querySelector('#password_confirmation')
      }

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(inputParentDivs["password"].classList.contains("error")).toBe(true);
        expect(inputParentDivs["password_confirmation"].classList.contains("error")).toBe(true);

        expect(inputParentDivs["password"].lastChild.textContent).toBe("is too short.");
        expect(inputParentDivs["password_confirmation"].lastChild.textContent).toBe("didn't match password");

        const onChangeFields = getOnChangeFields(container);
        fireEvent.change(onChangeFields["password"],              { target: { value: "dummypw" } });
        fireEvent.change(onChangeFields["password_confirmation"], { target: { value: "dummypw" } });
        expect(inputParentDivs["password"].classList.contains("error")).toBe(false);
        expect(inputParentDivs["password_confirmation"].classList.contains("error")).toBe(false);
      })
    });

    test("When PW change was unsuccessful with no input fields errors (most likely: token is invalid), \
      it should set and show Error Alert message", async () => {
        
      server.use(
        rest.patch(`http://${window.location.hostname}/api/v1/users/password`, (req, res, ctx) => {
          return res(
            ctx.status(422),
            ctx.json({ errors: {
              "password_reset_token": ["invalid"]
            } })
          );
        }),
      );

      const { container } = render(RenderHelper(<ResetPasswordForm />));

      const inputParentDivs = {
        "password":              container.querySelector('#password'),
        "password_confirmation": container.querySelector('#password_confirmation')
      }

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(inputParentDivs["password"].classList.contains("error")).toBe(false);
        expect(inputParentDivs["password_confirmation"].classList.contains("error")).toBe(false);
        expect(screen.getByText('Your Password reset token is invalid')).toBeInTheDocument();
      })
    });
  });

})
