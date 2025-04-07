import React, { useState } from 'react';
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
import Leaderboard from './Leaderboard';
import AboutUs from './AboutUs';
import Challenges from "./Challenges";


function App() {
  const completedDays = 5;

  // Define friends state
  const [friends, setFriends] = useState([
    { id: 1, name: 'Alice', hydration: 7.5 },
    { id: 2, name: 'Bob', hydration: 6.2 },
    { id: 3, name: 'Charlie', hydration: 8.0 },
  ]);

  // Function to remove a friend
  const handleRemoveFriend = (id) => {
    setFriends(friends.filter(friend => friend.id !== id));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Account" element={<MyAccount />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/change-email" element={<ChangeEmail />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/forest" element={<ForestPage completedDays={completedDays} />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/social" element={<Social />} />
        <Route path="/leaderboard" element={<Leaderboard friends={friends} handleRemoveFriend={handleRemoveFriend} />} />
        <Route path="/challenges" element={<Challenges />} />

      </Routes>
    </Router>
  );
}

export default App;
