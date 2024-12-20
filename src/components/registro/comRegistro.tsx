import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PhoneInput from "react-phone-input-2";
import ReactFlagsSelect from "react-flags-select";
import "react-phone-input-2/lib/style.css";
import { useActiveAccount } from "thirdweb/react"; // 🚀 New Import
import { createUser } from "../../controllers/registerUser.controller";
import {
  showErrorAlert,
  showSuccessAlert,
} from "@/utils/notificationsListWithReactToastify/notifications";
import LoadingOverlay from "../Loading/LoadingOverlay";
import { getVerificationProcessData } from "@/controllers/verification.controller";
import { useNavigate } from "react-router-dom";
import { redirectToPath } from "@/lib/changePath";
import axios from "axios";
import { toast } from "react-toastify";

// Definir esquema de validación con Zod
const registroSchema = z.object({
  nombres: z.object({
    nombre1: z
      .string()
      .min(1, "El primer nombre es requerido")
      .max(50, "Too long")
      .trim(),
    nombre2: z.string().max(50, "Too long").trim().optional(),
  }),
  apellidos: z.object({
    apellido1: z
      .string()
      .max(50, "Too long")
      .min(1, "El primer apellido es requerido")
      .trim(),
    apellido2: z.string().max(50, "Too long").trim().optional(),
  }),
  documento: z.object({
    tipo: z
      .string()
      .max(50, "Too long")
      .min(1, "El tipo de documento es requerido")
      .trim(),
    numero: z
      .string()
      .max(50, "Too long")
      .min(1, "El número de documento es requerido")
      .trim(),
  }),
  fechaNacimiento: z.object({
    dia: z
      .string()
      .min(1, "El día es requerido")
      .refine((val) => parseInt(val) >= 1 && parseInt(val) <= 31, {
        message: "El día debe ser entre 1 y 31",
      }),
    mes: z
      .string()
      .min(1, "El mes es requerido")
      .refine((val) => parseInt(val) >= 1 && parseInt(val) <= 12, {
        message: "El mes debe ser entre 1 y 12",
      }),
    año: z
      .string()
      .min(4, "El año debe tener 4 dígitos")
      .max(4, "El año debe tener 4 dígitos")
      .refine((val) => parseInt(val) > 1900, {
        message: "El año debe ser mayor a 1900",
      }),
  }),
  telefono: z
    .string()
    .max(50, "Too long")
    .min(1, "El teléfono es requerido")
    .trim(),
  direccion: z
    .string()
    .max(200, "Too long")
    .min(1, "La dirección es requerida")
    .trim(),
  email: z.string().email("Correo electrónico inválido").trim(),
  pais: z
    .string()
    .max(50, "Too long")
    .min(2, "El país es requerido")
    .max(2, "El código de país debe tener 2 caracteres"),
  terminos: z
    .boolean()
    .refine((val) => val === true, "Debes aceptar los términos y condiciones"),
});

type RegistroData = z.infer<typeof registroSchema>;

const RegisterComponent: React.FC = () => {
  const currentWalletAddress = useActiveAccount();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registroSchema),
  });

  useEffect(() => {
    const fetchCountryByIP = async () => {
      try {
        const response = await axios.get("https://ipapi.co/json/");
        const countryCode = response.data.country_code;
        setSelectedCountry(countryCode);
        setValue("pais", countryCode);
        console.log("Country set:", countryCode);
      } catch (error) {
        console.error("Error fetching country:", error);
      }
    };

    fetchCountryByIP();
  }, [setValue]); // Add setValue to the dependency array

  useEffect(() => {
    const cachedVerificationProcessData = localStorage.getItem(
      "verification-process-data"
    );

    if (cachedVerificationProcessData) {
      const verificationProcessData = JSON.parse(cachedVerificationProcessData);

      if (verificationProcessData.register) {
        redirectToPath(navigate, "/KYC");
      }
    }
  }, [navigate]);

  const onFormSubmit = async (data: RegistroData) => {
    setIsLoading(true);

    const { dia, mes, año } = data.fechaNacimiento;
    const fechaNacimientoString = `${año}-${mes}-${dia}`;
    const fechaNacimiento = new Date(fechaNacimientoString);

    const today = new Date();
    let age = today.getFullYear() - fechaNacimiento.getFullYear();
    const monthDifference = today.getMonth() - fechaNacimiento.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < fechaNacimiento.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      setIsLoading(false);
      showErrorAlert("Debes tener al menos 18 años para registrarte.");
      return;
    }

    const formattedData = {
      first_name: data.nombres.nombre1,
      second_name: data.nombres.nombre2 || "",
      first_last_name: data.apellidos.apellido1,
      second_last_name: data.apellidos.apellido2 || "",
      document_type: data.documento.tipo,
      document_number: data.documento.numero,
      birth_date: fechaNacimiento.toISOString(),
      mobile_phone: data.telefono,
      address: data.direccion,
      country: data.pais,
      email: data.email,
      tos: data.terminos,
      wallet: currentWalletAddress?.address || "",
    };

    console.log("Datos formateados para el backend:", formattedData);

    try {
      const response = await createUser(formattedData);
      console.log(response);

      if (response.message === "Usuario Creado Exitosamente") {
        console.log("Usuario creado exitosamente:", response);
        toast.success("Usuario creado exitosamente");

        const userData = {
          wallet: formattedData.wallet,
          email: formattedData.email,
          name: formattedData.first_name + " " + formattedData.first_last_name,
        };

        localStorage.setItem("userData", JSON.stringify(userData));
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.error(
          "Error devuelto por el backend:",
          error.response.data.message
        );
        toast.error("Hubo un error al crear el usuario. Intenta nuevamente.");
      }
    } finally {
      const verificationProcessData = await getVerificationProcessData(
        currentWalletAddress?.address.toString() as string
      );
      localStorage.setItem(
        "verification-process-data",
        JSON.stringify(verificationProcessData)
      );

      setIsLoading(false);
      redirectToPath(navigate, "/KYC");
    }
  };

  const handleAcceptTerms = () => {
    setTermsAccepted(true);
    setValue("terminos", true);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex justify-center items-center flex-col">
        <h1 className="text-2xl font-bold text-center text-gray-800 my-6">
          Registro
        </h1>
        <h3 className="text-sm font-bold w-4/5 text-center text-gray-500">
          Debes completar el registro, KYC y firma de términos de servicio para
          poder invertir. Este es el primer paso. Proporciona los siguientes
          datos para completar tu registro.
        </h3>
      </div>

      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="p-6 max-w-4xl mx-auto space-y-6"
      >
        {/* Nombres y Apellidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Primer Nombre *
            </label>
            <input
              type="text"
              placeholder="Primer nombre"
              {...register("nombres.nombre1")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.nombres?.nombre1 && (
              <p className="text-red-500 text-sm">
                {errors.nombres.nombre1.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Segundo Nombre
            </label>
            <input
              type="text"
              placeholder="Segundo nombre"
              {...register("nombres.nombre2")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Primer Apellido *
            </label>
            <input
              type="text"
              placeholder="Primer apellido"
              {...register("apellidos.apellido1")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.apellidos?.apellido1 && (
              <p className="text-red-500 text-sm">
                {errors.apellidos.apellido1.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Segundo Apellido
            </label>
            <input
              type="text"
              placeholder="Segundo apellido"
              {...register("apellidos.apellido2")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Documento de Identidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Documento de Identidad
            </label>
            <select
              {...register("documento.tipo")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Seleccione tipo de documento</option>
              <option value="DNI">DNI</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="Licencia de conducir">
                Licencia de conducción
              </option>
            </select>
            {errors.documento?.tipo && (
              <p className="text-red-500 text-sm">
                {errors.documento.tipo.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número de Documento
            </label>
            <input
              type="text"
              placeholder="Número de documento"
              {...register("documento.numero")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.documento?.numero && (
              <p className="text-red-500 text-sm">
                {errors.documento.numero.message}
              </p>
            )}
          </div>
        </div>

        {/* Fecha de Nacimiento */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de Nacimiento
          </label>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Día *
              </label>
              <input
                maxLength={2}
                type="text"
                placeholder="Día"
                {...register("fechaNacimiento.dia")}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.fechaNacimiento?.dia && (
                <p className="text-red-500 text-sm">
                  {errors.fechaNacimiento.dia.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mes *
              </label>
              <input
                maxLength={2}
                type="text"
                placeholder="Mes"
                {...register("fechaNacimiento.mes")}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.fechaNacimiento?.mes && (
                <p className="text-red-500 text-sm">
                  {errors.fechaNacimiento.mes.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Año *
              </label>
              <input
                maxLength={4}
                type="text"
                placeholder="Año"
                {...register("fechaNacimiento.año")}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.fechaNacimiento?.año && (
                <p className="text-red-500 text-sm">
                  {errors.fechaNacimiento.año.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-2">
          {/* Input de País */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              País *
            </label>
            <ReactFlagsSelect
              countries={[
                "AR",
                "BO",
                "BR",
                "CL",
                "CO",
                "CR",
                "CU",
                "DO",
                "EC",
                "SV",
                "GT",
                "HN",
                "MX",
                "NI",
                "PA",
                "PY",
                "PE",
                "PR",
                "UY",
                "VE",
              ]}
              selected={selectedCountry}
              onSelect={(code: string) => {
                setSelectedCountry(code);
                setValue("pais", code); // Update the form state when country is manually selected
              }}
              placeholder="Seleccione país"
            />
            {errors.pais && (
              <p className="text-red-500 text-sm">{errors.pais.message}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teléfono Celular
            </label>
            <PhoneInput
              country={selectedCountry.toLowerCase()}
              inputStyle={{
                width: "100%",
                borderRadius: "4px",
                border: "1px solid #ccc",
                height: "44px",
              }}
              onChange={(value) => setValue("telefono", value)}
            />
            {errors.telefono && (
              <p className="text-red-500 text-sm">{errors.telefono.message}</p>
            )}
          </div>
        </div>
        {/* Dirección */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Dirección
          </label>
          <input
            type="text"
            placeholder="Dirección"
            {...register("direccion")}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.direccion && (
            <p className="text-red-500 text-sm">{errors.direccion.message}</p>
          )}
        </div>

        {/* Correo Electrónico */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Correo Electrónico
          </label>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Términos y Condiciones */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={termsAccepted}
            onClick={(e) => {
              e.preventDefault();
              setIsModalOpen(true);
            }}
            className="h-4 w-4 text-c-primaryColor focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Acepto los{" "}
            <button
              type="button"
              
              onClick={() => setIsModalOpen(true)}
            >
              términos y condiciones
            </button>
          </label>
          {errors.terminos && (
            <p className="text-red-500 text-sm ml-4">
              {errors.terminos.message}
            </p>
          )}
        </div>

        {/* Botón de Envío */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-c-primaryColor  text-white py-2 px-4 rounded-md hover:bg-c-secondaryColor"
            disabled={!termsAccepted}
          >
            Registrarme
          </button>
        </div>
      </form>
      <LoadingOverlay isLoading={isLoading} />

      {/* Modal de Términos y Condiciones */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg w-[500px] max-h-[80vh] p-6 overflow-x-hidden overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Términos y Condiciones</h2>
            <div className="mb-4 max-h-[60vh] overflow-y-auto">
              <p>
                <strong>1. Introducción</strong>
                <br />
                Estos Términos y Condiciones rigen el uso de este sitio web; al usar este sitio web, aceptas estos términos y condiciones en su totalidad. Si no estás de acuerdo con estos términos y condiciones o cualquier parte de estos términos y condiciones, no debes usar este sitio web.
                <br /><br />
                <strong>2. Licencia para usar el sitio web</strong>
                <br />
                A menos que se indique lo contrario, nosotros o nuestros licenciantes poseemos los derechos de propiedad intelectual en el sitio web y el material en el sitio web. Sujeto a la licencia a continuación, todos estos derechos de propiedad intelectual están reservados.
                <br /><br />
                Puedes ver, descargar solo para fines de almacenamiento en caché, e imprimir páginas u otro contenido del sitio web para tu uso personal, sujeto a las restricciones establecidas a continuación y en otras partes de estos términos y condiciones.
                <br /><br />
                No debes:
                <ul className="list-disc list-inside">
                  <li>Republicar material de este sitio web (incluida la republicación en otro sitio web);</li>
                  <li>Vender, alquilar o sublicenciar material del sitio web;</li>
                  <li>Mostrar cualquier material del sitio web en público;</li>
                  <li>Reproducir, duplicar, copiar o explotar material en este sitio web con fines comerciales;</li>
                  <li>Editar o modificar cualquier material en el sitio web;</li>
                  <li>Redistribuir material de este sitio web.</li>
                </ul>
                <br />
                <strong>3. Uso aceptable</strong>
                <br />
                No debes usar este sitio web de ninguna manera que cause, o pueda causar, daño al sitio web o deterioro de la disponibilidad o accesibilidad del sitio web; o de cualquier manera que sea ilegal, fraudulenta o perjudicial, o en conexión con cualquier propósito o actividad ilegal, fraudulenta o perjudicial.
                <br /><br />
                No debes usar este sitio web para copiar, almacenar, alojar, transmitir, enviar, usar, publicar o distribuir cualquier material que consista en (o esté vinculado a) cualquier spyware, virus informático, troyano, gusano, registrador de pulsaciones de teclas, rootkit u otro software malicioso.
                <br /><br />
                <strong>4. Limitaciones de responsabilidad</strong>
                <br />
                No seremos responsables ante ti (ya sea bajo la ley de contacto, la ley de agravios o de otra manera) en relación con el contenido de, o el uso de, o de otra manera en conexión con, este sitio web:
                <ul className="list-disc list-inside">
                  <li>Por cualquier pérdida directa, indirecta o consecuente;</li>
                  <li>Por cualquier pérdida de ingresos, ingresos, ganancias o ahorros anticipados;</li>
                  <li>Por cualquier pérdida de contratos o relaciones comerciales;</li>
                  <li>Por cualquier pérdida de reputación o buena voluntad;</li>
                  <li>Por cualquier pérdida o corrupción de información o datos.</li>
                </ul>
                <br />
                <strong>5. Variación</strong>
                <br />
                Podemos revisar estos términos y condiciones de vez en cuando. Los términos y condiciones revisados se aplicarán al uso de este sitio web desde la fecha de la publicación de los términos y condiciones revisados en este sitio web. Por favor, revisa esta página regularmente para asegurarte de que estás familiarizado con la versión actual.
                <br /><br />
                <strong>6. Acuerdo completo</strong>
                <br />
                Estos términos y condiciones, junto con nuestra política de privacidad, constituyen el acuerdo completo entre tú y nosotros en relación con tu uso de este sitio web, y reemplazan todos los acuerdos anteriores con respecto a tu uso de este sitio web.
              </p>
              <div className="flex justify-center mt-4 space-x-52">
              <button
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Rechazar
              </button>
              <button
                className="bg-c-primaryColor  text-white py-2 px-4 rounded-md hover:bg-c-secondaryColor"
                onClick={handleAcceptTerms}
              >
                Aceptar
              </button>
            </div>
            </div>
            
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterComponent;
