import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Cars from "../components/views/Cars";
import Home from "../components/views/Home";
import Car from "../components/views/Car";
import { Navbar } from "../components/elements/Navbar";
import CarAdd from "../components/views/CarAdd";
import DueCarsPage from "../components/views/DueCars";
import NotificationsPage from "../components/views/Notifications";

const Navigation = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/expirari" element={<DueCarsPage />} />
                <Route path="/cars" element={<Cars />} />
                <Route path="/api/cars" element={<Cars />} />
                <Route path="/cars/:carId" element={<Car />} />
                <Route path="https://accounts.ivaiondan.ro/user" />
                <Route path="/adauga" element={<CarAdd />} />
                <Route path="/notificari" element={<NotificationsPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Navigation;