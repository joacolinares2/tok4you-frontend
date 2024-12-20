import { toast, ToastOptions } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 
import { TriangleAlert, ArrowDown  } from 'lucide-react';


type AlertType = "success" | "error" | "warning" | "info" | "download" | "confirm";
type OnConfirmFunction = () => void;

interface AlertOptions extends ToastOptions {
  className?: string;
  duration?: number | false;
}
interface ConfirmAlertOptions extends AlertOptions {
  onConfirm?: OnConfirmFunction;
}

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000, // Default autoClose for other alerts
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const showAlert = (
  type: AlertType,
  message: string,
  options?: AlertOptions & { onConfirm?: OnConfirmFunction }
) => {
  const { className, duration, onConfirm, autoClose, ...toastOptions } =
    options || {};

  const finalOptions = {
    ...defaultOptions,
    ...toastOptions,
    autoClose: autoClose !== undefined ? autoClose : defaultOptions.autoClose,
    className: className || "",
  };

  switch (type) {
    case "success":
      toast.success(
        <div>
          <i className="fa fa-check-circle text-green-500 mr-2"></i> {message}
        </div>,
        finalOptions
      );
      break;
    case "error":
      toast.error(
        <div className="flex flex-col">
          <p className="text-gray-900 font-bold">Error</p>
          <p className="text-gray-900 flex flex-col items-start justify-start">
            <span>{message}</span>
            {/*  <a className="text-blue-400 underline text-xs" href="/">
              O comuníquese con soporte.
            </a> */}
          </p>
          <i className="fa fa-times-circle text-red-500 mr-2"></i>
        </div>,
        { ...finalOptions, autoClose: false }
      );
      break;
    case "warning":
      toast.warn(
        <div>
          <i className="fa fa-exclamation-circle text-yellow-500 mr-2"></i>{" "}
          {message}
        </div>,
        finalOptions
      );
      break;
    case "info":
      toast.info(
        <div>
          <i className="fa fa-info-circle text-c-primaryColor mr-2"></i> {message}
        </div>,
        finalOptions
      );
      break;
    case "download":
      toast(
        <div className="flex flex-col items-center justify-center">
          <p className="my-8 text-gray-900 font-bold">{message}</p>
          <button
            className="mb-8 bg-c-primaryColor text-white py-2 px-3 rounded-md hover:bg-c-secondaryColor flex items-center justify-center space-x-2"
            onClick={() => {
              console.log("Downloading certificate...");
            }}
          >
            <ArrowDown className="w-5 h-5 mr-2" /> Descargar
          </button>
        </div>,
        { ...finalOptions, autoClose: false }
      );
      break;
    case "confirm":
      toast(
        <div className="p-6 max-w-md mx-auto">
          <p className="text-gray-800 font-semibold mb-4">{message}</p>
          <div className="flex justify-end">
            <button
              className="bg-c-primaryColor text-white py-2 px-4 rounded-md hover:bg-c-secondaryColor mr-2"
              onClick={() => {
                console.log("Confirming action...");
              }}
            >
              Confirmar
            </button>
            <button
              className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500"
              onClick={() => {
                console.log("Canceling action...");
                toast.dismiss();
              }}
            >
              Cancelar
            </button>
          </div>
        </div>,
        finalOptions
      );
      break;
    default:
      break;
  }
};

export const showSuccessAlert = (message: string, options?: AlertOptions) => {
  showAlert("success", message, options);
};

export const showErrorAlert = (message: string, options?: AlertOptions) => {
  showAlert("error", message, options);
};

export const showDownloadAlert = (message: string, options?: AlertOptions) => {
  showAlert("download", message, options);
}

export const showConfirmAlert = (message: number, payment:string, options?: ConfirmAlertOptions) => {
  return new Promise<boolean>((resolve) => {
    const { onConfirm, ...restOptions } = options || {};

    
    const confirmToast = toast(
      <div className=" ">
        <div className="flex justify-center mb-4">
          <TriangleAlert className="h-10 w-10 text-c-primaryColor" />
        </div>

        {/* <p className="text-center text-gray-900 font-bold text-lg mb-2">Saldo: {message} usdt</p> */}

        <p className="text-center text-xl text-gray-500 mb-4">
          Usted pagará: {payment}
        </p>

        <div className="flex justify-center">
          <button
            className="bg-c-primaryColor text-white py-2 px-8 rounded-md hover:bg-c-secondaryColor"
            onClick={() => {
              console.log("Confirming action...");
              resolve(true);
              toast.dismiss(confirmToast);
              if (onConfirm) {
                onConfirm();
              }
            }}
          >
            Confirmar
          </button>
        </div>
      </div>,
      { ...restOptions, autoClose: false }
    );
  });
};

/* const progressBarStyles = {
  style: {
    background: 'linear-gradient(to right, #4caf50, #4caf50)', 
  },
};
 */
