import React from 'react'
import {Oval} from 'react-loader-spinner';

const Spinner = ({msg}) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
    <Oval
      type="Circles"
      color="#ef4444"
      secondaryColor="#eee"
      height={50}
      width={200}
      className="m-5"
    />
    <p className="text-lg text-center px-2">{msg}</p>
  </div>
  )
}

export default Spinner