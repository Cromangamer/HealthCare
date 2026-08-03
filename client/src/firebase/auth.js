import { auth } from "./config";
import { signOut } from "firebase/auth";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

let confirmationResult = null;
const googleProvider = new GoogleAuthProvider();


export const signInWithGoogle = async () => {
  try {
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    let result;
    if (isMobile) {
      result = await signInWithRedirect(auth, googleProvider);
    } else {
      result = await signInWithPopup(auth, googleProvider);
    }
    const token = await result.user.getIdToken();

    return {
      success: true,
      user: result.user,
      token,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const sendOTP = async (phoneNumber) => {
  try {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        },
      );
    }

    confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      window.recaptchaVerifier,
    );

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const verifyOTP = async (otp) => {
  try {
    if (!confirmationResult) {
      return {
        success: false,
        error: "Please request an OTP first.",
      };
    }

    const result = await confirmationResult.confirm(otp);
    confirmationResult = null;
    const token = await result.user.getIdToken();

    return {
      success: true,
      user: result.user,
      token,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
 
