import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from 'react-router-dom'
import GlobalProvider from "../../../GlobalContext";
import { Notification } from "../../../components/Alerts/Notification";
import { server } from "../../../mocks/server";
import { rest } from 'msw'
import { PatientExaminations } from "../../../components/PatientComponents/Examination";
import { examinationMockData } from "../../../mocks/handlers";

describe("Test PatientExaminations Component", () => {
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

  test("When patient has one examination, it should show it and the Load More button should be disabled ", async () => {
    const { container } = render(RenderHelper(<PatientExaminations />));

    await waitFor(() => {
      const examinationDetailsPs = container.querySelectorAll('span[name="examinationDetails"]>p')
      expect(examinationDetailsPs.length).toEqual(3)
      expect(examinationDetailsPs[0].textContent).toEqual("Weight: 98.32");
      expect(examinationDetailsPs[1].textContent).toEqual("Height: 188.3");
      expect(examinationDetailsPs[2].textContent).toEqual("Anamnesis: Test anamnesis");
      
      expect(container.querySelector('span[name="examinationDate"]').textContent).toEqual("Examination - (1/3/2023, 2:00:00 AM)");
      expect(container.querySelector('span[name="perscriptionDate"]').textContent).toEqual("Perscription - (1/3/2023, 2:00:00 AM)");
      expect(container.querySelector('span[name="perscriptionDescription"]').textContent).toEqual("Perscription descr.");
      expect(container.querySelector('span[name="drugName"]').textContent).toEqual("Aspirin 200mg");
      expect(container.querySelector('span[name="drugUsageDescription"]').textContent).toEqual("Drug usage description.");

      expect(container.querySelector('input[name="loadMoreBtn"]').disabled).toEqual(true);
    })
  })

  test("When patient has more than one examination, after clicking the loadMoreBtn it should load one more examination", async () => {
    server.use(
      rest.get(`http://${window.location.hostname}:3000/api/v1/patients/examinations`, (req, res, ctx) => {
        const data = examinationMockData();
        return res(
          ctx.status(200),
          ctx.json
          (
            { 
              "next_page": '2',
              data
          })
        );
      }),
    )

    const { container } = render(RenderHelper(<PatientExaminations />));

    await waitFor(() => {
      expect(container.querySelector('input[name="loadMoreBtn"]').disabled).toEqual(false);
      fireEvent.click(container.querySelector('input[name="loadMoreBtn"]'));

      expect(container.querySelectorAll('span[name="examinationDetails"]>p').length).toEqual(6);
    })
  });

  test("When Patient has no examinations, it should display message and not display any examinations", async () => {
    server.use(
      rest.get(`http://${window.location.hostname}:3000/api/v1/patients/examinations`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json
          (
            { 
              "next_page": '',
              data: {
                data: []
              }
          })
        );
      }),
    )

    const { container } = render(RenderHelper(<PatientExaminations />));

    await waitFor(() => {
      expect(container.querySelector('input[name="loadMoreBtn"]').disabled).toEqual(true);
      expect(container.querySelectorAll('span[name="examinationDetails"]>p').length).toEqual(0);
    })
  })

})
