import { getAuth } from "firebase/auth";

export default function getToken() {
  const auth = getAuth();
  const user = auth.currentUser;
  return user ? user.getIdToken() : null;
}