import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { ShareMeContext } from "../context/ShareMeContext";
import Spinner from "./Spinner";
import MasonryLayout from "./MasonryLayout";
import { db } from "../firebase";
import { BsCardImage } from "react-icons/bs";
import { collection, onSnapshot } from "firebase/firestore";
const activeBtnStyles =
  "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";

const UserProfile = () => {
  const [user, setUser] = useState("");
  const { usersDetails, sighnOut, pins  } = useContext(ShareMeContext);
  const [text, setText] = useState("Created");
  const [activeBtn, setActiveBtn] = useState("created");
  const [userPins, setUserPins] = useState([]);
  const [bgImage, setBgImage] = useState("");
  const { userId } = useParams();
  const nav = useNavigate()

  const SgnOut = ()=>{
    sighnOut();
    nav("/login")
  } 


  useEffect(() => {
    setUser(usersDetails.filter((user) => user?.data?.id == userId));
  }, []);

  useEffect(() => {
    if (text === "Created") {
      setUserPins(
        pins.filter((pin) => pin?.data?.postedBy?.name == user[0]?.data?.name)
      );
    } else if (text === "Saved") {
      const colRef = collection(db, "users", `${user[0]?.data?.name}`, "saved");
      onSnapshot(colRef, (snapshot) => {
        setUserPins(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
    }
  }, [text, user ,pins] );

  useEffect(() => {
    const num = Math.floor(Math.random() * userPins?.length);
    setBgImage(userPins[num]?.data?.imageUrl);
  }, [user, userPins]);
  if (!user) {
    return <Spinner msg="Loading ..." />;
  } 


  return (
    <>
      {user && (
        <>
          <div className="relative pb-2 h-full justify-center items-center">
            <div className="flex flex-col pb-5">
              <div className="relative flex flex-col mb-7">
                <div className="flex flex-col justify-center items-center">
                  {bgImage ? (
                    <img
                      className=" w-full h-370  2xl:h-510 shadow-lg object-cover"
                      src={`${bgImage}`}
                      alt="user-pic"
                    />
                  ) : (
                    <div className="bg-gray-800 w-full h-370  2xl:h-510 shadow-lg object-cover  flex justify-center items-center ">
                      <BsCardImage fontSize={80} color="white" />
                    </div>
                  )}
                  <img
                    className="rounded-full w-40 h-40 border-8  border-white  -mt-10 shadow-xl object-cover"
                    src={user[0]?.data?.image}
                    alt="user-pic"
                  />
                </div>
                <h1 className="font-bold text-3xl text-center mt-3">
                  {user[0]?.data?.name}
                </h1>
                <div className="absolute top-0 z-1 right-0 p-2">
                  {userId === user[0]?.data?.id && (
                    <button
                      type="button"
                      onClick={SgnOut}
                      className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                    >
                      <AiOutlineLogout color="red" fontSize={21} />
                    </button>
                  )}
                </div>
              </div>
              <div className="text-center mb-7">
                <button
                  type="button"
                  onClick={(e) => {
                    setText(e.target.textContent);
                    setActiveBtn("created");
                  }}
                  className={`${
                    activeBtn === "created"
                      ? activeBtnStyles
                      : notActiveBtnStyles
                  }`}
                >
                  Created
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    setText(e.target.textContent);
                    setActiveBtn("saved");
                  }}
                  className={`${
                    activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
                  }`}
                >
                  Saved
                </button>
              </div>

              <div className="px-2">
                <MasonryLayout pins={userPins} />
              </div>

              {userPins?.length == 0 && (
                <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
                  No Pins Found!
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UserProfile;
