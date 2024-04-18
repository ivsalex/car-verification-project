import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Cars from "../views/Cars";

const Navigation = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route path="/cars" element={<Cars />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Navigation;