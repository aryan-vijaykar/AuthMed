const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dynamoDB = require('../config/dynamo');

const TABLE = process.env.USERS_TABLE;

/**
 * SIGNUP
 * Accepts: name, email, password
 * - Checks if user already exists
 * - Hashes password
 * - Prevents overwrite
 */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      email,               // PK
      name,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    // Conditional put → prevents duplicate users
    await dynamoDB.put({
      TableName: TABLE,
      Item: user,
      ConditionExpression: 'attribute_not_exists(email)',
    }).promise();

    return res.status(201).json({
      message: 'User registered successfully',
    });

  } catch (error) {
    // If user already exists
    if (error.code === 'ConditionalCheckFailedException') {
      return res.status(409).json({
        message: 'User already exists',
      });
    }

    console.error('Signup error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

/**
 * LOGIN
 * Accepts: email, password
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const result = await dynamoDB.get({
      TableName: TABLE,
      Key: { email },
    }).promise();

    if (!result.Item) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const isMatch = await bcrypt.compare(password, result.Item.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      { email: result.Item.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      token,
      user: {
        email: result.Item.email,
        name: result.Item.name,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
