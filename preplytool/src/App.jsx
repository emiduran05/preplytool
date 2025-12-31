import { BrowserRouter, Routes, Route} from "react-router-dom";
import Main from "./pages/main/Main";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardStudent from "./pages/studentMain/dashboardStudent";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/student/:studentID" element={<DashboardStudent />} />
        {/* <Route path="/book/:nombre" element={<BookView />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
