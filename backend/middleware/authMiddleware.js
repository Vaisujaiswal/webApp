import jwt from "jsonwebtoken";

/* =========================
   VERIFY JWT MIDDLEWARE
========================= */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ Missing Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    // ❌ Missing token after Bearer
    if (!token) {
      return res.status(401).json({
        message: "Access denied. Token missing.",
      });
    }

    // ❌ JWT secret misconfiguration
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing in .env");
      return res.status(500).json({
        message: "Server configuration error",
      });
    }

    // 🔐 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("JWT VERIFY ERROR:", error.message);

    // ⏰ Token expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired. Please login again.",
        expired: true,
      });
    }

    // ❌ Invalid token
    return res.status(401).json({
      message: "Invalid token.",
    });
  }
};

/* =========================
   ROLE-BASED ACCESS CONTROL
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
