import React from "react";

interface DownloadStampingInvestmentCertificateProps {
  isOpen: boolean;
  onClose: () => void;
  downloadLink: string;
}

const DownloadStampingInvestmentCertificate: React.FC<
  DownloadStampingInvestmentCertificateProps
> = ({ isOpen, onClose, downloadLink }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    window.open(downloadLink, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <p className="text-center mb-4">
          Gracias por tu compra, aquí puedes descargar tu certificado.
        </p>
        <button
          onClick={handleDownload}
          className="w-full bg-c-primaryColor text-white py-2 px-4 rounded hover:bg-c-secondaryColor transition duration-200"
        >
          Descargar Certificado
        </button>
      </div>
    </div>
  );
};

export default DownloadStampingInvestmentCertificate;
