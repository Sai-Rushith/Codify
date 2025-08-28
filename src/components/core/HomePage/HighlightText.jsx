import React from "react";

const HighlightText = ({text}) => {
  return (
    <span className="bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#EC4899] text-transparent bg-clip-text font-bold">
      {" "}
      {text}
    </span>
  );
};

export default HighlightText;