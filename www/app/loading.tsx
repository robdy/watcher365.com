import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen flex justify-center mt-10">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-green-600 border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default Loading;
