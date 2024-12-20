import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useActiveAccount } from "thirdweb/react";
import { sendTransactionData } from "../../../controllers/bankTransactions.controller";
import LayoutBars from "@/components/LayoutBars";
import {
  showErrorAlert,
  showSuccessAlert,
} from "@/utils/notificationsListWithReactToastify/notifications";

// Define el esquema usando Zod
const schema = z.object({
  userWallet: z.string().min(1, "La wallet del usuario es requerida"),
  sourceBank: z.string().min(1, "El banco de origen es requerido"),
  destinationBank: z.string().min(1, "El banco de destino es requerido"),
  usdAmount: z.coerce.number().positive("La cantidad transferida debe ser positiva"),
  transactionId: z.string().min(1, "El ID de la transacción es requerido"),
  userBankAccountNumber: z.string().min(1, "El número de cuenta bancaria es requerido"),
  userBankAccountType: z.string().min(1, "El tipo de cuenta bancaria es requerido"),
  receipt: z.instanceof(File).refine((file) => file.size <= 2 * 1024 * 1024, {
    message: "El archivo debe ser menor a 2MB",
  }),
  transactionDate: z.string().optional(),
  notes: z.string().optional(),
});

// Inferir el tipo de TypeScript del esquema Zod
type FormData = z.infer<typeof schema>;

export const StartUsdToWusdTransaction: React.FC = () => {
  const account = useActiveAccount();
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Añadir useEffect para establecer la wallet cuando el componente se carga o la cuenta cambia
  useEffect(() => {
    if (account?.address) {
      setFormData((prev) => ({
        ...prev,
        userWallet: account.address,
      }));
    }
  }, [account?.address]);

  const handleChange = (
    name: keyof FormData,
    value: string | number | File
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error específico cuando el usuario empieza a escribir
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const result = schema.safeParse(formData);

      if (!result.success) {
        const zodErrors = result.error.flatten().fieldErrors;
        const errorMessages: Partial<Record<keyof FormData, string>> = {};

        (Object.keys(zodErrors) as Array<keyof FormData>).forEach((key) => {
          errorMessages[key] = zodErrors[key]?.[0] || "";
        });

        setErrors(errorMessages);
        setIsSubmitting(false);
        return;
      }

      // Enviar transacción
      const response = await sendTransactionData(result.data);

      // Manejar posibles errores de respuesta de la API
      if (response.error) {
        showErrorAlert(response.error);
        setIsSubmitting(false);
        return;
      }

      showSuccessAlert("Transacción enviada con éxito");
      setFormData({ userWallet: account?.address || "" });
    } catch (error) {
      console.error("Error al enviar la transacción:", error);
      showErrorAlert("Error al enviar la transacción");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LayoutBars>
      <div className="p-4 bg-blue-100 rounded-md shadow-md max-w-screen-lg mt-5 mx-auto">
        <p className="text-lg font-semibold mb-2">Sube el recibo de pago</p>
        <p className="text-gray-700">
          Aquí podrás subir el recibo de pago de la transferencia bancaria que hiciste junto con la información de la transacción. Luego de que subas esta información, un administrador enviará a tu wallet los tokens que compraste.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Wallet del Usuario</label>
          <input
            value={formData.userWallet || ""}
            readOnly
            className="border p-2 rounded bg-gray-100"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">ID de la Transacción</label>
          <input
            value={formData.transactionId || ""}
            onChange={(e) => handleChange("transactionId", e.target.value)}
            placeholder="ID de la transacción emitido por el banco"
            className="border p-2 rounded"
            required
          />
          {errors.transactionId && (
            <p className="text-red-500 text-sm mt-1">{errors.transactionId}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Banco de Origen</label>
          <input
            value={formData.sourceBank || ""}
            onChange={(e) => handleChange("sourceBank", e.target.value)}
            placeholder="Banco de origen de la transacción"
            className="border p-2 rounded"
            required
          />
          {errors.sourceBank && (
            <p className="text-red-500 text-sm mt-1">{errors.sourceBank}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Banco de Destino</label>
          <input
            value={formData.destinationBank || ""}
            onChange={(e) => handleChange("destinationBank", e.target.value)}
            placeholder="Banco de destino de la transacción"
            className="border p-2 rounded"
            required
          />
          {errors.destinationBank && (
            <p className="text-red-500 text-sm mt-1">
              {errors.destinationBank}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Monto en USD</label>
          <input
            type="number"
            value={formData.usdAmount || ""}
            onChange={(e) => handleChange("usdAmount", Number(e.target.value))}
            placeholder="Monto transferido en USD"
            className="border p-2 rounded"
            required
          />
          {errors.usdAmount && (
            <p className="text-red-500 text-sm mt-1">{errors.usdAmount}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">
            Número de Cuenta Bancaria
          </label>
          <input
            value={formData.userBankAccountNumber || ""}
            onChange={(e) =>
              handleChange("userBankAccountNumber", e.target.value)
            }
            placeholder="Tu número de cuenta bancaria"
            className="border p-2 rounded"
            required
          />
          {errors.userBankAccountNumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.userBankAccountNumber}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Tipo de Cuenta Bancaria</label>
          <select
            value={formData.userBankAccountType || ""}
            onChange={(e) =>
              handleChange("userBankAccountType", e.target.value)
            }
            className="border p-2 rounded"
            required
          >
            <option value="">Selecciona el tipo de cuenta</option>
            <option value="checking">Corriente</option>
            <option value="savings">Ahorros</option>
          </select>
          {errors.userBankAccountType && (
            <p className="text-red-500 text-sm mt-1">
              {errors.userBankAccountType}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Recibo</label>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleChange("receipt", file);
              }
            }}
            className="border p-2 rounded"
            required
          />
          {errors.receipt && (
            <p className="text-red-500 text-sm mt-1">{errors.receipt}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Fecha de la Transacción</label>
          <input
            type="date"
            value={formData.transactionDate || ""}
            onChange={(e) => handleChange("transactionDate", e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Notas (Opcional)</label>
          <textarea
            value={formData.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Notas adicionales"
            className="border p-2 rounded"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-c-primaryColor text-white p-2 rounded hover:bg-c-secondaryColor transition-colors 
        disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Enviando..." : "Enviar Transacción"}
        </button>
      </form>
    </LayoutBars>
  );
};
