import { BrowserRouter, Routes, Route} from "react-router-dom";
import Main from "./pages/main/Main";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        {/* <Route path="/book/:nombre" element={<BookView />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
