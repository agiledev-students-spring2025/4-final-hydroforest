import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import './Social.css';
import { Sling as Hamburger } from 'hamburger-react';

const Social = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [friendSuggestions, setFriendSuggestions] = useState([]);
  const [friends, setFriends] = useState([]);
  const [showHelp, setShowHelp] = useState(false);

  const token = localStorage.getItem('token');

  // Load friends on mount
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch('/api/social', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const { friends } = await response.json();
        setFriends(friends || []);
      } catch (error) {
        console.error('Error loading friends:', error);
      }
    };

    fetchFriends();
  }, [token]);

  // Load suggestions while typing
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFriendSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await fetch(`/api/social/suggestions?q=${searchQuery}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setFriendSuggestions(data.suggestions || []);
      } catch (error) {
        console.error('Error loading suggestions:', error);
        setFriendSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [searchQuery, token]);

  const handleAddFriend = async (friendId) => {
    try {
      await fetch('/api/social/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ friendId }),
      });
      setFriends(prev => [...prev, friendSuggestions.find(f => f._id === friendId)]);
      setSearchQuery('');
      setFriendSuggestions([]);
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await fetch('/api/social/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ friendId }),
      });
      setFriends(prev => prev.filter(friend => friend._id !== friendId));
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  return (
    <div className="social-page">
      <h1 className="social-title">Social</h1>

      <header>
      <h2> </h2>
        <div className="hamburger-menu">
          <Hamburger toggled={isOpen} toggle={setOpen} color="white" />
        </div>
        <motion.div
          className="sidebar-menu"
          initial={{ x: '100%' }}
          animate={{ x: isOpen ? 0 : '100%' }}
          transition={{ type: 'tween', duration: 0.4 }}
        >
          <ul>
            <li onClick={() => { navigate('/Account'); setOpen(false); }}>My Account</li>
            <li onClick={() => { navigate('/AboutUs'); setOpen(false); }}>About Us</li>
            <li onClick={() => { setShowHelp(true); setOpen(false); }}>Help</li>
            <li className="logout" onClick={() => { localStorage.clear(); navigate("/Login"); setOpen(false); }}>Logout</li>
          </ul>
        </motion.div>
      </header>

      <motion.div className="add-friend-section" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
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
              <motion.ul className="suggestions-list" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {friendSuggestions.map(user => (
                  <motion.li key={user._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    {user.username}
                    <button onClick={() => handleAddFriend(user._id)}>Add</button>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {showHelp && (
        <motion.div className="help-popup" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}>
          <div className="help-message">
            <h2>HydroForest</h2>
            <p>This page lets you connect with other users and track their hydration progress.</p>
            <button onClick={() => setShowHelp(false)}>Close</button>
          </div>
        </motion.div>
      )}

      <motion.div className="friends-list-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
        <h2>Your Friends</h2>
        <AnimatePresence>
          {friends.length > 0 ? (
            <ul className="friends-list">
              {friends.map(friend => (
                <motion.li key={friend._id} className="friend-item" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <img className="profile-image" src={friend.src || 'https://picsum.photos/100'} alt={friend.username} />
                  <div className="text">
                    <h6>{friend.username}</h6>
                    <p className="text-muted">{friend.totalWaterLogged || 0} mL Hydrated</p>
                  </div>
                  <button className="remove-friend-button" onClick={() => handleRemoveFriend(friend._id)}>Remove</button>
                </motion.li>
              ))}
              <hr />
            </ul>
          ) : (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="no-leaderboard">You have no friends added yet</motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <button className="leaderboard-button" onClick={() => navigate('/leaderboard')}>View Leaderboard</button>

      <div className="navbar">
        <div className={`nav-item ${location.pathname === "/" ? "active" : ""}`} onClick={() => navigate("/")}>
          <img className="icon-image" src="images/icon/home1.png" alt="Home" />
        </div>
        <div className={`nav-item ${location.pathname === "/Forest" ? "active" : ""}`} onClick={() => navigate("/Forest")}>
          <img className="icon-image" src="images/icon/forest.png" alt="Forest" />
        </div>
        <div className={`nav-item ${location.pathname === "/Calendar" ? "active" : ""}`} onClick={() => navigate("/Calendar")}>
          <img className="icon-image" src="images/icon/calendar.png" alt="Calendar" />
        </div>
        <div className={`nav-item ${location.pathname === "/Social" ? "active" : ""}`} onClick={() => navigate("/Social")}>
          <img className="icon-image" src="images/icon/friend.png" alt="Social" />
        </div>
      </div>
    </div>
  );
};

export default Social;
