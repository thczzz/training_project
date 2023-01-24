// Sidebar Imports
import {
    UilEstate,
    UilClipboardAlt,
    UilTablets, // Drug
    UilFileMedicalAlt, // Print Perscription
    UilSearchPlus, // Search
    UilSetting, // Settings
    UilSave,
    UilMinusCircle, // Delete
    UilSignOutAlt,
} from "@iconscout/react-unicons";

export const SidebarDataDoc = [
    {
        icon: UilEstate,
        heading: "Dashboard",
        url: "/doctor"
    },
    {
        icon: UilSetting,
        heading: "Edit Profile",
        url: "/doctor/edit_profile"
    },
]

export const SidebarDataPatient = [
    {
        icon: UilEstate,
        heading: "Examinations",
        url: "/patient"
    },
    {
        icon: UilSearchPlus,
        heading: "Search Exam.",
        url: ""
    },
    {
        icon: UilSetting,
        heading: "Edit Profile",
        url: "/patient/edit_profile"
    },
]
