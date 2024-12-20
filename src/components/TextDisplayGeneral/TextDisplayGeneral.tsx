import React from "react";

interface TextDisplayGeneralProps {
  title: string;
  content?: string;
}

const TextDisplayGeneral: React.FC<TextDisplayGeneralProps> = ({
  title = "title",
  content = "content",
}) => {
  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md border-2 border-c-light-gray overflow-hidden">
      <h1 className="text-c-text-primary text-xl font-bold mb-4">{title}</h1>
      <p className="text-c-text-secondary h-28 overflow-y-scroll">{content}</p>
    </div>
  );
};

export default TextDisplayGeneral;
