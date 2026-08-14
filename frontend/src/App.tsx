import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import TeamDashboard from "./pages/TeamDashboard";
import TeamTaskDetail from "./pages/TeamTaskDetails";
import Checklists from "./pages/Checklists";
import Tasks from "./pages/Tasks";
import OverdueTasks from "./pages/OverdueTasks";
import Reports from "./pages/Reports";
import CreateTask from "./pages/CreateTask";
import Login from "./pages/Login";
import Teams from "./pages/Teams";
import ProtectedRoute from "./components/ProtectedRoute";
import TeamLayout from "./layouts/Teamlayout";
import ChecklistDetail from "./pages/ChecklistDetail";
import ManagerInstanceDetail from "./pages/MasterInstance";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />


        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/checklists" element={<Checklists />} />
            <Route path="/checklists/:id" element={<ChecklistDetail />} />
            <Route path="/task-instances/:id" element={<ManagerInstanceDetail />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/tasks/new" element={<CreateTask />} />
            <Route path="/overdue" element={<OverdueTasks />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
          <Route element={<TeamLayout />}>
            <Route path="/team/dashboard" element={<TeamDashboard />} />
            <Route path="/team/tasks/:taskId" element={<TeamTaskDetail />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;