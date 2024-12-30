// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthOutlet from '@auth-kit/react-router/AuthOutlet'
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';


function App() {

    
    return (
        <BrowserRouter>
      <Routes>
        <Route element={<AuthOutlet fallbackPath='/login' />}>
          <Route index path='/' element={<Home />} />
        </Route>
        <Route index path='/login' element={<Login />} />
        <Route index path='/signup' element={<SignUp />} />
      </Routes>
    </BrowserRouter>
    );
}

export default App;