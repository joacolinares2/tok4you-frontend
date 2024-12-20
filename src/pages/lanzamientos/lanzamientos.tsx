import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { getAllApprovedProjects } from "@/controllers/projects.controller";
import LayoutBars from "@/components/LayoutBars";

const Lanzamientos: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllApprovedProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleViewMore = (projectId: string) => {
    navigate(`/project-details/${projectId}`);
  };

  return (
    <LayoutBars>
      <main className="flex flex-col items-center justify-center overflow-hidden bg-gray-50 border-t border-gray-200">
        <div className="h-auto 2xl:w-3/4 xl:w-full max-w-screen-2xl w-[100dvw] pt-8">
          {loading ? (
            <div className="flex justify-center items-center h-80">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
            </div>
          ) : projects.length > 0 ? (
            projects?.map((item) => (
              <Card key={item.id} className="overflow-hidden mb-4 mx-auto">
                <CardContent className="p-4 lg:relative">
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/3 p-2">
                      <img
                        alt={item.name}
                        className="w-full h-80 rounded-xl"
                        src={item.images[0]?.image_url}
                        style={{
                          aspectRatio: "1/1",
                          objectFit: "cover",
                          backgroundColor: "transparent",
                        }}
                      />
                    </div>
                    <div className="p-4 lg:w-3/4">
                      <div className="inline-block px-3 py-1 bg-blue-100 text-c-primaryColor text-sm font-medium rounded mb-2">
                        {item.asset_type}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                      <p className="text-xs font-regular text-gray-600 mb-4 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-end">
                        <div className="space-y-2">
                          <div className="text-base text-c-primaryColor font-semibold">
                            Desde {item.financials[0]?.launch_price} USDT
                          </div>
                          <div className="text-base text-gray-600">
                            <span className="font-bold text-black">
                              Valor total{" "}
                            </span>
                            ${item.financials[0]?.assigned_public_sale} USDT
                          </div>
                          <div className="text-base font-bold text-black">
                            APY: {item.financials[0]?.dividend_yield}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="lg:absolute bottom-4 right-4">
                    <Button
                      className="px-12 py-3 bg-c-primaryColor  text-white rounded-lg hover:bg-c-secondaryColor transition-colors"
                      onClick={() => handleViewMore(item.id.toString())}
                    >
                      Ver más
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <h2 className="text-center text-xl font-bold">
              No hay proyectos disponibles.
            </h2>
          )}
        </div>
        <div>
            <div className="flex justify-center">
            <Button className="px-12 py-3 mt-10 bg-c-primaryColor  text-white rounded hover:bg-c-secondaryColor transition-colors">
              Ver todos
            </Button>
          </div> 
        </div>
      </main>
    </LayoutBars>
  );
};

export default Lanzamientos;
