import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MyAccount from './MyAccount';
import ChangeEmail from './ChangeEmail';
import ChangePassword from './ChangePassword';
import Homepage from './Homepage';
import CalendarPage from './CalendarPage';
import ForestPage from './ForestPage';
import Login from './Login'; 
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';
import Social from './Social';

function App() {
  const completedDays = 5;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Account" element={<MyAccount />} />
        <Route path="/change-email" element={<ChangeEmail />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/forest" element={<ForestPage completedDays={completedDays} />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/social" element={<Social />} />
      </Routes>
    </Router>
  );
}

export default App;
