import React from "react";
import Masonry from "react-masonry-css";
import Pin from "./Pin";
import Spinner from "./Spinner";

const breakpointColumnsObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({ pins, category }) => {
  return (
    <>
      {pins.length > 0 ? (
        <Masonry
          className="flex animate-slide-fwd"
          breakpointCols={breakpointColumnsObj}
        >
          {pins?.map((pin, index) => (
            <Pin key={index} pin={pin} className="w-max" />
          ))}
        </Masonry>
      ) : (
        <div>
          <p className="flex text-[40px] text-red-500 justify-center items-center h-[50vh] text-center my-auto">
            no {category} pins to show
          </p>
        </div>
      )}
    </>
  );
};

export default MasonryLayout;
