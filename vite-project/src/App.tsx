import { useState } from 'react'
import './App.css'
import Login from './pages/login'
import Home from './pages/home'
import Register from './pages/register'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import Store from './store'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { PrivateRoutes } from './services/privateRoutes'
function App() {

  return (
    <Provider store={Store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoutes />}>
            <Route path="/home" element={<Home />} />
          </Route>
          <Route path="*" element={<Navigate to='/home' />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </Provider>
  );
}

export default App
