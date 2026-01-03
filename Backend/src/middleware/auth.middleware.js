// import jwt from 'jsonwebtoken';
// import { ENV } from '../config/env.js';  // if importing from root-level middleware



// export const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization;
   
//   console.log("=========", ENV.JWT_SECRET)

//   if (!authHeader) {
//     return res.status(401).json({ message: 'Authorization header missing' });
//   }

//   const token = authHeader.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ message: 'Token missing' });
//   }

//   try {
//     const decoded = jwt.verify(token, ENV.JWT_SECRET);
//     req.userId = decoded.userId;

//     if (!req.userId) {
//       return res.status(401).json({ message: 'Invalid token payload' });
//     }

//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };

























import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export const authMiddleware = (req, res, next) => {

  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    // Attach userId to request (same as before)
    req.userId = decoded.userId;

    if (!req.userId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
