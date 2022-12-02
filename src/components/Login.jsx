import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {  video } from "../images/index";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { TiCamera } from "react-icons/ti";
import { ShareMeContext } from "../context/ShareMeContext";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
const Login = () => {
  const { setUser, users } = useContext(ShareMeContext);
  const navigate  = useNavigate()


  const SignIn = () => {
    signInWithPopup(auth, provider).then(async (result) => {
      if (users.includes(result?.user?.displayName)) {
        console.log("truw")
        const doRef = doc(db, "users", `${result?.user.displayName}`);
        getDoc(doRef).then((docsnap) => {
          setUser(docsnap.data());
        });
      } else {
        setDoc(doc(db, "users", `${result?.user?.displayName}`), {
          name: result?.user?.displayName,
          id: result?.user?.uid,
          email: result?.user?.email,
          image: result?.user?.photoURL,
        });
      }
      navigate("/")
    });

  };

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={video}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover "
        />
        <div className="absolute flex flex-col justify-center items-center top-0 left-0 bottom-0 right-0 bg-blackOverlay">
          <div className="p-5">
          <div className="flex justify-center  items-center">
            <div className="flex justify-center border-2 mr-1 border-red-500 items-center rounded-full w-10 h-10">
              <TiCamera fontSize={30} color="#ef4444" />
            </div>
            <div className="text-[20px] font-bold text-white	" >
              {" "}
              SHARE<span className="text-red-500" >IMG</span>
            </div>
          </div>          </div>
          <div className="shadow-2xl">
            <button
              type="button"
              onClick={SignIn}
              className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
            >
              <FcGoogle className="mr-4" />
              Sign in with google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
