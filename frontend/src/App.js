import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PrivateRoute, PublicRoute } from "./hooks/IsLogin";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Register from "./pages/Register";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Suspense fallback={<div>Loading</div>}>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/login/" element={<Login />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="/register" element={<Register />} />
              <Route path="/*" element={<Layout />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
