const admin = require("../config/firebaseAdmin");

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log(req.headers);
    

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization tokan missing",
      });
    }
    // Extract token
    const idToken = authHeader.split("Bearer ")[1];

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Store decoded user info
    req.firebaseUser = decodedToken;

    next();
  } catch (error) {
    console.error("Firebase Token Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
module.exports = verifyFirebaseToken;