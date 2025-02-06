import Layout from '@/components/Layout';
import { Card } from "@/components/ui/card";
import Head from 'next/head';

const Home = () => {
  return (
    <>
      <Head>
        <title>Sistema de Gestión</title>
      </Head>
      <Layout>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

          <Card className="p-6 bg-white shadow text-center">
            <div className="text-4xl text-gray-200 mb-4" />
            <h4 className="text-xl font-semibold mb-2">Sistema de Gestión de Ingresos y Gastos</h4>
            <p className="text-sm text-gray-600 mb-4">
              Accede a la vista de ingresos y egresos, donde podrás registrar y gestionar movimientos financieros.
            </p>

          </Card>

          <Card className="p-6 bg-white shadow text-center">
            <div className="text-4xl text-gray-200 mb-4" />
            <h4 className="text-xl font-semibold mb-2">Gestión de Usuarios</h4>
            <p className="text-sm text-gray-600 mb-4">
              Administra los usuarios de la plataforma, asigna roles y realiza cambios en la información de los mismos.
            </p>

          </Card>

          <Card className="p-6 bg-white shadow text-center">
            <div className="text-4xl text-gray-200 mb-4" />
            <h4 className="text-xl font-semibold mb-2">Reportes Financieros</h4>
            <p className="text-sm text-gray-600 mb-4">
              Visualiza gráficos de movimientos financieros y descarga reportes en formato CSV.
            </p>

          </Card>
        </div>
      </Layout>
    </>
  );
};

export default Home;
