import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router} from 'react-router-dom'
import GlobalProvider from "../../../GlobalContext";
import { Notification } from "../../../components/Alerts/Notification";
import { server } from "../../../mocks/server";
import { rest } from 'msw'
import Perscription from "../../../components/DocForms/Perscription";
import userEvent from '@testing-library/user-event'

describe("Test the Perscription Component", () => {
  ///////// Also tested SearchExamination, SearchExaminationTemplate /////////
  const dummyUser_id = "1";
  const dummyExamination_id = "7";
  const dummyDrug_id = "3";

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

  describe("Test behaviour of SearchExamination and SearchExaminationTemplate", () => {
    test("When selecting a User from search -> it should load user's examinations", async () => {
      const { container } = render(RenderHelper(<Perscription />));

      expect(container.querySelector("select>option").textContent).toEqual("Nothing found");

      await waitFor(() => {
        fireEvent.change(container.querySelector('input[name="user_id"]'), { target: { value: "dummy" } });

        // Selecting the dummyuser
        fireEvent.click(container.querySelector('ul>li[id="1"]'));
      })

      await waitFor(() => {
        expect(container.querySelectorAll("select>option")[0].textContent).toEqual("Select Patient's Examination");
        expect(container.querySelectorAll("select>option")[0].disabled).toBe(true);
        expect(container.querySelectorAll("select>option")[0].selected).toBe(true);
        expect(container.querySelector(`option[id="${dummyExamination_id}"]`)).toBeInTheDocument();
        expect(container.querySelector(`option[id="${dummyExamination_id}"]`).selected).toBe(false);
        expect(container.querySelector(`option[id="${dummyExamination_id}"]`).textContent).toEqual("Examination - (2/13/2023, 2:35:31 PM)")
      })
    });
  });

  describe("Test HTML fields validation on Select Examination field", () => {
    test("It should not be valid when nothing is selected", async () => {
      const { container } = render(RenderHelper(<Perscription />));

      await waitFor(() => {
        expect(container.querySelector("select")).toBeInvalid();
      })
    })
  });

  describe("Test Submit of Perscription Form", () => {
    test("On success, it should reset the Form and display static success message", async () => {
      const user = userEvent.setup()

      const { container } = render(RenderHelper(<Perscription />));

      await user.type(container.querySelector('input[name="user_id"]'), "dummy" );
      await waitFor(() => {
        userEvent.click(container.querySelector(`li[id="1"]`));
        expect(container.querySelector('input[name="user_id"]').value).toEqual('dummyuser');
      })

      await user.type(container.querySelector('input[name="Drug"]'), "asp" );
      await waitFor(() => {
        userEvent.click(container.querySelector(`ul>li[id="${dummyDrug_id}"]`));
        expect(container.querySelector('input[name="Drug"]').value).toEqual('Aspirin 200mg');
      })

      await waitFor(() => {
        fireEvent.change(container.querySelector("select"), { target: { value: 2 } })
      })

      await user.type(container.querySelector('textarea[name="description"]'), "Perscription description." );
      await user.type(container.querySelector('textarea[name="usage_description"]'), "Drug usage descr." );

      user.click(container.querySelector('button[name="attachDrug"]'));
      user.click(container.querySelector("#submit"));
      
      await waitFor(() => {
        expect(screen.getByText(/Perscription was created successfully/)).toBeInTheDocument();
        expect(container.querySelector('input[name="user_id"]').value).toEqual('');
        expect(container.querySelector('input[name="user_id"]').id).toEqual('');
        expect(container.querySelector('input[name="Drug"]').value).toEqual('');
        expect(container.querySelector("select>option").textContent).toEqual("Nothing found");
        expect(container.querySelector('textarea[name="description"]').value).toEqual('');
        expect(container.querySelector('textarea[name="usage_description"]').value).toEqual('');
      })
    });

    test("On failure, it should display error notification with text from JSON response and NOT reset the form", async () => {
      const user = userEvent.setup();

      server.use(
        rest.post(`http://${window.location.hostname}/api/v1/doctors/create_perscription`, (req, res, ctx) => {
          return res(
            ctx.status(422),
            ctx.json({ errors: [["Error message from API"]] })
          );
        })
      );

      const { container } = render(RenderHelper(<Perscription />));

      await user.type(container.querySelector('input[name="user_id"]'), "dummy" );
      await waitFor(() => {
        userEvent.click(container.querySelector(`li[id="1"]`));
        expect(container.querySelector('input[name="user_id"]').value).toEqual('dummyuser');
      })

      await user.type(container.querySelector('input[name="Drug"]'), "asp" );
      await waitFor(() => {
        userEvent.click(container.querySelector(`ul>li[id="${dummyDrug_id}"]`));
        expect(container.querySelector('input[name="Drug"]').value).toEqual('Aspirin 200mg');
      })

      await waitFor(() => {
        fireEvent.change(container.querySelector("select"), { target: { value: 2 } })
      })

      await user.type(container.querySelector('textarea[name="description"]'), "Perscription description." );
      // await user.type(container.querySelector('textarea[name="usage_description"]'), "Drug usage descr." );

      await waitFor(() => {
        fireEvent.change(container.querySelector('textarea[name="usage_description"]'), { target: { value: "Drug usage descr." } })
        user.click(container.querySelector('button[name="attachDrug"]'));
        user.click(container.querySelector("#submit"));

        expect(screen.getByText(/Error message from API/)).toBeInTheDocument();
        expect(container.querySelector('input[name="user_id"]').value).toEqual('dummyuser');
        expect(container.querySelector('input[name="user_id"]').id).toEqual(dummyUser_id);
        expect(container.querySelector(`option[id="${dummyExamination_id}"]`).selected).toBe(true);
        expect(container.querySelector('textarea[name="description"]').value).toEqual('Perscription description.');
        expect(container.querySelector('textarea[name="usage_description"]').value).toEqual('Drug usage descr.');
      });

    });
  });
})
