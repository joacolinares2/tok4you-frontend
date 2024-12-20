import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { FolderIcon, UserIcon, PlusCircleIcon, ArrowUpIcon, FileText, X } from "lucide-react"
import Layout from "@/components/LayoutBars";
import FormProyect from "@/components/FormProyect";

interface ChartData {
    month: string;
    value: number;
}

const data: ChartData[] = [
    { month: 'Ene', value: 10000 },
    { month: 'Feb', value: 15000 },
    { month: 'Mar', value: 27850 },
    { month: 'Abr', value: 22000 },
    { month: 'May', value: 18000 },
    { month: 'Jun', value: 23000 },
    { month: 'Jul', value: 17000 },
    { month: 'Ago', value: 4000 },
]

interface StatCardProps {
    icon: React.ReactNode;
    value: string;
    label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => {
    return (
        <Card>
            <CardContent className="flex items-center pt-6">
                {icon}
                <div className="ml-4">
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-sm text-muted-foreground">{label}</p>
                </div>
            </CardContent>
        </Card>
    )
}

const ProjectDashboard: React.FC = () => {
    const [showFormProyect, setShowFormProyect] = useState(false);

    const toggleFormProyect = () => {
        setShowFormProyect(!showFormProyect); // Alternar la visibilidad del formulario
    };
    return (
        <Layout>
            <div className="p-4 max-w-7xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold">Estado General</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard
                        icon={<FolderIcon className="w-6 h-6 text-c-primaryColor" />}
                        value="10k"
                        label="Proyectos activos"
                    />
                    <StatCard
                        icon={<FolderIcon className="w-6 h-6 text-c-primaryColor" />}
                        value="4,222"
                        label="Tokens proyecto"
                    />
                    <StatCard
                        icon={<UserIcon className="w-6 h-6 text-c-primaryColor" />}
                        value="12,5k"
                        label="Cant. inversores en mis proyectos"
                    />
                    
                    {/* {showFormProyect && (
                        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 ">
                            <div className="bg-white rounded-lg min-w-[400px]">
                                <div className="flex justify-between items-center p-4 bg-gray-100 rounded-t-lg">
                                    <h2 className="text-lg font-semibold">Formulario de Proyecto</h2>
                                    <button
                                        className="text-gray-600 hover:text-gray-800 focus:outline-none"
                                        onClick={toggleFormProyect}
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                                <FormProyect toggleFormProyect={toggleFormProyect} />
                            </div>
                        </div>
                    )} */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium">Total recaudado en mis proyectos</CardTitle>
                            <Select defaultValue="mar2024">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Seleccionar mes" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mar2024">Mar 2024</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={data}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">Inversores en mis proyectos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">35,874</div>
                            <p className="text-xs text-muted-foreground">Últimos 15 días</p>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Aceptados</p>
                                    <p className="text-2xl font-bold">3,249</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Rechazados</p>
                                    <p className="text-2xl font-bold">1420</p>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center space-x-2">
                                <div className="flex -space-x-2">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className={`w-8 h-8 rounded-full border-2 border-background ${i === 2 ? 'bg-red-500' : 'bg-c-primaryColor'}`} />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">+8</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">Estado de mis proyectos</CardTitle>
                        <Select defaultValue="proyecto34234">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Seleccionar proyecto" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="proyecto34234">Proyecto 34234</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>PROYECTO</TableHead>
                                    <TableHead>TOKENS TOTALES</TableHead>
                                    <TableHead>TOKENS POR VENDER</TableHead>
                                    <TableHead>VALOR</TableHead>
                                    <TableHead>PORCENTAJE VENDIDO</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>653CD1</TableCell>
                                    <TableCell>123,245k</TableCell>
                                    <TableCell>123,245k</TableCell>
                                    <TableCell>2.000,00</TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <span className="mr-2">88%</span>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                                <div className="bg-c-primaryColor  h-2.5 rounded-full" style={{ width: "88%" }}></div>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            
        </Layout>
    )
}

export default ProjectDashboard