import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList } from "recharts";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ChartCardProps {
    name: string;
    monthsData: { month: string; value: number }[];
    daysData: { day: string; value: number }[];
    total: number;
    startDate: string;
    endDate: string;
    setStartDate: (date: string) => void;
    setEndDate: (date: string) => void;
    startDateDays: string;
    endDateDays: string;
    setStartDateDays: (date: string) => void;
    setEndDateDays: (date: string) => void;
}

const ChartCard: React.FC<ChartCardProps> = ({ name, monthsData, daysData, total, startDate, endDate,setStartDate, setEndDate,startDateDays, endDateDays, setStartDateDays, setEndDateDays}) => {
    

    const [selectedFormat, setSelectedFormat] = useState<string>("png");

    const handleDownload = () => {
        const cardElement = document.getElementById('card-content'); // Ensure your card content has this id

        if (cardElement) {
            if (selectedFormat === 'png' || selectedFormat === 'jpg') {
                html2canvas(cardElement).then(canvas => {
                    const link = document.createElement('a');
                    link.href = canvas.toDataURL(`image/${selectedFormat}`);
                    link.download = `card.${selectedFormat}`;
                    link.click();
                });
            } else if (selectedFormat === 'pdf') {
                html2canvas(cardElement).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF();
                    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                    pdf.save('card.pdf');
                });
            }
        } else {
            console.error('Card element not found');
        }
    };

    return (
        <Card className="" >


            {/* Contenido principal */}
            <CardContent id="card-content" className="space-y-6 bg-white">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mt-2">{name}</h2>
                    <p className="text-lg mt-2">Total: {total}</p>
                </div>

                <div className="flex space-x-4 my-6">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                            Fecha Inicial Meses
                        </label>
                        <input
                            type="month"
                            id="startDate"
                            name="startDate"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={startDate.split('-').reverse().join('-')}

                            onChange={(e) => {
                                setStartDate(e.target.value.slice(0, 7).split('-').reverse().join('-'));
                            }}

                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                            Fecha Final Meses
                        </label>
                        <input
                            type="month"
                            id="endDate"
                            name="endDate"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={endDate.split('-').reverse().join('-')}

                            onChange={(e) => {
                                setEndDate(e.target.value.slice(0, 7).split('-').reverse().join('-'));
                            }}

                        />
                    </div>
                </div>

                {/* Gráfico de Meses */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Rango de Meses</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthsData}
                                margin={{
                                    top: 20,
                                }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="month"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    fontSize={12}
                                    tickFormatter={(value) => value.slice(0, 7)} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#3b82f6" radius={8}>
                                    <LabelList position="top" offset={7} fontSize={12} />
                                </Bar>

                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flex space-x-4 mb-6">
                        <div>
                            <label htmlFor="startDateDays" className="block text-sm font-medium text-gray-700">
                                Fecha Inicial Dias
                            </label>
                            <input
                                type="date"
                                id="startDateDays"
                                name="startDateDays"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={startDateDays.split('-').reverse().join('-')} 
                                onChange={(e) => {
                                    setStartDateDays(e.target.value.split('-').reverse().join('-')); 
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor="endDateDays" className="block text-sm font-medium text-gray-700">
                                Fecha Final Dias
                            </label>
                            <input
                                type="date"
                                id="endDateDays"
                                name="endDateDays"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={endDateDays.split('-').reverse().join('-')}

                                onChange={(e) => {
                                    setEndDateDays(e.target.value.split('-').reverse().join('-'));
                                }}

                            />
                        </div>
                    </div>

                {/* Gráfico de Días */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Rango de Días</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={daysData}
                                margin={{
                                    top: 20,
                                }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="day"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    fontSize={12}
                                    tickFormatter={(value) => value.slice(5, 10)} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#3b82f6" radius={8}>
                                    <LabelList position="top" offset={7} fontSize={12} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Datos adicionales */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded">
                        <h3 className="text-lg font-semibold mb-2">Datos de Meses</h3>
                        <ul className="space-y-1">
                            {monthsData.map((item, index) => (
                                <li key={index}>
                                    {item.month}: {item.value}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="p-4 border rounded">
                        <h3 className="text-lg font-semibold mb-2">Datos de Días</h3>
                        <ul className="space-y-1">
                            {daysData.map((item, index) => (
                                <li key={index}>
                                    {item.day}: {item.value}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </CardContent>

            {/* Footer */}
            <CardFooter className="flex items-center justify-between">
                <Select onValueChange={(value) => setSelectedFormat(value)} defaultValue="png">
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Selecciona formato" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpg">JPG</SelectItem>
                    </SelectContent>
                </Select>
                <Button onClick={handleDownload}>Descargar</Button>
            </CardFooter>
        </Card>
    );
};

export default ChartCard;
