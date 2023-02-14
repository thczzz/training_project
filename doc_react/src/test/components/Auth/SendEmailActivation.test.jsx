import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from 'react-router-dom'
import GlobalProvider from "../../../GlobalContext";
import { Notification } from "../../../components/Alerts/Notification";
import ReSendEmailActivationForm from "../../../components/Auth/SendEmailActivation";

describe("Test ReSendEmailActivationForm Component", () => {
  const RenderHelper = (children) => {
    return (
      <Router>
          <GlobalProvider>
            <Notification show={true} />
            {children},
          </GlobalProvider>
      </Router>
    )
  }

  describe("Test the form fields", () => {
    test("The Form should have", async () => {
      const { container } = render(RenderHelper(<ReSendEmailActivationForm />));

      await waitFor(() => {
        expect(container.querySelector('input[name="email"]')).toBeInTheDocument();
        expect(screen.getByRole("button").textContent).toEqual("Request new Activation Link");
        const links = screen.getAllByRole('link');
        expect(links[0].href).toEqual(window.location + 'login');
      })
    });

    test("If email's onChange handler works as expected", async () => {
      const { container } = render(RenderHelper(<ReSendEmailActivationForm />));

      expect(container.querySelector('input[name="email"]').value).toEqual('');

      fireEvent.change(container.querySelector('input[name="email"]'), { target: { value: "dummymail@mail.com" } });
      await waitFor(() => {
        expect(container.querySelector('input[name="email"]').value).toEqual('dummymail@mail.com');
      })
    });
  });

  describe("Test Form Submit request", () => {
    test("On Success it should return and set success message from JSON resp. and reset the email input field", async () => {
      const { container } = render(RenderHelper(<ReSendEmailActivationForm />));

      fireEvent.change(container.querySelector('input[name="email"]'), { target: { value: "dummymail@mail.com" } });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Email Activation request was sent successfully.')).toBeInTheDocument();
        fireEvent.change(container.querySelector('input[name="email"]'), { target: { value: "" } });
      })
    });
  });
})
