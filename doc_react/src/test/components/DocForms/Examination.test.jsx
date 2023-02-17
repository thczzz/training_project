import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router} from 'react-router-dom'
import GlobalProvider from "../../../GlobalContext";
import { Notification } from "../../../components/Alerts/Notification";
import { server } from "../../../mocks/server";
import { rest } from 'msw'
import Examination from "../../../components/DocForms/Examination";
import userEvent from '@testing-library/user-event'

describe("Test Examination Component", () => {
  ///////// Also tested SearchUser, SearchUserTemplate, SearchDrug, SearchDrugTemplate, PerscriptionFields /////////

  const dummyUser_id = "1";
  const dummyDrug_id = "3";

  function getOnChangeFields (container) {
    return {
      "weight":              container.querySelector('input[name="weight"]'),
      "height":              container.querySelector('input[name="height"]'),
      "anamnesis":           container.querySelector('textarea[name="anamnesis"]'),
      "attach_perscription": container.querySelector('input[name="attach_perscription"]'),
      "user_id":             container.querySelector('input[name="user_id"]'),
    }
  }

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

  describe("Test Examination form fields, without its dependants", () => {
    test("It should contain", async () => {
      const { container } = render(RenderHelper(<Examination />));
      const formFields = getOnChangeFields(container);
  
      await waitFor(() => {
        expect(formFields["weight"]).toBeInTheDocument();
        expect(formFields["height"]).toBeInTheDocument();
        expect(formFields["anamnesis"]).toBeInTheDocument();
        expect(formFields["attach_perscription"]).toBeInTheDocument();
        expect(container.querySelector("#submit")).toBeInTheDocument();
      });
    });

  });

  describe("Test behaviour of SearchUser and SearchUserTemplate", () => {
    test("Presence of expected fields", async () => {
      const { container } = render(RenderHelper(<Examination />));
      
      expect(container.querySelector('input[name="user_id"]')).toBeInTheDocument();
      expect(container.querySelector('input[name="user_id"]').value).toEqual('');
      expect(container.querySelector(`ul>li[id="${dummyUser_id}"]`)).not.toBeInTheDocument();
    });

    test("Changing the input's value should show search results", async () => {
      const { container } = render(RenderHelper(<Examination />));

      fireEvent.change(container.querySelector('input[name="user_id"]'), { target: { value: "dummy" } });

      await waitFor(() => {
        expect(container.querySelector('input[name="user_id"]').value).toEqual('dummy');
        expect(container.querySelector(`ul>li[id="${dummyUser_id}"]`)).toBeInTheDocument();
      })
    });

    test("Clicking on a search result should hide them and set the input's id and value", async () => {
      const { container } = render(RenderHelper(<Examination />));
      let searchUserInput = container.querySelector('input[name="user_id"]');

      fireEvent.change(searchUserInput, { target: { value: "dummy" } });

      await waitFor(() => {
        fireEvent.click(container.querySelector(`ul>li[id="${dummyUser_id}"]`))
      });

      await waitFor(() => {
        expect(container.querySelector(`ul>li[id="${dummyUser_id}"]`)).not.toBeInTheDocument();
        expect(container.querySelector('input[name="user_id"]').id).toEqual(dummyUser_id);
        expect(container.querySelector('input[name="user_id"]').value).toEqual("dummyuser");
      });
    });
  });

  describe("Test behaviour of PerscriptionFields and it's dependants (SearchDrug and SearchDrugTemplate)", () => {
    test("Presence of expected fields", async () => {
      const { container } = render(RenderHelper(<Examination />));
      fireEvent.click(container.querySelector('input[name="attach_perscription"]'));

      await waitFor(() => {
        // Perscription Description
        expect(container.querySelector('textarea[name="description"]')).toBeInTheDocument();

        // Drug Container fields
        expect(container.querySelectorAll('input[name="Drug"]').length).toEqual(1) // Drug Search input
        expect(container.querySelectorAll('textarea[name="usage_description"]').length).toEqual(1) // Drug usage_description
      })
    });

    test("When drugContainer is not Attached yet", async () => {
      const { container } = render(RenderHelper(<Examination />));
      fireEvent.click(container.querySelector('input[name="attach_perscription"]'));

      await waitFor(() => {
        expect(container.querySelector('button[name="drugContainerBtn"]').textContent).toEqual("New drug");
        expect(container.querySelectorAll('input[name="drug_id"]').length).toEqual(0) // Attached drugs
        expect(container.querySelectorAll('input[name="Drug"]').length).toEqual(1) // drugContainer Search input
      })
    });

    test("Clicking on Add new Drug should add new drugContainer to the DOM", async () => {
      const { container } = render(RenderHelper(<Examination />));
      fireEvent.click(container.querySelector('input[name="attach_perscription"]'));

      expect(container.querySelectorAll('input[name="Drug"]').length).toEqual(1)

      fireEvent.click(container.querySelector('button[name="addNewDrugBtn"]'));

      await waitFor(() => {
        // Drug Container fields
        expect(container.querySelectorAll('input[name="Drug"]').length).toEqual(2)
        expect(container.querySelectorAll('textarea[name="usage_description"]').length).toEqual(2)
      })
    });

    test("Clicking on a drugContainer should add/remove class 'active' and show/hide the collapsible-content", async () => {
      const { container } = render(RenderHelper(<Examination />));
      fireEvent.click(container.querySelector('input[name="attach_perscription"]'));

      expect(container.querySelector('button[name="drugContainerBtn"]').classList.contains("active")).toBe(false);
      expect(container.querySelector('button[name="drugContainerBtn"]').nextElementSibling.style.maxHeight).toBe("");
      fireEvent.click(container.querySelector('button[name="drugContainerBtn"]'));

      await waitFor(() => {
        expect(container.querySelector('button[name="drugContainerBtn"]').classList.contains("active")).toBe(true);
        expect(container.querySelector('button[name="drugContainerBtn"]').nextElementSibling.style.maxHeight).toEqual("100%");
      })

      fireEvent.click(container.querySelector('button[name="drugContainerBtn"]'));

      await waitFor(() => {
        expect(container.querySelector('button[name="drugContainerBtn"]').classList.contains("active")).toBe(false);
        expect(container.querySelector('button[name="drugContainerBtn"]').nextElementSibling.style.maxHeight).toBe("");
      })
    });

    test("When attempting to attach a drug without name and description it should show errors", async () => {
      const { container } = render(RenderHelper(<Examination />));
      fireEvent.click(container.querySelector('input[name="attach_perscription"]'));

      let textAreaGroup = container.querySelector('button[name="attachDrug"]').parentNode.previousElementSibling;
      let drugNameInputGroup = textAreaGroup.previousElementSibling;

      expect(textAreaGroup.classList.contains("error")).toBe(false);
      expect(drugNameInputGroup.classList.contains("error")).toBe(false);

      fireEvent.click(container.querySelector('button[name="attachDrug"]'));

      await waitFor(() => {
        expect(textAreaGroup.classList.contains("error")).toBe(true);
        expect(textAreaGroup.lastChild.textContent).toEqual("Description is a required field.");
        expect(drugNameInputGroup.classList.contains("error")).toBe(true);
        expect(drugNameInputGroup.lastChild.textContent).toEqual("Drug is a required field.");
      });
    });

    test("When Searching a Drug, it should show search results, \
      after clicking a result it should hide them and set the drugInput.value and id as the result from the API call", async () => {
        const { container } = render(RenderHelper(<Examination />));
        fireEvent.click(container.querySelector('input[name="attach_perscription"]'));

        expect(container.querySelectorAll('ul>li[id="3"]').length).toEqual(0);

        fireEvent.change(container.querySelector('input[name="Drug"]'), { target: { value: "asp" } });

        await waitFor(() => {
          expect(container.querySelector('ul>li[id="3"]').textContent).toEqual("Aspirin 200mg");
          fireEvent.click(container.querySelector('ul>li[id="3"]'));

          expect(container.querySelector('input[name="Drug"]').id).toEqual(dummyDrug_id);
          expect(container.querySelector('input[name="Drug"]').value).toEqual("Aspirin 200mg");
        })
    });

    test("After successfully attaching a Drug, it should set the drugContainerButton's textContent as the selected Drug's name, \
      it should disable everything inside the drugContainer except for the Remove button", async () => {
      const { container } = render(RenderHelper(<Examination />));
      fireEvent.click(container.querySelector('input[name="attach_perscription"]'));

      fireEvent.change(container.querySelector('input[name="Drug"]'), { target: { value: "asp" } });

      await waitFor(() => {
        fireEvent.click(container.querySelector('ul>li[id="3"]'));
        fireEvent.change(container.querySelector('textarea[name="usage_description"]'), {target: {value: "Drug usage_description" }});
        fireEvent.click(container.querySelector('button[name="attachDrug"]'));
      })

      await waitFor(() => {
        // container.querySelector('input[name="drug_id"]') => Attached Drug Containers
        expect(container.querySelector('input[name="drug_id"]').disabled).toBe(true);
        expect(container.querySelector('textarea[name="usage_description"]').disabled).toBe(true);
        expect(container.querySelector('button[name="drugContainerBtn"]').textContent).toEqual("Aspirin 200mg");
        expect(container.querySelector('input[name="drug_id"]').value).toEqual("Aspirin 200mg");
        expect(container.querySelector('textarea[name="usage_description"]').value).toEqual("Drug usage_description");
        expect(container.querySelector('button[name="attachDrug"]').disabled).toBe(true);
        expect(container.querySelector('button[name="removeDrugContainerBtn"]').disabled).toBe(false);
      })
    });
  });

  describe("Test Examination Form HTML validation", () => {
    test("If fields are invalid with invalid data", async () => {
      const { container } = render(RenderHelper(<Examination />));
      fireEvent.click(container.querySelector('input[name="attach_perscription"]'));
      fireEvent.change(container.querySelector('input[name="weight"]'), { target: { value: "notANumber" } });
      fireEvent.change(container.querySelector('input[name="height"]'), { target: { value: "notANumber" } });

      await waitFor(() => {
        expect(container.querySelector('input[name="user_id"]')).toBeInvalid();
        expect(container.querySelector('input[name="weight"]')).toBeInvalid();
        expect(container.querySelector('input[name="height"]')).toBeInvalid();
        expect(container.querySelector('textarea[name="anamnesis"]')).toBeInvalid();

        // Perscription fields
        expect(container.querySelector('textarea[name="description"]')).toBeInvalid();

        // Drug Container fields
        expect(container.querySelector('input[name="Drug"]')).toBeInvalid(); // Drug Search input
        expect(container.querySelector('textarea[name="usage_description"]')).toBeInvalid();
      })

    });
  });

  describe("Test Form Submit", () => {
    test("On Success, it Should reset the form fields and display Static Success message", async () => {
      const user = userEvent.setup()
      const { container } = render(RenderHelper(<Examination />));

      fireEvent.click(container.querySelector('input[name="attach_perscription"]'));

      container.querySelector('input[name="weight"]').value = "99";
      container.querySelector('input[name="height"]').value = "188";
      container.querySelector('textarea[name="anamnesis"]').value = "Anamnesis text";
      container.querySelector('textarea[name="description"]').value = "Perscription description";
      container.querySelector('textarea[name="usage_description"]').value = "Drug usage_description";
      container.querySelector('input[name="user_id"]').id = "1";
      container.querySelector('input[name="user_id"]').value = 'dummyuser';

      await user.type(container.querySelector('input[name="Drug"]'), "asp" );
      await waitFor(() => {
        userEvent.click(container.querySelector(`ul>li[id="${dummyDrug_id}"]`));
        expect(container.querySelector('input[name="Drug"]').value).toEqual('Aspirin 200mg');
      })

      expect(container.querySelector('input[name="weight"]')).toBeValid();
      expect(container.querySelector('input[name="height"]')).toBeValid();
      expect(container.querySelector('textarea[name="anamnesis"]')).toBeValid();
      expect(container.querySelector('textarea[name="description"]')).toBeValid();
      expect(container.querySelector('textarea[name="usage_description"]')).toBeValid();
      expect(container.querySelector('input[name="user_id"]')).toBeValid();

      await user.click(container.querySelector('button[name="attachDrug"]'));
      fireEvent.click(container.querySelector("#submit"));
      await waitFor(() => {
        expect(screen.getByText(/Examination was created successfully/)).toBeInTheDocument();
        expect(container.querySelector('input[name="attach_perscription"]').checked).toBe(false);
        expect(container.querySelector('input[name="weight"]').value).toEqual('');
        expect(container.querySelector('input[name="height"]').value).toEqual('');
        expect(container.querySelector('textarea[name="anamnesis"]').value).toEqual('');
      })
    });

    test("On Failure, it should display error message and not reset the fields", async () => {
      server.use(
        rest.post(`http://localhost:3000/api/v1/doctors/create_examination`, (req, res, ctx) => {
          return res(
            ctx.status(422),
            ctx.json({ errors: [["Error message from API"]] })
          );
        })
      );

      const { container } = render(RenderHelper(<Examination />));
      fireEvent.change(container.querySelector('input[name="weight"]'), { target: { value: "99" } });
      fireEvent.change(container.querySelector('input[name="height"]'), { target: { value: "188" } });
      fireEvent.change(container.querySelector('textarea[name="anamnesis"]'), { target: { value: "Anamnesis text" } });
      
      fireEvent.click(container.querySelector("#submit"));
      await waitFor(() => {
        expect(screen.getByText(/Error message from API/)).toBeInTheDocument();
        expect(container.querySelector('input[name="weight"]').value).toEqual("99");
        expect(container.querySelector('input[name="height"]').value).toEqual("188");
        expect(container.querySelector('textarea[name="anamnesis"]').value).toEqual("Anamnesis text");
      })
    })

  });
})
