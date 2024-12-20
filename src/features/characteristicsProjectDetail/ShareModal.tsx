import React, { useState } from "react";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import { X } from "lucide-react";
import { FiShare2 } from "react-icons/fi"; 

const ShareModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative z-20">
      <button
        onClick={toggleModal}
        className={`p-2 bg-c-primaryColor text-white rounded-full hover:bg-c-secondaryColor transition duration-200 ${
          isOpen ? "bg-gray-500 hover:bg-gray-600" : ""
        }`}
      >
        {isOpen ? <X size={24} /> : <FiShare2 size={24} />}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-10 w-48 p-4 bg-white shadow-lg rounded-lg">
          <div className="flex justify-around">
            <FacebookShareButton url={window.location.href}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={window.location.href}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <LinkedinShareButton url={window.location.href}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <WhatsappShareButton url={window.location.href}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareModal;
