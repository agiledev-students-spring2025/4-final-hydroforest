import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    { id: 1, name: 'Alice', hydration: 7.5, src:"https://picsum.photos/101" },
    { id: 2, name: 'Bob', hydration: 6.2, src:"https://picsum.photos/102" },
    { id: 3, name: 'Charlie', hydration: 8.0, src:"https://picsum.photos/103" },
  ]);

  const allUsers = [
    { id: 4, name: 'David',hydration: 7.5, src:"https://picsum.photos/104"},
    { id: 5, name: 'Eva' ,hydration: 7.5, src:"https://picsum.photos/105"},
    { id: 6, name: 'Frank' ,hydration: 7.5, src:"https://picsum.photos/106"},
  ];
  
    // Effect to control body overflow
    useEffect(() => {
      // Save the original overflow value
      const originalOverflow = document.body.style.overflow;
  
      // Set overflow to "auto" for this page
      document.body.style.overflow = "auto";
  
      // Cleanup: Reset to the original overflow value on unmount
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }, []);

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
      <h1 className="social-title">Social</h1>
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

      <motion.div 
        className="add-friend-section"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Add Friends</h2>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search for friends..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <AnimatePresence>
            {friendSuggestions.length > 0 && (
              <motion.ul 
                className="suggestions-list"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {friendSuggestions.map(user => (
                  <motion.li 
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {user.name}
                    <button onClick={() => handleAddFriend(user)}>Add</button>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Friends List Section with Hover-to-Remove */}
      <motion.div 
        className="friends-list-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2>Your Friends</h2>
        <AnimatePresence>
          {friends.length > 0 ? (
            <ul className="friends-list">
              {friends.map((friend) => (
                <motion.li 
                  key={friend.id} 
                  className="friend-item friend-drawer friend-drawer--onhover"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {/* Profile Image */}
                  <img 
                    className="profile-image" 
                    src={friend.src} 
                    alt={friend.name} 
                  />

                  {/* Friend Name and Hydration Level */}
                  <div className="text">
                    <h6>{friend.name}</h6>
                    <p className="text-muted">{friend.hydration}L Hydrated</p>
                  </div>

                  {/* Remove Button */}
                  <button 
                    className="remove-friend-button" 
                    onClick={() => handleRemoveFriend(friend.id)}
                  >
                    Remove
                  </button>
                  
                </motion.li>
              ))}
              {/* Horizontal Line */}
              <hr />
            </ul>
          ) : (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              You have no friends added yet.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

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
