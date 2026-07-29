const User = require("../models/user");

exports.firebaseLogin = async (firebaseUser) => {

    // Find user
    const existingUser = await User.findOne({
        firebaseUid: firebaseUser.uid,
    });

    // Return existing
    if (existingUser) {
        return existingUser;
    }

    const fullName = firebaseUser.name || "";
    const nameParts = fullName.trim().split(" ");

    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const provider = firebaseUser.firebase.sign_in_provider;
    const authProvider = provider === "google.com" ? "google" : "phone";
    // Create new
    const user = new User({
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email || undefined,
        phone: firebaseUser.phone_number || undefined,
        firstName,
        lastName,
        authProvider,
        providers: [authProvider],
        emailVerified: firebaseUser.email_verified,
        profileImage: firebaseUser.picture,
    });

    const saveUser = await user.save();


    return saveUser;
};