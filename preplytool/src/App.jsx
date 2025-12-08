import { BrowserRouter, Routes, Route} from "react-router-dom";
import Main from "./pages/main/Main";
import Dashboard from "./pages/dashboard/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        {/* <Route path="/book/:nombre" element={<BookView />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
