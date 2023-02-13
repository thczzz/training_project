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
  })

]
