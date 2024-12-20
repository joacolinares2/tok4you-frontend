import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderIcon } from "lucide-react";
import { ApproveProjectDetail } from "@/components/ApproveProjectDetail";
import { getAllPendingProjects } from "@/controllers/projects.controller";
import {X} from "lucide-react";

const ApproveProjectList: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllPendingProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
  };

  const toggleSelectedProject = () => {
    setSelectedProject(null);
  };

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold w-full text-center">
        Proyectos para aprobar
      </h1>

      {projects.length === 0 ? (
        <h2 className="text-green-500 w-full text-center my-20">
          {" "}
          No hay proyectos esperando aprobación.
        </h2>
      ) : null}

      <div className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.map((project, index) => (
          <Card
            key={index}
            onClick={() => handleProjectClick(project)}
            className="cursor-pointer"
          >
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FolderIcon className="w-6 h-6 text-c-primaryColor" />
                <CardTitle className="text-lg font-medium">
                  {project.name}
                </CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                {project.walletOfCurrentOwner}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
              <Button variant="outline" size="sm" className="mt-4">
                Ver detalles
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedProject && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50" onClick={toggleSelectedProject}>
          <div className="bg-white rounded-lg w-[900px] max-h-[90vh] overflow-x-hidden overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex sticky top-0 justify-between items-center p-4 bg-gray-100 rounded-t-lg">
              <h2 className="text-lg font-semibold">{selectedProject.name}</h2>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={toggleSelectedProject}
              >
                <X size={24} />
              </button>

            </div>

            <div className="p-4">
              <ApproveProjectDetail
                project={selectedProject}
                toggleSelectedProject={toggleSelectedProject}
              />
            </div>
          </div>
        </div>
      )
      }
    </div >
  );
};

export default ApproveProjectList;

/* import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderIcon, X } from "lucide-react";
import { ApproveProjectDetail } from '@/components/ApproveProjectDetail';

const projects = [{
        walletOfCurrentOwner: "0x0000000000000000000000000000000000000000",
        name: "Apartamento Sustentable en Medellín",
        description: "Proyecto de apartamentos ecológicos en Valencia",
        transmitter: "EcoTransmisor",
        country: "Colombia",
        location: "Dirección en medellín ### ",
        asset_type: "Inmobiliario",
        asset_subclass: "Residencial",
        token_name: "ASEM",
        token_symbol: "ASEM",
        platform: "Tokenus",
        blockchain: "Polygon",
        token_rights: "Derechos de Propiedad",
        investment_structure: "Estructura de Capital",
        target_market: "Mercado latinoamericano",
        business_model: "Modelo de Alquiler",
        website: "http://www.ecoapartamentosmedellín.com",
        email: "contacto@ecoapartamentosmedellín.com",
        ods: {
          objetivo1: "Promover la energía limpia",
          objetivo2: "Fomentar la construcción sostenible"
        },
        additional_questions: [
          {
            pregunta1: "¿Cómo se garantiza la sostenibilidad?",
            Respuesta: "A través del uso de materiales sostenibles y reciclables."
          }
        ],
        details: [
          {
            reasons_invest: "Alta demanda de viviendas sostenibles",
            problem_that_solves: "Escasez de viviendas ecológicas y sostenibles",
            impact: "Reducción de la huella de carbono",
            differentiation: "Uso de materiales reciclados",
            projections_summary: "Se estima un retorno del 7.6% anual"
          }
        ],
        financials: [
          {
            max_limit: 2000000,
            soft_limit: 1000000,
            assigned_presale: 500000,
            assigned_public_sale: 700000,
            min_investment: 2000,
            max_investment: 100000,
            launch_price: 2.0,
            prelaunch_price: 1.8,
            dividend_yield: 0.06,
            gross_tir: 0.12,
            investment_period: "24 meses",
            distribution_frequency: "anual",
            investors_accepted: {
              tipo1: "Inversores institucionales",
              tipo2: "Inversores minoristas"
            }
          }
        ],
        dates: [
          {
            pre_launch: "2024-05-01T00:00:00Z",
            launch: "2024-06-01T00:00:00Z",
            token_claim_date: "2024-07-01T00:00:00Z",
            finalized: "2024-08-01T00:00:00Z"
          }
        ],
        socialMedia: [
          {
            social_media_facebook: "https://www.facebook.com/ecoapartamentosvalencia",
            social_media_twitter: "https://twitter.com/ecoapartvalencia",
            social_media_linkedin: "https://www.linkedin.com/company/ecoapartamentosvalencia"
          }
        ],
        images: [
          {
            image_url: "https://www.ecoapartamentosvalencia.com/imagen1.jpg"
          },
          {
            image_url: "https://www.ecoapartamentosvalencia.com/imagen2.jpg"
          }
        ],
        documents: [
          {
            document_url: "https://www.ecoapartamentosvalencia.com/documento1.pdf"
          },
          {
            document_url: "https://www.ecoapartamentosvalencia.com/documento2.pdf"
          }
        ]
      },
];

const ApproveProjectList: React.FC = () => {
    const [selectedProject, setSelectedProject] = useState<any>(null);

    const handleProjectClick = (project: any) => {
        setSelectedProject(project);
    };

    const toggleSelectedProject = () => {
        setSelectedProject(null);
    }


    return (
        <div className="p-10 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold">Listado de Proyectos</h1>

            <div className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project, index) => (
                    <Card key={index} onClick={() => handleProjectClick(project)} className="cursor-pointer">
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <FolderIcon className="w-6 h-6 text-c-primaryColor" />
                                <CardTitle className="text-lg font-medium">{project.name}</CardTitle>
                            </div>
                            <p className="text-sm text-muted-foreground">{project.walletOfCurrentOwner}</p>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{project.description}</p>
                            <Button variant="outline" size="sm" className="mt-4">
                                Ver detalles
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {selectedProject && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg w-[900px] max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-4 bg-gray-100 rounded-t-lg">
                            <h2 className="text-lg font-semibold">{selectedProject.name}</h2>
                            <button
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                onClick={() => setSelectedProject(null)}
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-4">
                            <ApproveProjectDetail project={selectedProject} toggleSelectedProject={toggleSelectedProject}/>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ApproveProjectList;
 */
