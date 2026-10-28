const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const {
  addMedicine,
  getMedicines
} = require('../controller/medicineController');

router.post('/add', auth, addMedicine);
router.get('/all', auth, getMedicines);

module.exports = router;
