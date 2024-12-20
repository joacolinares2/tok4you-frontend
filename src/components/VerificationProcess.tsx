import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useActiveAccount } from "thirdweb/react";
import useUserVerificationStateStore from "@/stores/useUserVerificationStateStore";

// Define the props interface
interface VerificationProcessProps {
  handleLinkClick: (path: string) => void;
  currentPath: string;
}

interface VerificationState {
  register: boolean;
  hasKYC: boolean;
  hasTOS: boolean;
}

const VerificationProcess: React.FC<VerificationProcessProps> = ({
  handleLinkClick,
  currentPath,
}) => {
  const { userAuthorizationState } = useUserVerificationStateStore();
  const activeWallet = useActiveAccount();

  const [verificationState, setVerificationState] = useState<VerificationState>(
    {
      register: false,
      hasKYC: false,
      hasTOS: false,
    }
  );

  useEffect(() => {
    const verificationProcessData = userAuthorizationState;

    console.log(
      "estado que se va a cambiar en zustand",
      userAuthorizationState
    );

    setVerificationState({
      register: verificationProcessData.register,
      hasKYC: verificationProcessData.hasKYC,
      hasTOS: verificationProcessData.hasTOS,
    });
  }, [userAuthorizationState]);

  if (!activeWallet) {
    return null;
  }

  const getVerificationStateClass = (state: boolean) => {
    return state
      ? "h-2 w-2 bg-green-500 rounded-full"
      : "h-2 w-2 bg-red-500 rounded-full";
  };

  const isLinkDisabled = (linkType: "kyc" | "tos") => {
    if (linkType === "kyc") {
      return false;
    }
    if (linkType === "tos") {
      return false /* !verificationState.register || !verificationState.hasKYC */;
    }
    return false;
  };

  const renderLink = (
    to: string,
    text: string,
    stateKey: keyof VerificationState
  ) => {
    const isDisabled = isLinkDisabled(to.slice(1) as "kyc" | "tos");
    const ballClass = getVerificationStateClass(verificationState[stateKey]);

    return (
      <li
        className={`flex items-center space-x-3 ml-7 ${
          currentPath === to
            ? "text-c-primaryColor"
            : isDisabled
            ? "text-gray-400"
            : "text-gray-500"
        }`}
      >
        <span className="flex items-center space-x-3">
          {/* <span>{text}</span> */}
          <span className={ballClass}></span>
        </span>
        {!isDisabled && (
          <Link
            to={to}
            onClick={() => handleLinkClick(to)}
            className="flex items-center space-x-3 hover:text-c-primaryColor transition-colors"
          >
            <span>{text}</span>
          </Link>
        )}
      </li>
    );
  };

  return (
    <section>
      <ol className="space-y-2 text-base font-medium border-t border-gray-200 pt-4">
        {renderLink("/register", "Register", "register")}
        {renderLink("/kyc", "KYC", "hasKYC")}
        {renderLink("/tos", "TOS", "hasTOS")}
      </ol>
    </section>
  );
};

export default VerificationProcess;
