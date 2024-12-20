import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  approveProjectAndSendItToBlockchain,
  updateProjectStatus,
} from "@/controllers/projects.controller";
import {
  showErrorAlert,
  showSuccessAlert,
} from "@/utils/notificationsListWithReactToastify/notifications";
import { useNavigate } from "react-router-dom";
import { redirectToPath } from "@/lib/changePath";
import DOMPurify from 'dompurify';
import { useActiveAccount } from "thirdweb/react";
import LoadingOverlay from "./Loading/LoadingOverlay";
import { toast } from "react-toastify";

export const ApproveProjectDetail = ({
  project,
  toggleSelectedProject,
}: {
  project: any;
  toggleSelectedProject: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const address = useActiveAccount();

  const handleApprove = async () => {
    setLoading(true);

    const userWallet = address?.address as string;

    const approveProjectAndCreateItInBlockchainResponse =
      await approveProjectAndSendItToBlockchain({
        projectId: project.id,
        usersWalletAddress: userWallet,
      });

      //Llamado a addAgent

    if (
      approveProjectAndCreateItInBlockchainResponse?.success === true &&
      approveProjectAndCreateItInBlockchainResponse?.message ===
      "Token Creado Exitosamente"
    ) {
      toast.success("Proyecto aprobado exitosamente.");
      setLoading(false);
      toggleSelectedProject();
      redirectToPath(navigate, "/aprobarProyecto");
    } else {
      toast.error("La aprobación del estado del proyecto falló.");
    }
  };
  const handleReject = async () => {

    const updateProjectStatusResponse = await updateProjectStatus(project.id, "REJECTED");
    console.log(updateProjectStatusResponse);
    if (
      updateProjectStatusResponse?.message ===
      "Estado del proyecto actualizado exitosamente"
    ) {
      toast.success("Proyecto rechazado exitosamente.");
      setLoading(false);
      toggleSelectedProject();
      redirectToPath(navigate, "/aprobarProyecro");
    } else {
      toast.error("El rechazo del estado del proyecto falló.");
    }
  }

  const sanitizedHTML = DOMPurify.sanitize(project.investment_structure);
  return (
    <div className="space-y-6 overflow-hidden">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Detalles del Proyecto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            <strong>Nombre:</strong> {project.name}
          </p>
          <p>
            <strong>Descripción:</strong> {project.description}
          </p>
          <p>
            <strong>Emisor:</strong> {project.transmitter}
          </p>
          <p>
            <strong>País:</strong> {project.country}
          </p>
          <p>
            <strong>Ubicación:</strong> {project.location}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Información del Token
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            <strong>Tipo de Activo:</strong> {project.asset_type}
          </p>
          <p>
            <strong>Subclase de Activo:</strong> {project.asset_subclass}
          </p>
          {/* <p>
              <strong>Nombre del Token:</strong> {project.token_name}
            </p> */}
          <p>
            <strong>Símbolo del Token:</strong> {project.token_symbol}
          </p>
          <p>
            <strong>Plataforma:</strong> {project.platform}
          </p>
          <p>
            <strong>Blockchain:</strong> {project.blockchain}
          </p>
          <p>
            <strong>Derechos del Token:</strong> {project.token_rights}
          </p>
          <p>
            <strong>Estructura de Inversión:</strong>{" "}
            <span dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
          </p>
        </CardContent>
      </Card>

      {project.ods && project.ods !== "undefined" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Objetivos de Desarrollo Sostenible (ODS)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Objetivo 1:</strong> {project.ods.objetivo1}
            </p>
            <p>
              <strong>Objetivo 2:</strong> {project.ods.objetivo2}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {project.additional_questions &&
        project.additional_questions !== "undefined" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Preguntas Adicionales
            </CardTitle>
          </CardHeader>
          <CardContent>
            {JSON.parse(project.additional_questions)?.map(
              (
                question: { pregunta: string; descripcion: string },
                index: number
              ) => (
                <div key={index}>
                  <p>
                    <strong>Pregunta:</strong> {question.pregunta}
                  </p>
                  <p>
                    <strong>Descripción:</strong> {question.descripcion}
                  </p>
                </div>
              )
            )}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Detalles del Proyecto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            <strong>Razones para Invertir:</strong>{" "}
            {project.details[0].reasons_invest}
          </p>
          <p>
            <strong>Problema que Resuelve:</strong>{" "}
            {project.details[0].problem_that_solves}
          </p>
          <p>
            <strong>Impacto:</strong> {project.details[0].impact}
          </p>
          <p>
            <strong>Diferenciación:</strong>{" "}
            {project.details[0].differentiation}
          </p>
          <p>
            <strong>Resumen de Proyecciones:</strong>{" "}
            {project.details[0].projections_summary}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Datos Financieros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Límite Máximo</TableHead>
                <TableHead>Límite Suave</TableHead>
                <TableHead>Pre-Venta</TableHead>
                <TableHead>Venta Pública</TableHead>
                <TableHead>Min. Inversión</TableHead>
                <TableHead>Max. Inversión</TableHead>
                <TableHead>Precio de Lanzamiento</TableHead>
                <TableHead>TIR Bruta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {project.financials?.map((financial: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    {financial.max_limit.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}
                  </TableCell>
                  <TableCell>
                    {financial.soft_limit.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}
                  </TableCell>
                  <TableCell>
                    {financial.assigned_presale.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}
                  </TableCell>
                  <TableCell>
                    {financial.assigned_public_sale.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}
                  </TableCell>
                  <TableCell>
                    {financial.min_investment.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}
                  </TableCell>
                  <TableCell>
                    {financial.max_investment.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}
                  </TableCell>
                  <TableCell>
                    {financial.launch_price.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}
                  </TableCell>
                  <TableCell>
                    {(financial.gross_tir * 100).toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Fechas Claves</CardTitle>
        </CardHeader>
        <CardContent>
          {project.dates?.map((date: any, index: number) => (
            <div key={index} className="space-y-2">
              <p>
                <strong>Pre-Lanzamiento:</strong>{" "}
                {new Date(date.pre_launch).toLocaleDateString()}
              </p>
              <p>
                <strong>Lanzamiento:</strong>{" "}
                {new Date(date.launch).toLocaleDateString()}
              </p>
              <p>
                <strong>Reclamo del Token:</strong>{" "}
                {new Date(date.token_claim_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Finalizado:</strong>{" "}
                {new Date(date.finalized).toLocaleDateString()}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Redes Sociales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {project.socialMedia?.map((social: any, index: number) => (
              <li key={index}>
                <p>
                  <strong>Facebook:</strong>{" "}
                  <a
                    href={social.social_media_facebook}
                    target="_blank"
                    className="text-c-primaryColor hover:underline"
                  >
                    {social.social_media_facebook}
                  </a>
                </p>
                <p>
                  <strong>Twitter:</strong>{" "}
                  <a
                    href={social.social_media_twitter}
                    target="_blank"
                    className="text-c-primaryColor hover:underline"
                  >
                    {social.social_media_twitter}
                  </a>
                </p>
                <p>
                  <strong>LinkedIn:</strong>{" "}
                  <a
                    href={social.social_media_linkedin}
                    target="_blank"
                    className="text-c-primaryColor hover:underline"
                  >
                    {social.social_media_linkedin}
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Imágenes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {project.images?.map((img: { title: string; description: string; image_url: string }, index: number) => (
              <li key={index}>
                <p>
                  <strong>Imagen {index + 1}:</strong>{" "}
                  <span className="font-semibold">{img.title}</span>
                </p>
                <p className="text-gray-600">{img.description}</p>
                <a
                  href={img.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-c-primaryColor hover:underline"
                >
                  <img
                    src={img.image_url}
                    alt={img.title || `Imagen ${index + 1}`}
                    className="w-full h-auto rounded-md cursor-pointer mt-2"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(img.image_url, "_blank");
                    }}
                  />
                </a>
              </li>
            ))}
          </ul>

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {project.documents?.map((doc: { title: string; description: string; document_url: string }, index: number) => (
              <li key={index}>
                <p>
                  <strong>Documento {index + 1}:</strong>{" "}
                  <span className="font-semibold">{doc.title}</span>
                </p>
                <p className="text-gray-600">{doc.description}</p>
                <a
                  href={doc.document_url}
                  target="_blank"
                  className="text-c-primaryColor hover:underline"
                >
                  Ver documento
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <div className="flex space-x-4">
        <Button
          onClick={handleReject}
          disabled={loading}
          className={`w-full bg-red-500 text-white font-semibold py-2 rounded-md transition-colors duration-200 
              ${loading ? "cursor-not-allowed opacity-50" : "hover:bg-red-600"}`}
        >
          {"Rechazar Proyecto"}
        </Button>
        <Button
          onClick={handleApprove}
          disabled={loading}
          className={`w-full bg-green-500 text-white font-semibold py-2 rounded-md transition-colors duration-200 
                ${loading
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-green-600"
            }`}
        >
          {"Aprobar Proyecto"}
        </Button>

      </div>
      <LoadingOverlay isLoading={loading} />
    </div>
  );
};
