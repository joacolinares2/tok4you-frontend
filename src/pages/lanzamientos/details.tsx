import React, { useState, useEffect } from "react";
import TextDisplayGeneral from "@/components/TextDisplayGeneral/TextDisplayGeneral";
import CharacteristicsProjectDetail from "@/features/characteristicsProjectDetail";
import { getApprovedProjectById } from "@/controllers/projects.controller";
import { useParams } from "react-router-dom";
import { useProjectDetailsStore } from "@/stores/projectDetailStore/projectDetailStore";
import ProjectDetailsCard from "@/features/characteristicsProjectDetail/ProjectDetailCard";
import LayoutBars from "@/components/LayoutBars";
import Alert from "@/components/alert/Alert";
import { set } from "react-hook-form";


interface ProjectDetailProps {
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ setIsProcessing }) => {
  const { projectId } = useParams<{ projectId: any }>();
  const [project, setProject] = useState<any>(false); // Use 'any' or define a proper type
  const [loading, setLoading] = useState(true); // Loading state

  //console.log(setIsProcessing)

  const setProjectDetails = useProjectDetailsStore(
    (state) => state.setProjectDetailsInZustand
  );
  const caracteristicasGenerales = [
    {
      createdAt: "2024-10-02T22:36:13.615Z",
      homeTestId: 1,
      id: 2,
      nombre: "Ubicación",
      texto: "",
      updatedAt: "2024-10-02T22:36:13.615Z",
    },
  ];
  const caracteristicasFinanzas = {
    createdAt: "2024-10-02T22:36:13.615Z",
    homeTestId: 1,
    id: 1,
    nombre: "",
    red: "",
    simbolo: "",
    supply: 0,
    updatedAt: "2024-10-02T22:36:13.615Z",
    ventaAnticipada: "",
    ventaPublica: "",
  };
  const caracteristicasDocumentos = [
    {
      createdAt: "2024-10-02T22:36:13.615Z",
      homeTestId: 1,
      id: 3,
      title: "Documento",
      link: "",
      updatedAt: "2024-10-02T22:36:13.615Z",
    },
    {
      createdAt: "2024-10-02T22:36:13.615Z",
      homeTestId: 1,
      id: 4,
      title: "Documento",
      link: "",
      updatedAt: "2024-10-02T22:36:13.615Z",
    },
  ];

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const projectData = await getApprovedProjectById(projectId);
        setProject(projectData);
        caracteristicasGenerales[0].texto = projectData?.location;
        const projectHardcoded: {
          caracteristicasGenerales: typeof caracteristicasGenerales;
          caracteristicasFinanzas: typeof caracteristicasFinanzas;
          caracteristicasDocumentos: typeof caracteristicasDocumentos;
        } = {
          caracteristicasGenerales: [],
          caracteristicasFinanzas: caracteristicasFinanzas,
          caracteristicasDocumentos: [],
        };
        projectHardcoded.caracteristicasGenerales = caracteristicasGenerales;
        projectHardcoded.caracteristicasFinanzas.nombre =
          projectData?.token_name || "";
        projectHardcoded.caracteristicasFinanzas.red =
          projectData?.blockchain || "";
        projectHardcoded.caracteristicasFinanzas.simbolo =
          projectData?.token_symbol || "";
        projectHardcoded.caracteristicasFinanzas.supply =
          projectData?.financials[0].assigned_public_sale || 0;
        projectHardcoded.caracteristicasFinanzas.ventaAnticipada =
          projectData?.dates[0].pre_launch || "";
        projectHardcoded.caracteristicasFinanzas.ventaPublica =
          projectData?.dates[0].launch || "";
        caracteristicasDocumentos[0].link =
          projectData?.documents?.[0]?.document_url;
        caracteristicasDocumentos[1].link =
          projectData?.documents?.[1]?.document_url;
        projectHardcoded.caracteristicasFinanzas = caracteristicasFinanzas;
        projectHardcoded.caracteristicasDocumentos = caracteristicasDocumentos;
        setProjectDetails(projectHardcoded);
        console.log("Fetched project:", projectData);
      } catch (error) {
        console.error("Error fetching project by ID:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const images = project?.images?.map((img: any) => img.image_url) || [];

  console.log(project?.name);
  const exampleData = {
    category: project?.asset_type,
    projectName: project?.name,
    owner: "Juan Perez",
    shortDescription: project?.description,
    projectId: project?.id,
    priceForEachToken: project?.financials?.[0]?.launch_price || 0,
    mainImage: project?.images?.[0]?.image_url,
    images: images,
    supplyTotal: 20000,
    valorTotal: 1000,
    projectTrexToken: project?.token_address,
    tokenSymbol: project?.token_symbol,
    financials: project?.financials,
    dates: project?.dates,
  };

  return (
    <LayoutBars>
      {loading ? (
        <div className="flex justify-center items-center h-80">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
        </div>
      ) : (
        <section className="w-full flex justify-center my-4">
          <div className="w-full max-w-[1800px] flex-col flex gap-10 bg-white rounded-xl p-4">
            <div>
              <div className="flex justify-center items-center">
                <ProjectDetailsCard {...exampleData} />
              </div>
              <Alert
                message="Lee todos los documentos relacionados con este proyecto antes de comprar."
                type="info"
              />
              <TextDisplayGeneral
                title="Descripción"
                content={project?.description || "..."}
              />

              <CharacteristicsProjectDetail
                projectTrexToken={exampleData.projectTrexToken}
                projectName={exampleData.projectName}
                symbol={exampleData.tokenSymbol}
                setIsProcessing={setIsProcessing}
              />
            </div>
          </div>
        </section>
      )}
    </LayoutBars>
  );
};

export default ProjectDetail;