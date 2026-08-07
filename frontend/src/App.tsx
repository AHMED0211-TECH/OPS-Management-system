import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "./supabaseClient";

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/team/dashboard" element={<TeamDashboard />} />
          <Route path="/team/tasks/:taskId" element={<TeamTaskDetail />} />
          <Route path="/checklists" element={<Checklists />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/tasks/new" element={<CreateTask />} />
          <Route path="/overdue" element={<OverdueTasks />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Supabase client:', supabase)
  }
}


export default App;