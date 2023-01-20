import React from 'react'
import './PatientDash.css'
import './MainDash.css'
import { PatientExaminations } from '../PatientComponents/Examination'

export const PatientDash = () => {
  return (
    <div className="PatientDash">
        <h1>Examinations</h1>
        <PatientExaminations />
    </div>
  )
}
