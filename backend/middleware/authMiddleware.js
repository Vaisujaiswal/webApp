import jwt from "jsonwebtoken";

/* =========================
   VERIFY JWT MIDDLEWARE
========================= */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    // ❌ No token after Bearer
    if (!token) {
      return res.status(401).json({
        message: "Access denied. Token missing.",
      });
    }

    // 🔐 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error("JWT VERIFY ERROR:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

/* =========================
   ROLE-BASED ACCESS (OPTIONAL)
========================= */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden. You do not have access.",
      });
    }

    next();
  };
};
