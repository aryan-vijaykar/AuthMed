require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoute');
const medicineRoutes = require('./routes/medicineRoute');

app.use('/api/auth', authRoutes);
app.use('/api/medicine', medicineRoutes);

app.get('/', (req, res) => {
  res.send('AuthMed Backend Running 🚀');
});

// Local dev only — Lambda uses handler.js
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
