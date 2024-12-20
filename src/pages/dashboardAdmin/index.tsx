import React, { useEffect, useState } from "react";
import Layout from "@/components/LayoutBars";
import {
  getCountUsersRegistered,
  getCountUsersRegisteredByDays,
  getCountUsersCountry,
  getKycRejectedByMonths,
  getKycRejectedByDays,
  getKycConversion,
  getKycConversionByDays,
  getActiveProjects,
  getActiveProjectsByDays,
  getTotalSupplyTokenUS,
  getAvailableTokensUS,
  getCountProjectsGeneral,
  getCountUsersGeneral,
} from "@/controllers/adminDashboard.controller";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  BarChart,
  Globe,
  Percent,
  PieChart,
  DollarSign,
  ArrowUpRight,
  CreditCard,
  Clock,
  TrendingDown,
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  Activity,
  User,
  Repeat,
  Banknote,
  Bitcoin,
  FileText,
  Circle,
  GlobeIcon,
  WalletIcon
} from "lucide-react";
import StatCard from "@/components/StatCard";
import {
  LineChart, Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import { start } from "repl";
import * as htmlToImage from 'html-to-image';
import { Download } from 'lucide-react';
import ChartCard from "@/components/GraphicModal";
import ComissionCard from "@/components/ComissionModal";
import ExportCard from "@/components/ExportModal";
import { X } from "lucide-react";
import { redirectToPath } from "@/lib/changePath";
import { useNavigate } from "react-router-dom";

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  error?: string;
}
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [usersRegistered, setUsersRegistered] = useState<
    { month: string; count: number }[] | null
  >(null);
  const [usersRegisteredByDays, setUsersRegisteredByDays] = useState<
    { date: string; count: number }[] | null
  >(null);

  const [usersByCountry, setUsersByCountry] = useState<
    { country: string; count: number }[] | null
  >(null);

  const [kycRejectedByMonths, setKycRejectedByMonths] = useState<
    | {
      month: string;
      count: number;
    }[]
    | null
  >(null);
  const [kycRejectedByDays, setKycRejectedByDays] = useState<
    | {
      date: string;
      count: number;
    }[]
    | null
  >(null);

  const [kycConversionByDays, setKycConversionByDays] = useState<
    | {
      date: string;
      conversionRate: number;
    }[]
    | null
  >(null);
  const [kycConversion, setKycConversion] = useState<
    | {
      month: string;
      conversionRate: number;
    }[]
    | null
  >(null);

  const [activeProjectsByDays, setActiveProjectsByDays] = useState<
    | {
      date: string;
      count: number;
    }[]
    | null
  >(null);
  const [activeProjects, setActiveProjects] = useState<
    | {
      month: string;
      count: number;
    }[]
    | null
  >(null);

  const [totalSupplyTokenUS, setTotalSupplyTokenUS] = useState<number | null>(
    null
  );
  interface CountUsersGeneral {
    totalAmountOfRegisteredUsers: number;
    usersRegisteredToday: number;
    usersRegisteredLastMonth: number;
    totalAmountOfUsersWhoHaveKycAccepted: number;
    kycCompletedToday: number;
    kycCompletedLastMonth: number;
    totalAmountOfUsersWhoSuccessfullyCompletedTos: number;
    tosCompletedToday: number;
    tosCompletedLastMonth: number;
  }

  const [countUsersGeneral, setCountUsersGeneral] =
    useState<CountUsersGeneral | null>(null);
  interface CountProjectsGeneral {
    totalProjectsCreated: number;
    projectsCreatedLastMonth: number;
    projectsCreatedToday: number;
  }

  const [countProjectsGeneral, setCountProjectsGeneral] =
    useState<CountProjectsGeneral | null>(null);

  const [availableTokensUS, setAvailableTokensUS] = useState<number | null>(
    null
  );

  const [errors, setErrors] = useState<{
    usersRegistered?: string;
    usersRegisteredByDays?: string;
    usersByCountry?: string;
    kycRejectedByMonths?: string;
    kycRejectedByDays?: string;
    kycConversionByDays?: string;
    kycConversion?: string;
    activeProjectsByDays?: string;
    activeProjects?: string;
    totalSupplyTokenUS?: string;
    countUsersGeneral?: string;
    countProjectsGeneral?: string;
    availableTokensUS?: string;
  }>({});
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 11);
    return date
      .toISOString()
      .split("T")[0]
      .slice(0, 7)
      .split("-")
      .reverse()
      .join("-");
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const date = new Date();
    return date
      .toISOString()
      .split("T")[0]
      .slice(0, 7)
      .split("-")
      .reverse()
      .join("-");
  });

  const [startDateDays, setStartDateDays] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 15);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  });

  const [endDateDays, setEndDateDays] = useState<string>(() => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  });

  useEffect(() => {
    const fetchUsersRegistered = async () => {
      try {
        console.log("fecha", startDate);
        const registeredUsers = await getCountUsersRegistered(
          startDate,
          endDate
        );
        setUsersRegistered(registeredUsers.message);
        console.log(registeredUsers);
      } catch (err) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          usersRegistered: "Error al obtener usuarios registrados",
        }));
      }
    };

    const fetchUsersByCountry = async () => {
      try {
        const usersCountry = await getCountUsersCountry();
        setUsersByCountry(usersCountry.message);
      } catch (err) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          usersByCountry: "Error al obtener usuarios por país",
        }));
      }
    };

    const fetchKycRejectedByMonths = async () => {
      try {
        const kycRejectedByMonthsData = await getKycRejectedByMonths(
          startDate,
          endDate
        );
        setKycRejectedByMonths(kycRejectedByMonthsData.message);
      } catch (err) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          kycRejected: "Error al obtener KYC rechazados",
        }));
      }
    };

    const fetchKycConversion = async () => {
      try {
        const kycConversionData = await getKycConversion(startDate, endDate);
        console.log("kycConversionData", kycConversionData);
        setKycConversion(kycConversionData.message);
      } catch (err) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          kycConversion: "Error al obtener conversión KYC",
        }));
      }
    };

    const fetchActiveProjects = async () => {
      try {
        const activeProjectsData = await getActiveProjects(startDate, endDate);
        setActiveProjects(activeProjectsData.message);
      } catch (err) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          activeProjects: "Error al obtener proyectos activos",
        }));
      }
    };

    const fetchTotalSupplyTokenUS = async () => {
      try {
        const totalSupplyTokenUSData = await getTotalSupplyTokenUS();
        setTotalSupplyTokenUS(totalSupplyTokenUSData.message);
      } catch (err) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          totalSupplyTokenUS: "Error al obtener suministro total de Tok4You",
        }));
      }
    };

    const fetchAvailableTokensUS = async () => {
      try {
        const availableTokensUSData = await getAvailableTokensUS();
        setAvailableTokensUS(availableTokensUSData.message);
      } catch (err) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          availableTokensUS:
            "Error al obtener suministro disponible de Tok4You",
        }));
      }
    };

    const fetchCountProjectsGeneral = async () => {
      try {
        const countProjectsGeneral = await getCountProjectsGeneral();
        setCountProjectsGeneral(countProjectsGeneral.message);
      } catch (err) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          countProjectsGeneral:
            "Error al obtener el conteo de usuarios generales",
        }));
      }
    };

    const fetchCountUsersGeneral = async () => {
      try {
        const countUsersGeneral = await getCountUsersGeneral();
        setCountUsersGeneral(countUsersGeneral.message);
      } catch (err) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          countUsersGeneral: "Error al obtener el conteo de usuarios generales",
        }));
      }
    };

    fetchUsersRegistered();
    fetchUsersByCountry();
    fetchKycRejectedByMonths();
    fetchKycConversion();
    fetchActiveProjects();
    fetchTotalSupplyTokenUS();
    fetchAvailableTokensUS();
    fetchCountProjectsGeneral();
    fetchCountUsersGeneral();
  }, [startDate, endDate]);

  useEffect(() => {
    const fetchKycRejectedByDays = async () => {
      try {
        const kycRejectedByDays = await getKycRejectedByDays(
          startDateDays,
          endDateDays
        );
        setKycRejectedByDays(kycRejectedByDays.message);
      } catch (err) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          kycRejected: "Error al obtener KYC rechazados",
        }));
      }
    };

    const fetchUsersRegisteredByDays = async () => {
      try {
        const usersRegisteredByDays = await getCountUsersRegisteredByDays(
          startDateDays,
          endDateDays
        );
        setUsersRegisteredByDays(usersRegisteredByDays.message);
      } catch (err) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          kycRejected: "Error al obtener KYC rechazados",
        }));
      }
    };

    const fetchKycConversionByDays = async () => {
      try {
        const kycConversionByDays = await getKycConversionByDays(
          startDateDays,
          endDateDays
        );
        setKycConversionByDays(kycConversionByDays.message);
      } catch (err) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          kycRejected: "Error al obtener KYC rechazados",
        }));
      }
    };

    const fetchActiveProjectsByDays = async () => {
      try {
        const activeProjectsByDays = await getActiveProjectsByDays(
          startDateDays,
          endDateDays
        );
        setActiveProjectsByDays(activeProjectsByDays.message);
      } catch (err) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          kycRejected: "Error al obtener KYC rechazados",
        }));
      }
    };

    fetchKycRejectedByDays();
    fetchUsersRegisteredByDays();
    fetchKycConversionByDays();
    fetchActiveProjectsByDays();
  }, [startDateDays, endDateDays]);

  interface ChartData {
    month: string;
    value: number;
  }

  const data: ChartData[] = [
    { month: "Ene", value: 10000 },
    { month: "Feb", value: 15000 },
    { month: "Mar", value: 27850 },
    { month: "Abr", value: 22000 },
    { month: "May", value: 18000 },
    { month: "Jun", value: 23000 },
    { month: "Jul", value: 17000 },
    { month: "Ago", value: 4000 },
  ];

  // Custom Label para las banderas
  const renderCustomAxisTick = (props: any) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <image
          href={`https://flagcdn.com/w40/${payload.value.toLowerCase()}.png`}
          x={-15}
          y={0}
          height="30"
          width="30"
        />
        <text x={0} y={35} textAnchor="middle" fontSize={11} fill="#333">
          {payload.value}
        </text>
      </g>
    );
  };

  const [selectedKPI, setSelectedKPI] = useState<any>(null);

  const toggleSelectedKPI = () => {
    setSelectedKPI(null);
  };

  const selectKPI = (kpi: string) => {
    setSelectedKPI(kpi);
  };

  const toggleSelectedComission = () => {
    setSelectedComission(false);
  };
  const [comission, setSelectedComission] = useState<boolean>(false);

  const toggleSelectedExport = () => {
    setSelectedExport(false);
  };
  const [exportKpis, setSelectedExport] = useState<boolean>(false);

  const redirectToSeePendingTransactions = () => {
    console.log("redirecting to start bank transfer transaction");
    redirectToPath(
      navigate,
      `/admin/bank-transaction/list-pending-transactions`
    );
  };

  return (
    <Layout>
      <div className="flex items-center justify-center ">
        <div className="grid grid-cols-1 lg:grid-cols-1 p-4 max-w-[1800px] space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold">Dashboard de Administrador</h1>
            <div className="flex gap-2">
              <button
                className="bg-c-primaryColor text-white py-2 px-8 rounded-md hover:bg-c-secondaryColor transition-colors"
                onClick={() => setSelectedComission(true)}
              >
                Configuración de comisiones
              </button>
              <button
                className="bg-c-primaryColor text-white py-2 px-8 rounded-md hover:bg-c-secondaryColor transition-colors"
                onClick={redirectToSeePendingTransactions}
              >
                Transacciones pendientes
              </button>
              <button
                className="bg-c-primaryColor text-white py-2 px-8 rounded-md hover:bg-c-secondaryColor transition-colors"
                onClick={() => setSelectedExport(true)}
              >
                Exportar
              </button>
            </div>
            {comission && (
              <div
                className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
                onClick={toggleSelectedComission}
              >
                <div
                  className="bg-white rounded-lg w-[900px] max-h-[90vh] overflow-x-hidden overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex sticky top-0 justify-between items-center p-4 bg-gray-100 rounded-t-lg">
                    <button
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={toggleSelectedComission}
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="p-6">
                    <ComissionCard />
                  </div>
                </div>
              </div>
            )}
            {exportKpis && (
              <div
                className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
                onClick={toggleSelectedExport}
              >
                <div
                  className="bg-white rounded-lg w-[900px] max-h-[90vh] overflow-x-hidden overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex sticky top-0 justify-between items-center p-4 bg-gray-100 rounded-t-lg">
                    <button
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={toggleSelectedExport}
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="p-6">
                    <ExportCard />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              icon={
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-c-primaryColor">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              }
              value={<></>}
              label="Capitalización de Mercado (HC)"
            />
            <StatCard
              icon={<BarChart className="w-6 h-6 text-c-primaryColor" />}
              value={<></>}
              label="Volumen Total de Negocios"
            />

            <Card
              onClick={() => selectKPI("Total de Proyectos")}
              className="cursor-pointer  border-0 bg-white"
            >
              <StatCard
                icon={
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-c-primaryColor">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                }
                value={
                  countProjectsGeneral ? (
                    <>
                      <div>
                        Total: {countProjectsGeneral.totalProjectsCreated}
                      </div>
                      <div>
                        Último mes:{" "}
                        {countProjectsGeneral.projectsCreatedLastMonth}
                      </div>
                      <div>
                        Hoy: {countProjectsGeneral.projectsCreatedToday}
                      </div>
                    </>
                  ) : (
                    "Cargando..."
                  )
                }
                label="Total de Proyectos"
                error={errors.countProjectsGeneral}
              />

              {selectedKPI === "Total de Proyectos" && (
                <div
                  className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
                  onClick={toggleSelectedKPI}
                >
                  <div
                    className="bg-white rounded-lg w-[900px] max-h-[90vh] overflow-x-hidden overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex sticky top-0 justify-between items-center p-4 bg-gray-100 rounded-t-lg">
                      <button
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={toggleSelectedKPI}
                      >
                        <X size={24} />
                      </button>
                    </div>
                    <div className="p-6">
                      <ChartCard
                        name="Total de Proyectos"
                        monthsData={
                          activeProjects
                            ? activeProjects.map(({ month, count }) => ({
                              month,
                              value: count,
                            }))
                            : []
                        }
                        daysData={
                          activeProjectsByDays
                            ? activeProjectsByDays.map(({ date, count }) => ({
                              day: date,
                              value: count,
                            }))
                            : []
                        }
                        total={
                          countProjectsGeneral
                            ? countProjectsGeneral.totalProjectsCreated
                            : 0
                        }
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        startDate={startDate}
                        endDate={endDate}
                        setStartDateDays={setStartDateDays}
                        setEndDateDays={setEndDateDays}
                        startDateDays={startDateDays}
                        endDateDays={endDateDays}
                      />
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <StatCard
              icon={<Percent className="w-6 h-6 text-c-primaryColor" />}
              value={<></>}
              label="Ratios de financiación de Proyectos"
            />
            <StatCard
              icon={
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-c-primaryColor">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
              }
              value={<></>}
              label="Participacion proyectos"
            />

            <StatCard
              icon={<DollarSign className="w-6 h-6 text-c-primaryColor" />}
              value={<></>}
              label="capitalizacion de mercado"
            />
            <StatCard
              icon={
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-c-primaryColor">
                  <ArrowUpRight className="w-6 h-6 text-white" />
                </div>
              }
              value={<></>}
              label="Volumen de Mercado Primario"
            />
            <StatCard
              icon={<CreditCard className="w-6 h-6 text-c-primaryColor" />}
              value={<></>}
              label="Precio promedio de Token Primario"
            />
            <StatCard
              icon={
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-c-primaryColor">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
              }
              value={<></>}
              label="Participacion de proyectos Primarios"
            />

            <StatCard
              icon={<Clock className="w-6 h-6 text-c-primaryColor" />}
              value={<></>}
              label="Tiempo medio de retención de tokens"
            />

            <StatCard
              icon={
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-c-primaryColor">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
              }
              value={<></>}
              label="Capitalización de Mercado Secundario"
            />
            <StatCard
              icon={<BarChart className="w-6 h-6 text-c-primaryColor" />}
              value={<></>}
              label="Volumen de Mercado Secundario"
            />
            <StatCard
              icon={
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-c-primaryColor">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
              }
              value={<></>}
              label="Precio promedio de Token Secundario"
            />
            <StatCard
              icon={<PieChart className="w-6 h-6 text-c-primaryColor" />}
              value={<></>}
              label="Participacion de proyectos Secundarios"
            />
            <StatCard
              icon={
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-c-primaryColor">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              }
              value={<></>}
              label="Volatilidad de Precios"
            />

            <Card
              onClick={() => selectKPI("Usuarios por Tipo")}
              className="cursor-pointer  border-0 bg-white"
            >
              <StatCard
                icon={<Users className="w-6 h-6 text-c-primaryColor" />}
                value={
                  countUsersGeneral ? (
                    <>
                      <div>
                        Total: {countUsersGeneral.totalAmountOfRegisteredUsers}
                      </div>
                      <div>
                        Último mes: {countUsersGeneral.usersRegisteredLastMonth}
                      </div>
                      <div>Hoy: {countUsersGeneral.usersRegisteredToday}</div>
                    </>
                  ) : (
                    "Cargando..."
                  )
                }
                label="Usuarios por Tipo"
                error={errors.countProjectsGeneral}
              />

              {selectedKPI === "Usuarios por Tipo" && (
                <div
                  className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
                  onClick={toggleSelectedKPI}
                >
                  <div
                    className="bg-white rounded-lg w-[900px] max-h-[90vh] overflow-x-hidden overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex sticky top-0 justify-between items-center p-4 bg-gray-100 rounded-t-lg">
                      <button
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={toggleSelectedKPI}
                      >
                        <X size={24} />
                      </button>
                    </div>
                    <div className="p-6">
                      <ChartCard
                        name="Usuarios por Tipo"
                        monthsData={
                          usersRegistered
                            ? usersRegistered.map(({ month, count }) => ({
                              month,
                              value: count,
                            }))
                            : []
                        }
                        daysData={
                          usersRegisteredByDays
                            ? usersRegisteredByDays.map(({ date, count }) => ({
                              day: date,
                              value: count,
                            }))
                            : []
                        }
                        total={
                          countUsersGeneral
                            ? countUsersGeneral.totalAmountOfRegisteredUsers
                            : 0
                        }
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        startDate={startDate}
                        endDate={endDate}
                        setStartDateDays={setStartDateDays}
                        setEndDateDays={setEndDateDays}
                        startDateDays={startDateDays}
                        endDateDays={endDateDays}
                      />
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <Card className="bg-white">
              <StatCard
                icon={
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-c-primaryColor">
                    <GlobeIcon className="w-6 h-6 text-white" />
                  </div>
                }
                value={
                  usersByCountry ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsBarChart data={usersByCountry} margin={{ bottom: 20 }}>
                        <XAxis
                          dataKey="country"
                          tick={renderCustomAxisTick} // Usar banderas como etiquetas
                          tickLine={false}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  ) : (
                    "Cargando..."
                  )
                }
                label="Usuarios por País"
                error={errors.usersByCountry}
              />
            </Card>

            <StatCard
              icon={<CheckCircle className="w-6 h-6 text-c-primaryColor" />}
              value={
                kycConversion
                  ? kycConversion.map((user) => {
                    const [year, rawMonth] = user.month.split("-");
                    const yearNumber = parseInt(year, 10);
                    const monthNumber = parseInt(rawMonth, 10) - 1;

                    const formattedDate = new Date(
                      Date.UTC(yearNumber, monthNumber + 1)
                    ).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                    });

                    return (
                      <div key={user.month}>
                        {formattedDate}: {user.conversionRate}%
                      </div>
                    );
                  })
                  : "Cargando..."
              }
              label="Conversión KYC (GRAFICO?)"
              error={errors.kycConversion}
            />

            <Card
              onClick={() => selectKPI("KYC Rechazados")}
              className="cursor-pointer  border-0 bg-white"
            >
              <StatCard
                icon={
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-c-primaryColor">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                }
                value={
                  kycRejectedByMonths && kycRejectedByDays ? (
                    <>
                      <div>
                        Total:{" "}
                        {kycRejectedByMonths.reduce(
                          (total, month) => total + month.count,
                          0
                        )}
                      </div>
                      <div>
                        Último mes:{" "}
                        {(() => {
                          const lastMonth = new Date();
                          lastMonth.setMonth(lastMonth.getMonth() - 1);
                          const lastMonthString = lastMonth
                            .toISOString()
                            .slice(0, 7); // Formato YYYY-MM
                          const lastMonthData = kycRejectedByMonths.find(
                            (month) => month.month === lastMonthString
                          );
                          return lastMonthData ? lastMonthData.count : 0;
                        })()}
                      </div>
                      <div>
                        Hoy:{" "}
                        {(() => {
                          const todayString = new Date()
                            .toISOString()
                            .slice(0, 10); // Formato YYYY-MM-DD
                          const todayData = kycRejectedByDays.find(
                            (day) => day.date === todayString
                          );
                          return todayData ? todayData.count : 0;
                        })()}
                      </div>
                    </>
                  ) : (
                    "Cargando..."
                  )
                }
                label="KYC Rechazados (faltan datos total ultimo mes y hoy)"
                error={errors.kycRejectedByMonths}
              />

              {selectedKPI === "KYC Rechazados" && (
                <div
                  className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
                  onClick={toggleSelectedKPI}
                >
                  <div
                    className="bg-white rounded-lg w-[900px] max-h-[90vh] overflow-x-hidden overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex sticky top-0 justify-between items-center p-4 bg-gray-100 rounded-t-lg">
                      <button
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={toggleSelectedKPI}
                      >
                        <X size={24} />
                      </button>
                    </div>
                    <div className="p-6">
                      <ChartCard
                        name="KYC Rechazados"
                        monthsData={
                          kycRejectedByMonths
                            ? kycRejectedByMonths.map(({ month, count }) => ({
                              month,
                              value: count,
                            }))
                            : []
                        }
                        daysData={
                          kycRejectedByDays
                            ? kycRejectedByDays.map(({ date, count }) => ({
                              day: date,
                              value: count,
                            }))
                            : []
                        }
                        total={115} // Total de KYC rechazados que se mostrará en el gráfico
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        startDate={startDate}
                        endDate={endDate}
                        setStartDateDays={setStartDateDays}
                        setEndDateDays={setEndDateDays}
                        startDateDays={startDateDays}
                        endDateDays={endDateDays}
                      />
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <StatCard
              icon={<Activity className="w-6 h-6 text-c-primaryColor" />}
              value={<></>}
              label="Números de Usuarios Activos"
            />
            <StatCard
              icon={
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-c-primaryColor">
                  <User className="w-6 h-6 text-white" />
                </div>
              }
              value={<></>}
              label="ARPU de usuarios Activos"
            />
            <StatCard
              icon={<Repeat className="w-6 h-6 text-c-primaryColor" />}
              value={<></>}
              label="Recurrencia"
            />
            <StatCard
              icon={
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-c-primaryColor">
                  <Banknote className="w-6 h-6 text-white" />
                </div>
              }
              value={<></>}
              label="Cobrabilidad Fiat"
            />
            <StatCard
              icon={<Bitcoin className="w-6 h-6 text-c-primaryColor" />}
              value={<></>}
              label="Cobrabilidad Cripto"
            />
            <StatCard
              icon={
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-c-primaryColor">
                  <WalletIcon className="w-5 h-5 text-white" />
                </div>
              }
              value={<></>}
              label="Comisiones Cobradas"
            />
            <StatCard
              icon={<FileText className="w-6 h-6 text-c-primaryColor" />}
              value={totalSupplyTokenUS || "Cargando..."}
              label="Tokend Tok4You Emitidos"
              error={errors.totalSupplyTokenUS}
            />
            <StatCard
              icon={
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-c-primaryColor">
                  <FileText className="w-5 h-5 text-white" />
                </div>
              }
              value={availableTokensUS || "Cargando..."}
              label="Tokens Tok4You Disponibles"
              error={errors.availableTokensUS}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
