import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection , onSnapshot } from 'firebase/firestore';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { ShareMeContext } from '../context/ShareMeContext';


const Feed = () => {
  const {categoryId} = useParams()
  const [Loading , setLoading] = useState(false );
  const [cPins, setCpins] = useState([])
  const {pins,setPins} =useContext(ShareMeContext)

  useEffect(()=>{
    setLoading(true)
    const userRef = collection(db, "pin");
    onSnapshot(userRef, (snapshot) => {
      setPins(
        snapshot.docs.map((doc) => (
          { id: doc.id, data: doc.data() }
        ))
      );
      setLoading(false)
    });

  }, [])

  useEffect(()=>{
    setLoading(true)
    setCpins( pins.filter((pin)=>pin?.data?.category == categoryId) )
    setLoading(false)

  }, [categoryId, pins])

  if(Loading) return <Spinner msg={`we are adding a new ${categoryId} idea to your feed`} /> 
  return (
    <div>
        {pins && (
        <MasonryLayout pins={ categoryId ? cPins : pins} category={categoryId} />
      )}
    </div>
  )
}

export default Feed