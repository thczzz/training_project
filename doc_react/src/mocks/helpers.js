import { BrowserRouter } from "react-router-dom"
import { render } from "@testing-library/react";
import userEvent from '@testing-library/user-event'

export const renderWithRouter = (ui, {route = '/'} = {}) => {
  window.history.pushState({}, 'Test page', route)

  return {
    user: userEvent.setup(),
    ...render(ui),
  }
}
