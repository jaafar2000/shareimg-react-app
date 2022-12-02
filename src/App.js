import React, { useContext } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./container/Home";
import { ShareMeContext } from "./context/ShareMeContext";
const App = () => {
  const { user } = useContext(ShareMeContext);
  return (
    <div className="App">
      {!user ? (
        <Login />
      ) : (
        <Routes>
          <Route path="/*" element={<Home />} />
        </Routes>
      )}
    </div>
  );
};

export default App;

{
  /* 
        <Route path="login" element={<Login/>} />
         */
}
