import React, { useContext, useEffect, useState } from "react";
import { ShareMeContext } from "../context/ShareMeContext";
import MasonryLayout from "./MasonryLayout";

const Search = ({ searchTerm }) => {
  const { pins } = useContext(ShareMeContext);
  const [searchpin, setSearchpin] = useState([]);
  useEffect(() => {
    setSearchpin(
      pins.filter((pin) =>
        pin.data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||pin.data.about.toLowerCase().includes(searchTerm.toLowerCase()) 
      )
    );
  }, [searchTerm]);
  return (
    <div>
      <MasonryLayout pins={searchpin} />
    </div>
  );
};

export default Search;
