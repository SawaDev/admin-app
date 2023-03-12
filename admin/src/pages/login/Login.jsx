import { userRequest } from "../../requestMethods";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from "../../redux/userRedux";
import "./login.scss";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  function login(user) {
    dispatch(loginStart());
    const res = userRequest.post("/auth/login", user).then(res => {
      dispatch(loginSuccess(res.data));
      return res.data;
    }).catch(err => {
      setError(err.response.data.message);
      dispatch(loginFailure());
      return err.response.data;
    })
  }

  const handleClick = (e) => {
    e.preventDefault();
    login({ username, password })
  };

  return (
    <div className="login">
      <div className="lContainer">
        {error ?
          (<div style={{ color: '#f00', textAlign: 'center' }}>
            {error}
          </div>)
          : (<></>)}
        <input
          type="text"
          placeholder="username"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
          className="lInput border-2 py-5 px-4 text-lg rounded-lg outline-none"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          className="lInput border-2 py-5 px-4 text-lg rounded-lg outline-none"
        />
        <button onClick={handleClick} className="lButton">
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
