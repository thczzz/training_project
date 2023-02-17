import { rest } from 'msw'

export const handlers = [

  rest.get(`http://localhost:3000/api/v1/users/confirmation`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ success: true })
    );
  }),

  rest.get("http://localhost:3000/api/v1/user_type", (req, res, ctx) => {
    return res(
      ctx.status(401),
      ctx.json(
        {
          data: [0, "test@mail.com"]
        },
      )
    );
  }),

  rest.post("http://localhost:3000/api/v1/oauth/token", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ success: true })
    );
  }),

  rest.post("http://localhost:3000/api/v1/oauth/revoke", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ success: true })
    );
  }),

  rest.post("http://localhost:3000/api/v1/users/sign_up", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ status: {"message": "You have registered successfully!"} })
    );
  }),

  rest.post("http://localhost:3000/api/v1/users/password", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ status: {"message": "Password reset request was sent successfully."} })
    );
  }),

  rest.patch("http://localhost:3000/api/v1/users/password", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ success: true })
    );
  }),

  rest.post(`http://localhost:3000/api/v1/users/confirmation`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ status: {"message": "Email Activation request was sent successfully."} })
    );
  }),

  rest.post(`http://localhost:3000/api/v1/doctors/create_examination`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ status: {"message": "Email Activation request was sent successfully."} })
    );
  }),

  rest.get(`http://localhost:3000/api/v1/doctors/search_user/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ data: [[1, "dummyuser"]] })
    );
  }),

  rest.get(`http://localhost:3000/api/v1/doctors/search_drug/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ data: [[3, "Aspirin 200mg"]] })
    );
  }),

  rest.post(`http://localhost:3000/api/v1/doctors/create_perscription`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ success: true })
    );
  }),

  rest.get(`http://localhost:3000/api/v1/doctors/user_examinations/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ data: [[7, "2023-02-13T14:35:31"]] })
    );
  }),

  rest.get(`http://localhost:3000/api/v1/user_info`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(
        { 
          data: 
          {
            data: 
            { 
              attributes: {
                "first_name": "John",
                "last_name": "Smith",
                "address": "Stara Zagora",
                "date_of_birth": "2001-05-06",
                "username": "testuser",
                "email": "testuser@mail.com"
              }
            }
          } 
        }
      )
    );
  }),

  rest.patch(`http://localhost:3000/api/v1/users`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(
        { 
          status: {
            message: ["Your acc. was updated successfully.", "Your acc. was updated but since your pw was changed you'll have to login again."]
          },
          actions: {
            "pw_updated": true
          }
        }
      )
    );
  }),

  rest.get(`http://localhost:3000/api/v1/patients/examinations`, (req, res, ctx) => {
    const data = examinationMockData();
    return res(
      ctx.status(200),
      ctx.json
      (
        { 
          "next_page": '',
          data
      })
    );
  }),

]

export const examinationMockData = () => {
  return {
    data: [
      {
        "id": "1",
        "type": "examination",
        "attributes": {
          "id": "1",
          "weight_kg": "98.32",
          "height_cm": "188.3",
          "anamnesis": "Test anamnesis",
          "created_at": "2023-01-03",
          "perscriptions": {
            "data": [
              {
                "id": "2",
                "type": "perscription",
                "attributes": {
                  "id": "2",
                  "description": "Perscription descr.",
                  "created_at": "2023-01-03",
                  "perscription_drugs": {
                    "data": [
                      {
                        "id": '',
                        "type": "perscription_drug",
                        "attributes": {
                          "id": '',
                          "usage_description": "Drug usage description.",
                          "drug": {
                            "data": {
                              "id": "3",
                              "type": "drug",
                              "attributes": {
                                "name": "Aspirin 200mg",
                                "description": "Generic aspirin.."
                              }
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            ]
          }
        }
      }
    ]
  }
}
