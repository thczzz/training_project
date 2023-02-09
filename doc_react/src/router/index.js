import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Anonymous from '../layouts/Anonymous';
import Doctor from '../layouts/Doctor';
import Patient from '../layouts/Patient';

import { DoctorDashboardView } from '../views/DoctorDashboardView';
import { PatientDashboardView } from '../views/PatientDashboardView';
import { LoginView } from '../views/LoginView';
import { RequestResetPasswordView } from '../views/RequestResetPasswordView';
import { EmailActivationView } from '../views/EmailActivationView';
import { RegisterView } from '../views/RegisterView';
import { ResetPasswordView } from '../views/ResetPasswordView';
import { EditProfileView } from '../views/EditProfileView';
import { ConfirmEmailByToken } from '../components/Auth/ConfirmEmail';
import { Logout } from '../components/Auth/Logout';

import { Notification } from '../components/Alerts/Notification';
import GlobalProvider from "../GlobalContext";
import { AuthContextProvider } from '../AuthContext';

import { ProtectedDocRoute, ProtectedPatientRoute, ProtectedAnonymousRoute } from './protectedRoutes';
import { Navigate } from 'react-router-dom';


export default () => {
    return (
        <Router>
            <AuthContextProvider>
                <GlobalProvider>

                    <Notification show={true} />

                    <Routes>
                        <Route element={<ProtectedAnonymousRoute> <Anonymous/> </ProtectedAnonymousRoute>}>
                            <Route path='/login' element={<LoginView/>} />
                            <Route path='/register' element={<RegisterView/>} />
                            <Route path='/req_password_reset' element={<RequestResetPasswordView/>} />
                            <Route path='/change_password' element={<ResetPasswordView/>} />
                        </Route>

                        <Route index element={<Navigate to="/patient" />} />

                        <Route element={<Anonymous/>}> 
                            <Route path='/req_account_activation_link' element={<EmailActivationView/>} />
                        </Route>

                        <Route>
                            <Route path='/confirm_email' element={<ConfirmEmailByToken />} />
                        </Route>

                        <Route>
                            <Route path='/logout' element={<Logout />} />
                        </Route>

                        <Route path='/doctor/' element={<ProtectedDocRoute> <Doctor/> </ProtectedDocRoute>}>
                            <Route path='' exact element={<DoctorDashboardView/>} />
                            <Route path='/doctor/edit_profile' element={<EditProfileView/>} />
                        </Route>

                        <Route path='/patient/' element={<ProtectedPatientRoute> <Patient/> </ProtectedPatientRoute>}>
                            <Route path='' exact element={<PatientDashboardView/>} />
                            <Route path='/patient/edit_profile' element={<EditProfileView/>} />
                        </Route>

                    </Routes>
                </GlobalProvider>
            </AuthContextProvider>
        </Router>
    )
}
