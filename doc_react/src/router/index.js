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
import { Notification } from '../components/Alerts/Notification';
import GlobalProvider from "../GlobalContext";


export default () => {
    return (
        <GlobalProvider>
            <Router>

                <Notification show={true} />

                <Routes>
                    <Route element={<Anonymous/>}>
                        <Route path='/login' element={<LoginView/>} />
                        <Route path='/register' element={<RegisterView/>} />
                        <Route path='/req_password_reset' element={<RequestResetPasswordView/>} />
                        <Route path='/reset_password' element={<ResetPasswordView/>} />
                        <Route path='/req_account_activation_link' element={<EmailActivationView/>} />
                    </Route>

                    <Route path='/doctor/' element={<Doctor/>}>
                        <Route path='' exact element={<DoctorDashboardView/>} />
                        <Route path='/doctor/edit_profile' element={<EditProfileView/>} />
                    </Route>

                    <Route path='/patient/' element={<Patient/>}>
                        <Route path='' exact element={<PatientDashboardView/>} />
                        <Route path='/patient/edit_profile' element={<EditProfileView/>} />
                    </Route>

                </Routes>
            </Router>
        </GlobalProvider>
    )
}
