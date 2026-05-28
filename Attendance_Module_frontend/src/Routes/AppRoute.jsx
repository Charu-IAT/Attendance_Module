import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import Login from "../Component/Auth/Login";
import AdminDashboard from "../Component/Dashboard/AdminDashboard";
import TrainerDashboard from "../Component/Dashboard/TrainerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }/>
        <Route
          path="/trainer-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "TRAINER"]}>
              <TrainerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
