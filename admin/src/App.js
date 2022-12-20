import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./style/dark.scss";
import { kamarColumns } from "./datatablesource";
import NewKamar from "./pages/newKamar/NewKamar";
import SingleKamar from "./pages/singleKamar/SingleKamar";
import Calculator from "./pages/calculator/Calculator";
import { useSelector } from "react-redux";
import "./app.css";
import Stats from "./pages/stats/Stats";
function App() {
  const admin = useSelector((state) => state.user.currentUser?.isAdmin);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!admin ? <Login /> : <Navigate to="/" />} />
        <Route path="/" exact element={admin ? <Home /> : <Navigate to="/login" />} />
        <Route path="/kamars" element={admin ? <List columns={kamarColumns} /> : <Navigate to="/login" />} />
        <Route path="/kamars/:id" element={admin ? <SingleKamar /> : <Navigate to="/login" />} />
        <Route path="/kamars/new" element={admin ? <NewKamar /> : <Navigate to="/login" />} />
        <Route path="/calculator" element={admin ? <Calculator /> : <Navigate to="/login" />} />
        <Route path="/stats" element={admin ? <Stats /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
