import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import Login from "../Component/Auth/Login";

const AdminDashboard = () => <h1>Admin Dashboard</h1>;

const TrainerDashboard = () => <h1>Trainer Dashboard</h1>;



function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login/>} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trainer-dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN", "TRAINER"]}
            >
              <TrainerDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;