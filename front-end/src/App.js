import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MyAccount from './MyAccount';
import ChangeEmail from './ChangeEmail';
import ChangePassword from './ChangePassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MyAccount />} />
        <Route path="/change-email" element={<ChangeEmail />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Routes>
    </Router>
  );
}

export default App;

