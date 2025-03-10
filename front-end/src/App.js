import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MyAccount from './MyAccount';
import ChangeEmail from './ChangeEmail';
import ChangePassword from './ChangePassword';
import Homepage from './Homepage';
import CalendarPage from './CalendarPage'; // Import the Calendar Page
import ForestPage from "./ForestPage";

function App() {
  const completedDays = 5;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/Account" element={<MyAccount />} />
        <Route path="/change-email" element={<ChangeEmail />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/calendar" element={<CalendarPage />} /> {/* ✅ Add this line */}
        <Route path="/forest" element={<ForestPage completedDays={completedDays} />} /> {/* ✅ Pass completed days */}
      </Routes>
    </Router>
  );
}

export default App;
