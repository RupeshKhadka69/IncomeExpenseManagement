import React, {useContext}  from 'react'
import {Navigate,Outlet } from "react-router-dom";
import { AdminContext } from '../context/AdminContext';

// check is user logged in

export const PrivateRoute = () => {
    const { state } = useContext(AdminContext);
  const { adminInfo } = state;

   return adminInfo ? <Outlet /> : <Navigate to="/login/" />;
}

export const PublicRoute = () => {
    const { state } = useContext(AdminContext);
    const { adminInfo } = state;
   return !adminInfo ? <Outlet /> : <Navigate to="/" />
}