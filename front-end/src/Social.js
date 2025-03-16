import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from "react-router-dom";
import './Social.css';
import { Sling as Hamburger } from 'hamburger-react';

const Social = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [friendSuggestions, setFriendSuggestions] = useState([]);
  const [friends, setFriends] = useState([
    { id: 1, name: 'Alice', hydration: 7.5 },
    { id: 2, name: 'Bob', hydration: 6.2 },
    { id: 3, name: 'Charlie', hydration: 8.0 },
  ]);

  const allUsers = [
    { id: 4, name: 'David' },
    { id: 5, name: 'Eva' },
    { id: 6, name: 'Frank' },
  ];

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

  const handleAddFriend = (user) => {
    setFriends([...friends, { ...user, hydration: 0 }]);
    setSearchQuery('');
    setFriendSuggestions([]);
  };

  const handleRemoveFriend = (id) => {
    setFriends(friends.filter(friend => friend.id !== id));
  };

  return (
    <div className="social-page">
      <h1 className="page-title">Social</h1>
      <header>
        <h1></h1>
        <div className="hamburger-menu">
          <Hamburger toggled={isOpen} toggle={setOpen} color="white" />
        </div>
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

      {/* Add Friends Section */}
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

      {/* Friends List Section with Hover-to-Remove */}
      <div className="friends-list-section">
        <h2>Your Friends</h2>
        {friends.length > 0 ? (
          <ul className="friends-list">
            {friends.map(friend => (
              <li key={friend.id} className="friend-item">
                <span>{friend.name} - {friend.hydration}L</span>
                <button className="remove-friend-button" onClick={() => handleRemoveFriend(friend.id)}>Remove</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no friends added yet.</p>
        )}
      </div>

      <button className="leaderboard-button" onClick={() => navigate('/leaderboard')}>
        View Leaderboard
      </button>

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
