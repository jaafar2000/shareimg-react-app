import React, { useContext, useEffect, useState } from "react";
import { ShareMeContext } from "../context/ShareMeContext";
import { Link, useParams } from "react-router-dom";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { db } from "../firebase";
import { collection, addDoc , serverTimestamp , query , orderBy, onSnapshot} from "firebase/firestore";
const PinDetail = () => {
  const { user, pins } = useContext(ShareMeContext);
  const { pinId } = useParams();
  const [pinDetail, setPinDetail] = useState();
  const [comment, setComment] = useState("");
  const [comments , setComments] = useState([])

  useEffect(() => {
    const unsub = () => {
      setPinDetail(pins.filter((pin) => pin?.id == pinId));
    };
    return unsub();
  }, []);


  useEffect(() => {
    const colRef = collection(db, "pin", `${pinId}`, "comments");
    const q = query(colRef, orderBy("time", "desc"));
    onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs);
    });
  }, [db,pinId ]);

  // add comment
  const addComment = () => {

    if (comment){
      const colRef = collection(db, "pin", `${pinId}`, "comments");
      addDoc(colRef, {
        comment: comment,
        name: user?.name,
        img: user?.image,
        time : serverTimestamp(),
      });
    }
    setComment("");


  };
  if (!pinDetail) {
    return <Spinner message="Showing pin" />;
  }
  return (
    <div>
      <>
        {pinDetail && (
          <div
            className="flex xl:flex-row flex-col m-auto w-[80%] bg-white"
            style={{ maxWidth: "1500px", borderRadius: "32px" }}
          >
            <div className="flex justify-center items-center md:items-start flex-initial">
              <img
                className="rounded-t-3xl rounded-b-lg"
                src={`${pinDetail[0]?.data?.imageUrl}`}
                alt="user-post"
              />
            </div>
            <div className="w-full p-5 flex-1 xl:min-w-620">
              <div className="flex items-center justify-between">
                <a
                  href={pinDetail[0]?.data?.destination}
                  target="_blank"
                  rel="noreferrer"
                >
                  {pinDetail[0]?.data?.destination?.slice(8)}
                </a>
              </div>
              <div>
                <h1 className="text-4xl font-bold break-words mt-3">
                  {pinDetail[0].data?.title}
                </h1>
                <p className="mt-3">{pinDetail[0].about}</p>
              </div>
              <Link
                to={`/user-profile/${pinDetail[0]?.data?.postedBy?.id}`}
                className="flex gap-2 mt-5 items-center bg-white rounded-lg "
              >
                <img
                  src={pinDetail[0]?.data?.postedBy?.image}
                  className="w-10 h-10 rounded-full"
                  alt="user-profile"
                />
                <p className="font-bold">
                  {pinDetail[0]?.data?.postedBy?.name}
                </p>
              </Link>
              <h2 className="mt-5 text-2xl">Comments</h2>
              <div className="max-h-370 overflow-y-auto">
                {comments?.map((item , index) => (
                  <div
                    className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                    key={`${item?.data()?.comment}${index}`}

                  >
                    <img
                      src={item?.data()?.img}
                      className="w-10 h-10 rounded-full cursor-pointer"
                      alt="user-profile"
                    />
                    <div className="flex flex-col">
                      <p className="font-bold">{item?.data()?.name}</p>
                      <p>{item?.data()?.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap mt-6 gap-3">
                <Link to={`/user-profile/${user.id}`}>
                  <img
                    src={user.image}
                    className="w-10 h-10 rounded-full cursor-pointer"
                    alt="user-profile"
                  />
                </Link>
                <input
                  className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-red-500"
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  type="button"
                  className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none disabled:bg-gray-500"
                  onClick={addComment}
                  disabled={!comment}
                >
                  send
                </button>
              </div>
            </div>
          </div>
        )}
        {pins?.length > 0 && (
          <h2 className="text-center font-bold text-2xl mt-8 mb-4">
            More like this
          </h2>
        )}
        {pins ? (
          <MasonryLayout pins={pins} />
        ) : (
          <Spinner message="Loading more pins" />
        )}
      </>
    </div>
  );
};

export default PinDetail;
