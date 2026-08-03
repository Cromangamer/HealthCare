import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase/config";
import { userLogin } from "../api/login";
import { userLogout } from "../features/auth/firebaseLogin";
import Loading from "./Loading";

function AuthInit({children}) {
  const dispatch = useDispatch();

  const loading = useSelector(
        state => state.firebaseLogin.loading
    );

  useEffect(() => {
    if (!auth) {
      dispatch(userLogout());
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          dispatch(userLogin(idToken));
        } catch (error) {
          console.error("Authentication failed:", error);
          dispatch(userLogout());
        }
      } else {
        dispatch(userLogout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }

  return children;
}

export default AuthInit;