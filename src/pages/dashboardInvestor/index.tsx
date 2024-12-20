import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, MapPin, Mail, Phone, CreditCard, Coins } from "lucide-react"
import TokenUS from "@/assets/favicon.ico";
import Layout from "@/components/LayoutBars";

export default function UserDashboard() {
  const userObj = localStorage.getItem("fullUserDataObject");
  const user = userObj ? JSON.parse(userObj) : null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Layout>
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            <div className="w-full lg:w-2/3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Perfil del Usuario</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <CardTitle>Información Personal</CardTitle>
                  <div className="flex items-center space-x-4">
                    <CalendarDays className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de nacimiento</p>
                      <p className="text-lg font-semibold">{formatDate(user.birth_date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">País</p>
                      <p className="text-lg font-semibold">{user.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-lg font-semibold">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Teléfono</p>
                      <p className="text-lg font-semibold">{user.mobile_phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Información de Documentación</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center space-x-4">
                    <CreditCard className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo de Documento</p>
                      <p className="text-lg font-semibold">{user.document_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <CreditCard className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Número de documento</p>
                      <p className="text-lg font-semibold">{user.document_number}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="w-full lg:w-1/3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumen de cuenta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={TokenUS}
                        className="w-9  "
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tokens Disponibles</p>
                        <p className="text-2xl font-bold">100</p>  {/*{user.tokens}*/}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Cuenta Creada</p>
                    <p className="text-lg font-semibold">{formatDate(user.createdAt)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}