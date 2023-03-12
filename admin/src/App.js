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
import Test from "./pages/test/Test";
import Customers from "./pages/customers/Customers";
import NewSale from "./pages/newsale/NewSale";
import SingleCustomer from "./pages/singleCustomer/SingleCustomer";
function App() {
  const admin = useSelector((state) => state.user?.currentUser);
  const user = admin === null ? false : true;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/" exact element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/kamars" element={user ? <List columns={kamarColumns} /> : <Navigate to="/login" />} />
        <Route path="/kamars/:id" element={user ? <SingleKamar /> : <Navigate to="/login" />} />
        <Route path="/kamars/new" element={user ? <NewKamar /> : <Navigate to="/login" />} />
        <Route path="/calculator" element={user ? <Calculator /> : <Navigate to="/login" />} />
        <Route path="/stats" element={user ? <Stats /> : <Navigate to="/login" />} />
        <Route path="/customers" element={user ? <Customers /> : <Navigate to="/login" />} />
        <Route path="/customers/:id" element={user ? <SingleCustomer /> : <Navigate to="/login" />} />
        <Route path="/newsale" element={user ? <NewSale /> : <Navigate to="/login" />} />
        <Route path="/test" element={user ? <Test /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
