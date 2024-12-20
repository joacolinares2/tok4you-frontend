/* const TestingComponent = () => {
  const handleDownload2 = async () => {
    const response = await fetch(
      "https://pdfbuytokensprojects.s3.us-east-2.amazonaws.com/documentsCreateProjects/b4a75a03-8788-49cb-b2cb-c433ee28232b.pdf",

      {
        method: "GET",
        headers: {
          // Add any necessary headers here, e.g., Authorization
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch the file");
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "your-file-name.pdf"); // Set the desired file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url); // Clean up the URL object
  };

  return (
    <>
      <button
        onClick={handleDownload2}
        className="bg-c-primaryColor text-white py-2 px-4 rounded"
      >
        DOWNLOAD PDF 2
      </button>
    </>
  );
};

export default TestingComponent;

 */

/* 
import React, { useState } from "react";

const TestingComponent: React.FC = () => {
  const [url, setUrl] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleButtonClick = () => {
    if (url) {
      window.location.href = url;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="text"
        value={url}
        onChange={handleInputChange}
        placeholder="Enter URL"
        className="border p-2 mb-2"
      />
      <button
        onClick={handleButtonClick}
        className="bg-c-primaryColor text-white p-2 rounded"
      >
        Go to Link
      </button>
    </div>
  );
};

export default TestingComponent;
 */

import React, { useState } from "react";

const TestingComponent: React.FC = () => {
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleDownloadInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDownloadUrl(e.target.value);
  };

  const handleDownloadClick = () => {
    if (downloadUrl) {
      // Create a link element
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", ""); // This attribute makes the browser download the file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div>
        <input
          type="text"
          value={downloadUrl}
          onChange={handleDownloadInputChange}
          placeholder="Enter download URL"
          className="border p-2 mb-2"
        />
        <button
          onClick={handleDownloadClick}
          className="bg-green-500 text-white p-2 rounded"
        >
          Download File
        </button>
      </div>
    </div>
  );
};

export default TestingComponent;
