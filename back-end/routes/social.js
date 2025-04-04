const express = require('express');
const router = express.Router();

let friends = [
  { id: 1, name: 'Alice', hydration: 7.5, src: 'https://picsum.photos/101' },
  { id: 2, name: 'Bob', hydration: 6.2, src: 'https://picsum.photos/102' },
  { id: 3, name: 'Charlie', hydration: 8.0, src: 'https://picsum.photos/103' }
];

const allUsers = [
  { id: 4, name: 'David', hydration: 2, src: 'https://picsum.photos/104' },
  { id: 5, name: 'Eva', hydration: 1, src: 'https://picsum.photos/105' },
  { id: 6, name: 'Frank', hydration: 5, src: 'https://picsum.photos/106' }
];

router.get('/friends', (req, res) => res.json(friends));

router.get('/suggestions', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const suggestions = allUsers.filter(
    user => user.name.toLowerCase().includes(query) &&
    !friends.some(f => f.id === user.id)
  );
  res.json(suggestions);
});

router.post('/add', (req, res) => {
  const user = req.body;
  if (!friends.find(f => f.id === user.id)) {
    friends.push(user);
  }
  res.json({ message: 'Friend added' });
});

router.post('/remove', (req, res) => {
  const { id } = req.body;
  friends = friends.filter(f => f.id !== id);
  res.json({ message: 'Friend removed' });
});

module.exports = router;
