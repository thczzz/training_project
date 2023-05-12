// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import { server } from './mocks/server.js'
import 'whatwg-fetch';

// Establish API mocking before all tests.
beforeAll(() => server.listen())
// beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
  server.resetHandlers();
  window.history.pushState(null, document.title, '/');
})
// Clean up after the tests are finished.
afterAll(() => server.close())

// `npm run test -- -silent`
const params = process.argv.slice(2)
if (params.includes("-silent")) {
  console.warn  = function () { return };
  console.error = function () { return };
  console.log   = function () { return };
} 
