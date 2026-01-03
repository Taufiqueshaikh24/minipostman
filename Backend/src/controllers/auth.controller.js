import { signup, login } from '../services/auth.services.js';

export const signupController = async (req, res) => {
  try {
    const { email, password } = req.body;
    await signup(email, password);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  const { token, userId } = await login(email, password);

  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    message: 'Login successful',
    userId,
  });
};


export const logoutController = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  });

  res.json({ message: 'Logged out successfully' });
};
