const express = require('express');
const router = express.Router();

const leaderboard = [
  { id: 1, name: 'Sam', hydration: 2000, src: 'https://picsum.photos/101' },
  { id: 2, name: 'Wendy', hydration: 1000, src: 'https://picsum.photos/102' },
  { id: 3, name: 'Jerry', hydration: 500, src: 'https://picsum.photos/103' },
  { id: 4, name: 'Alice', hydration: 100, src: 'https://picsum.photos/104' },
  { id: 5, name: 'Bob', hydration: 97, src: 'https://picsum.photos/105' },
  { id: 6, name: 'Charlie', hydration: 80, src: 'https://picsum.photos/106' },
  { id: 7, name: 'David', hydration: 50, src: 'https://picsum.photos/107' },
  { id: 8, name: 'Eva', hydration: 23, src: 'https://picsum.photos/108' },
  { id: 9, name: 'Frank', hydration: 10, src: 'https://picsum.photos/109' }
];


router.get('/', (req, res) => res.json(leaderboard));

module.exports = router;
