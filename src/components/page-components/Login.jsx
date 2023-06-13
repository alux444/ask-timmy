import React, { useContext } from "react";
import { Box, Button } from "@mui/material";
import { auth, provider } from "../../../server/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { UserContext } from "../../App";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../server/firebaseConfig";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const usersRef = collection(db, "users");

  const googleSignIn = () => {
    const searchForUser = async (email) => {
      const querySnapshot = await getDocs(
        query(usersRef, where("email", "==", email))
      );

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const username = userData.username;
        setUser({ loggedIn: true, username: username, email: email });
      } else {
        const username = email.split("@")[0];
        createUser(username, email);
      }
    };

    const createUser = async (username, email) => {
      const querySnapshot = await getDocs(
        query(usersRef, where("email", "==", email))
      );

      if (querySnapshot.empty) {
        await addDoc(usersRef, {
          username: username,
          email: email,
        });
      }
    };

    signInWithPopup(auth, provider).then((result) => {
      searchForUser(result.user.email);
      navigate("/firebase-chatapp/home");
    });
  };

  return (
    <Box>
      <Box>
        <p>Sign in with Google</p>
        <button onClick={googleSignIn}>Sign In</button>
      </Box>
    </Box>
  );
};

export default Login;
