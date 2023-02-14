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

]
