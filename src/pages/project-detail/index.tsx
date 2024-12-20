import React, { useState, useEffect } from "react";
import TextDisplayGeneral from "@/components/TextDisplayGeneral/TextDisplayGeneral";
import CharacteristicsProjectDetail from "@/features/characteristicsProjectDetail";
import { getProjectById } from "@/controllers/projects.controller";
import { useParams } from "react-router-dom";
import { useProjectDetailsStore } from "@/stores/projectDetailStore/projectDetailStore";
import ProjectDetailsCard from "@/features/characteristicsProjectDetail/ProjectDetailCard";
import LayoutBars from "@/components/LayoutBars";
import Alert from "@/components/alert/Alert";

interface ProjectDetailProps {
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}
const ProjectDetail: React.FC<ProjectDetailProps> = (setIsProcessing) => {
  const { projectId } = useParams<{ projectId: any }>();
  const [project, setProject] = useState<any>(null); // Use 'any' or define a proper type
  const [loading, setLoading] = useState(true); // Loading state

  const setProjectDetails = useProjectDetailsStore(
    (state) => state.setProjectDetailsInZustand
  );

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const projectData = await getProjectById(projectId);
        setProject(projectData);
        setProjectDetails(projectData);
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

  // Example usage with fetched data
  const exampleData = {
    category: project?.categoria,
    projectName: project?.nombreProyecto,
    owner: project?.nombreDueno,
    shortDescription: project?.descripcionCorta,
    projectId: project?.id,
    priceForEachToken: project?.costoToken,
    mainImage: project?.imagenPrincipal,
    images: project?.imagenes,
    supplyTotal: project?.supplyTotal,
    valorTotal: project?.valorTotal,
    projectTrexToken: project?.token_address,
    tokenSymbol: project?.token_symbol
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
            <>
              <div className="flex justify-center items-center">
                <ProjectDetailsCard {...exampleData} />
              </div>
              <Alert
                message="Lee todos los documentos relacionados con este proyecto antes de comprar."
                type="info"
              />
              <TextDisplayGeneral
                title="Descripción"
                content={project?.descripcionCompleta || "..."}
              />
              <CharacteristicsProjectDetail
                projectTrexToken={project?.token_address}
                projectName={project?.nombreProyecto}
                symbol={project?.token_symbol}
                setIsProcessing={setIsProcessing}
              />
            </>
          </div>
        </section>
      )}
    </LayoutBars>
  );
};

export default ProjectDetail;
