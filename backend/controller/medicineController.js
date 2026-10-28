const dynamoDB = require('../config/dynamo');
const { v4: uuidv4 } = require('uuid');

const TABLE = process.env.MEDICINE_TABLE;

/**
 * ADD MEDICINE
 * NGO email is taken from JWT
 */
exports.addMedicine = async (req, res) => {
  try {
    const { name, manufacturer, quantity, expiryDate } = req.body;

    // Validation
    if (!name || !manufacturer || quantity == null || !expiryDate) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        message: 'Quantity must be greater than 0',
      });
    }

    const medicine = {
      medicineId: uuidv4(),
      name,
      manufacturer,
      quantity: Number(quantity), // IMPORTANT
      expiryDate,
      ngoEmail: req.user.email, // FROM JWT
      createdAt: new Date().toISOString(),
    };

    await dynamoDB.put({
      TableName: TABLE,
      Item: medicine,
    }).promise();

    res.status(201).json({
      message: 'Medicine added successfully',
      medicine,
    });

  } catch (error) {
    console.error('Add medicine error:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

/**
 * GET MEDICINES (ONLY FOR LOGGED-IN NGO)
 */
exports.getMedicines = async (req, res) => {
  try {
    const result = await dynamoDB.scan({
      TableName: TABLE,
      FilterExpression: 'ngoEmail = :email',
      ExpressionAttributeValues: {
        ':email': req.user.email,
      },
    }).promise();

    res.json(result.Items);

  } catch (error) {
    console.error('Get medicines error:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};
