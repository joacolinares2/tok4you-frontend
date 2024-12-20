import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const KPIS = [
    "ACTIVE_PROJECTS",
    "USERS_REGISTERED",
    "KYC_REJECTED",
    "KYC_CONVERSION",
    "AVAILABLE_TOKENUS",
    "USERS_FOR_COUNTRY",
    "TOTAL_TOKENUS",
];

const ExportCard: React.FC = () => {
    const [selectedKPIs, setSelectedKPIs] = useState<string[]>([]);
    const [frequency, setFrequency] = useState<string>("days");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [format, setFormat] = useState<string>("excel");

    const formatDate = (date: string): string => {
        if (!date) return "";
    
        const parts = date.split("-");
        if (parts.length === 3) {
            const [year, month, day] = parts;
            return `${day}-${month}-${year}`;
        } else if (parts.length === 2) {
            const [year, month] = parts;
            return `${month}-${year}`;
        }
    
        return date; 
    };
    

    const handleKPIChange = (kpi: string) => {
        setSelectedKPIs((prev) =>
            prev.includes(kpi) ? prev.filter((item) => item !== kpi) : [...prev, kpi]
        );
    };

    const handleDownload = () => {
        if (!startDate || !endDate || selectedKPIs.length === 0) {
            alert("Por favor, selecciona los KPIs, un rango de fechas y un formato.");
            return;
        }

        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        const params = new URLSearchParams({
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            format,
            rangeType: frequency,
            kpis: selectedKPIs.join(","),
        });

        const downloadUrl = `https://tb.zeuss.click/api/v1/admin/dashboard/exports?${params.toString()}`;

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", `export.${format}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card className="p-4">
            <CardContent className="space-y-4">
                <h2 className="text-xl font-semibold">Exportación de KPIs</h2>

                <div>
                    <h3 className="font-medium mb-2">Selecciona KPIs</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {KPIS.map((kpi) => {
                            const kpiNames: Record<string, string> = {
                                ACTIVE_PROJECTS: "Proyectos Activos",
                                USERS_REGISTERED: "Usuarios Registrados",
                                KYC_REJECTED: "KYC Rechazados",
                                KYC_CONVERSION: "Conversión KYC",
                                AVAILABLE_TOKENUS: "Tok4You Disponibles",
                                USERS_FOR_COUNTRY: "Usuarios por País",
                                TOTAL_TOKENUS: "Tok4You Totales",
                            };

                            return (
                                <button
                                    key={kpi}
                                    className={`w-full py-2 px-4 rounded-lg border text-left transition-colors ${selectedKPIs.includes(kpi)
                                            ? "bg-c-primaryColor text-white border-blue-500"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100"
                                        }`}
                                    onClick={() => handleKPIChange(kpi)}
                                >
                                    {kpiNames[kpi]}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <h3 className="font-medium mb-2">Frecuencia</h3>
                    <Select onValueChange={setFrequency} defaultValue="days">
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="days">Diario</SelectItem>
                            <SelectItem value="months">Mensual</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <div>
                        <label className="block font-medium">Fecha inicial</label>
                        {frequency === "days" ? (
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        ) : (
                            <input
                                type="month"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        )}
                    </div>
                    <div>
                        <label className="block font-medium">Fecha final</label>
                        {frequency === "days" ? (
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        ) : (
                            <input
                                type="month"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="font-medium mb-2">Formato de archivo</h3>
                    <Select onValueChange={setFormat} defaultValue="excel">
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona formato" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="txt">Texto</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>

            <CardFooter className="flex justify-end">
                <Button
                    onClick={handleDownload}
                    className="bg-c-primaryColor hover:bg-c-secondaryColor text-white font-semibold text-lg px-6 py-3 rounded-lg"
                >
                    Descargar
                </Button>
            </CardFooter>

        </Card>
    );
};

export default ExportCard;

