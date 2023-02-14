import React from "react";
import { render, screen, fireEvent, waitFor, act, cleanup } from "@testing-library/react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useAuth } from "../../../hooks/authHook";
import GlobalProvider from "../../../GlobalContext";
import { Notification } from "../../../components/Alerts/Notification";
import { server } from "../../../mocks/server";
import { rest } from 'msw'
import Examination from "../../../components/DocForms/Examination";

describe("Test Login Form Component", () => {
  const dummyUser_id = 1;
  const dummyDrug_id = 4;

  function getOnChangeFields (container) {
    return {
      "weight":              container.querySelector('input[name="weight"]'),
      "height":              container.querySelector('input[name="height"]'),
      "anamnesis":           container.querySelector('textarea[name="anamnesis"]'),
      "attach_perscription": container.querySelector('input[name="attach_perscription"]'),
      "user_id":             container.querySelector('input[name="user_id"]'),
      // "drug_ids":            container.querySelectorAll('input[name="drug_id"]'), // Drugs list (attached)
      // "persc_description":   container.querySelector('textarea[name="description"]'),
      // "drug_q_inputs":       container.querySelectorAll('input[name="Drug"]'), // Search drug inputs
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

  describe("Test the Form Element", () => {
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

  describe("Test Form Submit requests", () => {
    test("Successful submit request, after filling the Form + PerscriptionDrugs", async () => {
      const { container } = render(RenderHelper(<Examination />));
      let onChangeFields = getOnChangeFields(container);

      fireEvent.click(onChangeFields["attach_perscription"]);
      fireEvent.change(onChangeFields["user_id"], { target: { value: "dummy" } });
      fireEvent.change(onChangeFields["weight"], { target: { value: "98" } });
      fireEvent.change(onChangeFields["height"], { target: { value: "188.5" } });
      fireEvent.change(onChangeFields["anamnesis"], { target: { value: "test anamnesis" } });

      await waitFor(() => {
        // Select User from results
        fireEvent.click(container.querySelector('ul>li[id="1"]'))
        expect(container.querySelectorAll('ul>li[id="1"]').length).toEqual(0)

        // Reload fields
        onChangeFields = getOnChangeFields(container);

        expect(onChangeFields["weight"].value).toEqual('98');
        expect(onChangeFields["height"].value).toEqual('188.5');
        expect(onChangeFields["anamnesis"].value).toEqual('test anamnesis');
        expect(onChangeFields["attach_perscription"].checked).toBe(true);

        // Perscription Description
        expect(container.querySelector('textarea[name="description"]')).toBeInTheDocument();

        // SearchUser -> Selected 
        expect(onChangeFields["user_id"].id).toBe("1")
        expect(onChangeFields["user_id"].value).toEqual("dummyuser")

        // PerscriptionFields
        expect(container.querySelectorAll('input[name="drug_id"]').length).toEqual(0) // Attached drugs
        expect(container.querySelector('textarea[name="description"]')).toBeInTheDocument()

        // Drugs
        expect(container.querySelectorAll('input[name="Drug"]').length).toEqual(1) // Drug Search input
        expect(container.querySelectorAll('textarea[name="usage_description"]').length).toEqual(1) // Drug usage_description
      })

      await waitFor(() => {
        // Attaching a drug
        fireEvent.change(container.querySelector('input[name="Drug"]'), { target: { value: "asp" } });
        expect(container.querySelector('ul>li[id="3"]').textContent).toEqual("Aspirin 200mg");
        fireEvent.click(container.querySelector('ul>li[id="3"]'));
        expect(container.querySelector('input[name="Drug"]').id).toEqual("3");
        expect(container.querySelector('input[name="Drug"]').value).toEqual("Aspirin 200mg");
        expect(container.querySelectorAll('ul>li[id="3"]').length).toEqual(0);
      })

      /// When Description is missing
      fireEvent.click(container.querySelector('button[name="attachDrug"]'));
      await waitFor(() => {
        expect(container.querySelector('input[name="Drug"]').disabled).toBe(false);
        expect(container.querySelector('textarea[name="usage_description"]'))
      })

      screen.debug()
    });

  });
})
