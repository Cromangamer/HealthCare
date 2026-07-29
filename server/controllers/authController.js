const authService = require("../services/authService");

exports.firebaseLogin = async (req, res) => {
    try {
        const user = await authService.firebaseLogin(req.firebaseUser);
        
        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};