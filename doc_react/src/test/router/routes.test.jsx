import React from "react";
import { waitFor} from "@testing-library/react";
import { useAuth } from "../../hooks/authHook";
import { renderWithRouter } from "../../mocks/helpers";
import App from '../../App'

jest.mock('../../hooks/authHook.jsx', () => ({ useAuth: jest.fn() }))

describe("Test App routes", () => {
  describe("Test AnonymousProtectedRoutes", () => {
    describe("/login", () => {
      test("When a User is Doctor, it should redirect to Doctor's dashboard page", async () => {
        useAuth.mockImplementation(() => ({"userType": 2}))
    
        renderWithRouter(<App />, {route: '/login'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/doctor');
        })
      });

      test("When a User is Admin, it should redirect to Patient's dashboard page", async () => {
        useAuth.mockImplementation(() => ({"userType": 1}))
    
        renderWithRouter(<App />, {route: '/login'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/patient');
        })
      });

      test("When a User is Patient, it should redirect to Patient's dashboard page", async () => {
        useAuth.mockImplementation(() => ({"userType": 3}))
    
        renderWithRouter(<App />, {route: '/login'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/patient');
        })
      });

      test("When a User is Anonymous, it should NOT redirect", async () => {
        useAuth.mockImplementation(() => ({"userType": 0}))
    
        renderWithRouter(<App />, {route: '/login'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/login');
        })
      });

    });

    describe("/register", () => {
      test("When a User is Doctor, it should redirect to Doctor's dashboard page", async () => {
        useAuth.mockImplementation(() => ({"userType": 2}))
    
        renderWithRouter(<App />, {route: '/register'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/doctor');
        })
      });

      test("When a User is Admin, it should redirect to Patient's dashboard page", async () => {
        useAuth.mockImplementation(() => ({"userType": 1}))
    
        renderWithRouter(<App />, {route: '/register'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/patient');
        })
      });

      test("When a User is Patient, it should redirect to Patient's dashboard page", async () => {
        useAuth.mockImplementation(() => ({"userType": 3}))
    
        renderWithRouter(<App />, {route: '/register'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/patient');
        })
      });

      test("When a User is Anonymous, it should NOT redirect", async () => {
        useAuth.mockImplementation(() => ({"userType": 0}))
    
        renderWithRouter(<App />, {route: '/register'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/register');
        })
      });

    });

    describe("/req_password_reset", () => {
      test("When a User is Doctor, it should redirect to Doctor's dashboard page", async () => {
        useAuth.mockImplementation(() => ({"userType": 2}))
    
        renderWithRouter(<App />, {route: '/req_password_reset'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/doctor');
        })
      });

      test("When a User is Admin, it should redirect to Patient's dashboard page", async () => {
        useAuth.mockImplementation(() => ({"userType": 1}))
    
        renderWithRouter(<App />, {route: '/req_password_reset'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/patient');
        })
      });

      test("When a User is Patient, it should redirect to Patient's dashboard page", async () => {
        useAuth.mockImplementation(() => ({"userType": 3}))
    
        renderWithRouter(<App />, {route: '/req_password_reset'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/patient');
        })
      });

      test("When a User is Anonymous, it should NOT redirect", async () => {
        useAuth.mockImplementation(() => ({"userType": 0}))
    
        renderWithRouter(<App />, {route: '/req_password_reset'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/req_password_reset');
        })
      });

    });

    describe("/change_password", () => {
      test("When a User is Doctor, it should redirect to Doctor's dashboard page", async () => {
        useAuth.mockImplementation(() => ({"userType": 2}))
    
        renderWithRouter(<App />, {route: '/change_password'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/doctor');
        })
      });

      test("When a User is Admin, it should redirect to Patient's dashboard page", async () => {
        useAuth.mockImplementation(() => ({"userType": 1}))
    
        renderWithRouter(<App />, {route: '/change_password'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/patient');
        })
      });

      test("When a User is Patient, it should redirect to Patient's dashboard page", async () => {
        useAuth.mockImplementation(() => ({"userType": 3}))
    
        renderWithRouter(<App />, {route: '/change_password'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/patient');
        })
      });

      test("When a User is Anonymous, it should NOT redirect", async () => {
        useAuth.mockImplementation(() => ({"userType": 0}))
    
        renderWithRouter(<App />, {route: '/change_password'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/change_password');
        })
      });
    });
  });

  describe("Test ProtectedDocRoutes", () => {
    describe("/doctor", () => {
      test("When a User is Anonymous, it should redirect to the /login page", async () => {
        useAuth.mockImplementation(() => ({"userType": 0}))
    
        renderWithRouter(<App />, {route: '/doctor'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/login');
        })
      });

      test("When a User is Patient, it should redirect to Patients dashboard page", async () => {
        useAuth.mockImplementation(() => ({"userType": 3}))
    
        renderWithRouter(<App />, {route: '/doctor'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/patient');
        })
      });

      test("When a User is Doctor, it should NOT redirect", async () => {
        useAuth.mockImplementation(() => ({"userType": 2}))
    
        renderWithRouter(<App />, {route: '/doctor'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/doctor');
        })
      });

      test("When a User is Admin, it should NOT redirect", async () => {
        useAuth.mockImplementation(() => ({"userType": 1}))
    
        renderWithRouter(<App />, {route: '/doctor'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/doctor');
        })
      });
    });

    describe("/doctor/edit_profile", () => {
      test("When a User is Anonymous, it should redirect to the /login page", async () => {
        useAuth.mockImplementation(() => ({"userType": 0}))
    
        renderWithRouter(<App />, {route: '/doctor/edit_profile'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/login');
        })
      });

      test("When a User is Patient, it should redirect to Patients dashboard page", async () => {
        useAuth.mockImplementation(() => ({"userType": 3}))
    
        renderWithRouter(<App />, {route: '/doctor/edit_profile'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/patient');
        })
      });

      test("When a User is Doctor, it should NOT redirect", async () => {
        useAuth.mockImplementation(() => ({"userType": 2}))
    
        renderWithRouter(<App />, {route: '/doctor/edit_profile'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/doctor/edit_profile');
        })
      });

      test("When a User is Admin, it should NOT redirect", async () => {
        useAuth.mockImplementation(() => ({"userType": 1}))
    
        renderWithRouter(<App />, {route: '/doctor/edit_profile'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/doctor/edit_profile');
        })
      });
    });
  });

  describe("Test ProtectedPatientRoutes", () => {
    describe("/patient", () => {
      test("When a user is Anonymous, it should redirect to the /login page", async () => {
        useAuth.mockImplementation(() => ({"userType": 0}))
    
        renderWithRouter(<App />, {route: '/patient'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/login');
        })
      });

      test("When a user is Patient, it should NOT redirect", async () => {
        useAuth.mockImplementation(() => ({"userType": 3}))
    
        renderWithRouter(<App />, {route: '/patient'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/patient');
        })
      });

      test("When a user is Doctor, it should NOT redirect", async () => {
        useAuth.mockImplementation(() => ({"userType": 2}))
    
        renderWithRouter(<App />, {route: '/patient'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/patient');
        })
      })

      test("When a user is Admin, it should NOT redirect", async () => {
        useAuth.mockImplementation(() => ({"userType": 1}))
    
        renderWithRouter(<App />, {route: '/patient'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/patient');
        })
      })
    });

    describe("/patient/edit_profile", () => {
      test("When a user is Anonymous, it should redirect to the /login page", async () => {
        useAuth.mockImplementation(() => ({"userType": 0}))
    
        renderWithRouter(<App />, {route: '/patient/edit_profile'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/login');
        })
      });

      test("When a user is Patient, it should NOT redirect", async () => {
        useAuth.mockImplementation(() => ({"userType": 3}))
    
        renderWithRouter(<App />, {route: '/patient/edit_profile'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/patient/edit_profile');
        })
      });

      test("When a user is Doctor, it should NOT redirect", async () => {
        useAuth.mockImplementation(() => ({"userType": 2}))
    
        renderWithRouter(<App />, {route: '/patient/edit_profile'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/patient/edit_profile');
        })
      })

      test("When a user is Admin, it should NOT redirect", async () => {
        useAuth.mockImplementation(() => ({"userType": 1}))
    
        renderWithRouter(<App />, {route: '/patient/edit_profile'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/patient/edit_profile');
        })
      })
    });
  });

  describe("Test Public routes", () => {
    describe("/req_account_activation_link", () => {
      test("When Anonymous, it should NOT redirect", async () => {
        useAuth.mockImplementation(() => ({"userType": 0}))
    
        renderWithRouter(<App />, {route: '/req_account_activation_link'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/req_account_activation_link');
        })
      });

      test("When Patient, it should NOT redirect", async () => {
        useAuth.mockImplementation(() => ({"userType": 3}))
    
        renderWithRouter(<App />, {route: '/req_account_activation_link'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/req_account_activation_link');
        })
      });

      test("When Doctor, it should NOT redirect", async () => {
        useAuth.mockImplementation(() => ({"userType": 2}))
    
        renderWithRouter(<App />, {route: '/req_account_activation_link'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/req_account_activation_link');
        })
      });

      test("When Admin, it should NOT redirect", async () => {
        useAuth.mockImplementation(() => ({"userType": 1}))
    
        renderWithRouter(<App />, {route: '/req_account_activation_link'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/req_account_activation_link');
        })
      });
    });

    describe("/confirm_email", () => {
      test("When Anonymous, it should NOT redirect", async () => {
        useAuth.mockImplementation(() => ({"userType": 0}))
    
        renderWithRouter(<App />, {route: '/confirm_email'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/confirm_email');
        })
      });

      test("When Patient, it should NOT redirect", async () => {
        useAuth.mockImplementation(() => ({"userType": 3}))
    
        renderWithRouter(<App />, {route: '/confirm_email'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/confirm_email');
        })
      });

      test("When Doctor, it should NOT redirect", async () => {
        useAuth.mockImplementation(() => ({"userType": 2}))
    
        renderWithRouter(<App />, {route: '/confirm_email'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/confirm_email');
        })
      });

      test("When Admin, it should NOT redirect", async () => {
        useAuth.mockImplementation(() => ({"userType": 1}))
    
        renderWithRouter(<App />, {route: '/confirm_email'})
    
        await waitFor(() => {
          expect(window.location.pathname).toEqual('/confirm_email');
        })
      });
      
    });
  });
})
