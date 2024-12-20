import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { getAllHomeTests } from "@/controllers/projects.controller";
import LayoutBars from "@/components/LayoutBars";

export default function Inicio() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllHomeTests();
        setProjects(Array.isArray(data) ? data : []);
        console.log("Fetched projects:", data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleViewMore = (projectId) => {
    navigate(`/project-detail/${projectId}`);
  };

  return (
    <LayoutBars>
      <main className="flex flex-col items-center justify-center overflow-hidden bg-gray-50 border-t border-gray-200">
        <div className="h-auto 2xl:w-3/4 xl:w-full max-w-screen-2xl pt-8">
          {loading ? (
            <div className="flex justify-center items-center h-80">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
            </div>
          ) : (<>{projects.length > 0 ? (
            projects.map((item) => (
              <Card
                key={item?.id + Math.random()}
                className="overflow-hidden mb-4 mx-auto"
              >
                <CardContent className="p-4 lg:relative">
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/3 p-2">
                      <img
                        alt={item?.nombreProyecto}
                        className="w-full h-80 rounded-xl"
                        src={item?.imagenPrincipal}
                        style={{
                          aspectRatio: "1/1",
                          objectFit: "cover",
                          backgroundColor: "transparent",
                        }}
                      />
                    </div>
                    <div className="p-4 lg:w-3/4">
                      <div className="inline-block px-3 py-1 bg-blue-100 text-c-primaryColor text-sm font-medium rounded mb-2">
                        {item?.categoria}
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        {item?.nombreProyecto}
                      </h3>
                      <p className="text-xs font-regular text-gray-600 mb-4 leading-relaxed">
                        {item?.descripcionCorta}
                      </p>
                      <div className="flex justify-between items-end">
                        <div className="space-y-2">
                          <div className="text-base text-c-primaryColor font-semibold">
                            Desde {item?.costoToken} USDT
                          </div>
                          <div className="text-base text-gray-600">
                            <span className="font-bold text-black">Valor total </span>
                            {item?.valorTotal} USDT
                          </div>
                          <div className="text-base font-bold text-black">
                            APY: {item?.apy}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="lg:absolute bottom-4 right-4">
                    <Button
                      className="px-12 py-3 bg-c-primaryColor  text-white rounded-lg hover:bg-c-secondaryColor transition-colors"
                      onClick={() => handleViewMore(item?.id)}
                    >
                      Ver más
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No projects available.</p>
          )}
            <div className="flex justify-center">
              <Button className="px-12 py-3 mt-10 bg-c-primaryColor  text-white rounded hover:bg-c-secondaryColor transition-colors">
                Ver todos
              </Button>
            </div>
          </>)}
        </div>
      </main>
    </LayoutBars>
  );
}
