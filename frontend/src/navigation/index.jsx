import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Cars from "../components/views/Cars";
import Car from "../components/views/Car";
import { Navbar } from "../components/elements/Navbar";
import { Login } from "../components/views/Login";

const Navigation = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route path="/cars" element={<Cars />} />
                <Route path="/cars/:carId" element={<Car />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Navigation;