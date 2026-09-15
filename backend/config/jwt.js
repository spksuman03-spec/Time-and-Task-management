import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'tasksphere_jwt_secret_key_super_secure_2026_production', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'tasksphere_jwt_secret_key_super_secure_2026_production');
};
