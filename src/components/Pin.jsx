import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { saveAs } from "file-saver";
import { ShareMeContext } from "../context/ShareMeContext";
import { db } from "../firebase";
import {
  collection,
  deleteDoc,
  setDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

const Pin = ({
  pin,
  pin: {
    id,
    data: {
      imageUrl,
      title,
      postedBy: { name, image, id: userId },
      destination,
    },
  },
}) => {
  const [postHovered, setPostHovered] = useState(false);
  const [saved, setSaved] = useState([]);
  const [hasSaved, setHasSaved] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(ShareMeContext);

  useEffect(() => {
    const colRef = collection(db, "users", `${user?.name}`, "saved");
    onSnapshot(colRef, (snapshot) => {
      setSaved(snapshot.docs);
    });
  }, [db]);
  useEffect(() => {
    setHasSaved(saved.findIndex((save) => save?.data()?.id == id) !== -1);
  }, [saved]);

  const deletePin = (id) => {
    if (window.confirm("are you sure")) {
      const colRef = doc(db, "pin", id);
      deleteDoc(colRef).then(() => {});
    }
  };

  const save = async () => {
    if (hasSaved) {
      await deleteDoc(doc(db, "users", `${user?.name}`, "saved", `${id}`));
    } else {
      await setDoc(doc(db, "users", `${user?.name}`, "saved", `${id}`), {
        id: id,
        imageUrl: imageUrl,
        title: title,
        destination: destination,
        postedBy: {
          name: name,
          image: image,
          id: userId,
        },
      });
    }
  };

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${id}`)}
        className=" relative  w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 bg-red-500 ease-in-out"
      >
        {imageUrl && (
          <img
            className="rounded-lg w-full"
            src={`${imageUrl}`}
            alt="user-post"
          />
        )}
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <div
                  href={`${imageUrl}`}
                  onClick={() => {}}
                  className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </div>
              </div>
              {
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    save(id);
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {hasSaved ? "un save" : "save"}
                </button>
              }
            </div>
            <div className=" flex justify-between items-center gap-2 w-full">
              {destination?.slice(8).length > 0 ? (
                <a
                  href={destination}
                  target="_blank"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                  rel="noreferrer"
                >
                  {" "}
                  <BsFillArrowUpRightCircleFill />
                  {destination?.slice(8, 17)}...
                </a>
              ) : undefined}
              {userId === user?.id && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(id);
                  }}
                  className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`/user-profile/${userId}`}
        className="flex gap-2 mt-2 items-center"
      >
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={`${image}`}
          alt="user-profile"
        />
        <p className="font-semibold capitalize">{name}</p>
      </Link>
    </div>
  );
};

export default Pin;
