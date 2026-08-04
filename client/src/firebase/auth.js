import { auth } from "./config";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
} from "firebase/auth";
import {browserLocalPersistence,  setPersistence,} from "firebase/auth";

let confirmationResult = null;
let persistenceReady = null; // cache the promise so we only set it once

const googleProvider = new GoogleAuthProvider();

const ensurePersistence = () => {
  if (!persistenceReady) {
    persistenceReady = setPersistence(auth, browserLocalPersistence);
  }
  return persistenceReady;
};

export const signInWithGoogle = async () => {
  try {
    
    await ensurePersistence();
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    console.log(navigator.userAgent);
    console.log("Is Mobile:", isMobile);
    if (isMobile) {
      const result = await signInWithRedirect(auth, googleProvider);
      console.log("Redirect initiated:", result);
      // Redirect starts here.
      // AuthInit will continue after the user returns.
      return{
        success: true,
        result,
      };
    }

    const result = await signInWithPopup(auth, googleProvider);

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

export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);

    if (!result) {
      return null;
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
        }
      );
    }

    confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      window.recaptchaVerifier
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