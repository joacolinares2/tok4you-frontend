import React from "react";

interface KeyValueDisplayProps {
  title: string;
  content?: string;
}

const KeyValueDisplay: React.FC<KeyValueDisplayProps> = ({
  title = "title",
  content = "content",
}) => {
  return (
    <div className="w-full flex flex-row items-center justify-between bg-white rounded-lg shadow-md py-3 px-5 gap-4">
      <p className="font-bold">{title}</p>
      <p className="w-[80%] overflow-x-auto text-right ">{content}</p>
    </div>
  );
};

export default KeyValueDisplay;
