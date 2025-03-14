import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from "react-router-dom";
import './Social.css';
import { Sling as Hamburger } from 'hamburger-react';

const Social = () => {
  //adding this for navigation
  const navigate = useNavigate();
  const location = useLocation(); // Get current URL path
  //adding this for hamburher
  const [isOpen, setOpen] = useState(false);


  const [searchQuery, setSearchQuery] = useState('');
  const [friendSuggestions, setFriendSuggestions] = useState([]);
  const [friends, setFriends] = useState([

    // Initial mock friend data with hydration values
    { id: 1, name: 'Alice', hydration: 7.5 },
    { id: 2, name: 'Bob', hydration: 6.2 },
    { id: 3, name: 'Charlie', hydration: 8.0 },
  ]);

  // Mock data representing other users available for adding
  const allUsers = [
    { id: 4, name: 'David' },
    { id: 5, name: 'Eva' },
    { id: 6, name: 'Frank' },
  ];

  // Update friend suggestions based on search input
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFriendSuggestions([]);
      return;
    }
    const suggestions = allUsers.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !friends.some(friend => friend.id === user.id)
    );
    setFriendSuggestions(suggestions);
  }, [searchQuery, friends]);

  // Handle adding a friend from suggestions
  const handleAddFriend = (user) => {
    // New friends start with a hydration value of 0
    setFriends([...friends, { ...user, hydration: 0 }]);
    setSearchQuery('');
    setFriendSuggestions([]);
  };

  // Handle removing a friend from the leaderboard
  const handleRemoveFriend = (id) => {
    setFriends(friends.filter(friend => friend.id !== id));
  };

  // Sort friends in descending order of hydration for the leaderboard
  const sortedFriends = [...friends].sort((a, b) => b.hydration - a.hydration);

  return (
    <div className="social-page">
      <h1 className="page-title">Social</h1>
      <header>
          <h1></h1>
           {/*  Hamburger Menu Button (Aligned Right) */}
           <div className="hamburger-menu">
            <Hamburger toggled={isOpen} toggle={setOpen} color="white" />
          </div>

          {/*  Sliding Sidebar Menu */}
          <motion.div 
            className="sidebar-menu"
            initial={{ x: "100%" }} 
            animate={{ x: isOpen ? 0 : "100%" }} 
            transition={{ type: "tween", duration: 0.4 }}
          >
            <ul>
              <li onClick={() => { navigate("/Account"); setOpen(false); }}>My Account</li>
              <li onClick={() => { navigate("/AboutUs"); setOpen(false); }}>About Us</li>
              <li onClick={() => { navigate("/Help"); setOpen(false); }}>Help</li>
              <li className="logout" onClick={() => { navigate("/Login"); setOpen(false); }}>Logout</li>
            </ul>
          </motion.div>
          </header>


      
      <div className="add-friend-section">
        <h2>Add Friends</h2>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search for friends..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {friendSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {friendSuggestions.map(user => (
                <li key={user.id}>
                  {user.name}
                  <button onClick={() => handleAddFriend(user)}>Add</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="leaderboard-section">
        <h2>Leaderboard</h2>
        <motion.div 
          className="leaderboard-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Friend</th>
                <th>Hydration (L)</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {sortedFriends.map((friend, index) => (
                <tr key={friend.id}>
                  <td>{index + 1}</td>
                  <td>{friend.name}</td>
                  <td>{friend.hydration}</td>
                  <td>
                    <button 
                      className="remove-button" 
                      onClick={() => handleRemoveFriend(friend.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>

        {/* Bottom Navigation Bar */}
        <div className="navbar">
      <div className={`nav-item ${location.pathname === "/" ? "active" : ""}`} onClick={() => navigate("/")}>
        <span>Home</span>
      </div>
      <div className={`nav-item ${location.pathname === "/Forest" ? "active" : ""}`} onClick={() => navigate("/Forest")}>
        <span>Forest</span>
      </div>
      <div className={`nav-item ${location.pathname === "/Calendar" ? "active" : ""}`} onClick={() => navigate("/Calendar")}>
        <span>Calendar</span>
      </div>
      <div className={`nav-item ${location.pathname === "/Social" ? "active" : ""}`} onClick={() => navigate("/Social")}>
        <span>Social</span>
      </div>
    </div>
    </div>
  );
};

export default Social;
