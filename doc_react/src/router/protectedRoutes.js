import { useAuth } from '../hooks/authHook'
import { Navigate } from 'react-router-dom'

const userTypes = {
    'anonymous': 0,
    'admin': 1,
    'doctor': 2,
    'patient': 3
}

export const ProtectedDocRoute = ({children}) => {
    const userType = useAuth()["userType"];

    if (userType === userTypes["anonymous"]) {
        return <Navigate to="/login" replace />
    } else if (userType === userTypes["patient"]) {
        return <Navigate to="/patient" replace />
    }
    return children;
}


export const ProtectedPatientRoute = ({children}) => {
    const userType = useAuth()["userType"];

    if (userType === userTypes["anonymous"]) {
        return <Navigate to="/login" replace />
    }
    return children;
}

export const ProtectedAnonymousRoute = ({children}) => {
    const userType = useAuth()["userType"];

    if (userType !== userTypes["anonymous"]) {
        if (userType === userTypes["admin"] || userType === userTypes["patient"]) {
            return <Navigate to="/patient" replace />
        } else if (userType === userTypes["doctor"]) {
            return <Navigate to="/doctor" replace />
        }
    }
    return children
}