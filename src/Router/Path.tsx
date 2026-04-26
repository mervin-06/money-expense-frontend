import { Routes, Route, Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import SignUp from "../Front_page/SignUp";
import LoginUp from "../MainPage/Login";
import Expense from "../Important_Compo/Expense";
import Forgot from "../Important_Compo/Forgot";
import Change from "../Important_Compo/Change";
import Otp from "../Important_Compo/Otp";
import Reset from "../Important_Compo/Reset";
import AdminLogin from "../Admin/AdminLogin";
import DashBoard from "../Front_page/DashBoard";

function ProtectedRoute({ children }: { children: ReactElement }) {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" replace />;
}

export default function Path(){
    return(
        <>
            <Routes>
                <Route path="/" element={<SignUp/>}/>
                <Route path="/login" element={<LoginUp/>}/>
                <Route path="/demo" element={<LoginUp/>}/>
                <Route path="/expense" element={<ProtectedRoute><Expense/></ProtectedRoute>}/>
                <Route path="/forgot" element={<Forgot/>}/>
                <Route path="/Change" element={<Change/>}/>
                <Route path="/otp" element={<Otp/>}/>
                <Route path="/reset" element={<Reset/>}/>
                <Route path="/admin" element={<AdminLogin/>}/>
                <Route path="/dash" element={<ProtectedRoute><DashBoard/></ProtectedRoute>}/>
                <Route path="*" element={<Navigate to="/" replace />}/>
            </Routes>

        </>
    )
}
