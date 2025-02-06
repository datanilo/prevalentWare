"use client";

import Layout from "@/components/Layout";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { gql, useQuery } from "@apollo/client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { generateCSV } from '@/utils/generateCSV';

// Query que obtiene el reporte financiero
const GET_FINANCIAL_REPORT = gql`
  query GetFinancialReport {
    financialReport {
      currentBalance
      monthlyMovements {
        month
        total
      }
    }
  }
`;

const Reports = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Ejecutar la consulta inmediatamente para que no haya retrasos
  const { data, loading, error } = useQuery(GET_FINANCIAL_REPORT);

  // Verifica que el usuario esté autenticado y sea ADMIN o USER.
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [session, status, router]);


  // Configuración del gráfico
  const chartConfig = {
    total: {
      label: "Movimientos",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  const { currentBalance, monthlyMovements } = data?.financialReport ?? {};

  // Función para manejar la descarga del CSV
  const handleDownloadCSV = () => {
    generateCSV(data); // Usa la función de generación del CSV
  };

  return (
    <>
      <Head>
        <title>Reportes</title>
      </Head>
      <Layout>
        <h1 className="text-2xl font-bold mb-8 text-center">
          Sistema de gestión de Ingresos y Gastos
        </h1>
        <h2 className="text-xl underline underline-offset-8 mb-16">
          Reportes Financieros
        </h2>

        <div className="flex">
          <div className="w-3/5">
            <ChartContainer config={chartConfig} className="h-7/8 w-full">
              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <Skeleton className="w-full h-[300px] rounded-lg" />
                </div>
              ) : error ? (
                <div className="flex h-full items-center justify-center text-red-500">
                  Error: {error.message}
                </div>
              ) : (
                <BarChart data={monthlyMovements}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={true}
                    tickMargin={10}
                    axisLine={true}
                    tickFormatter={(value) => value.slice(0, 3)}
                    tick={{ fill: "black" }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent className="text-sm bg-gray-800 text-white uppercase" />
                    }
                  />
                  <Bar
                    dataKey="total"
                    fill="var(--color-total, #2563eb)"
                    radius={4}
                  />
                </BarChart>
              )}
            </ChartContainer>
          </div>

          <div className="w-2/5 flex flex-col items-center gap-6">
            {loading ? (
              <Skeleton className="w-[200px] h-[40px] rounded-lg" />
            ) : (
              <p className="text-xl">
                Saldo Actual:{" "}
                <span className="font-semibold">
                  ${currentBalance?.toLocaleString()}
                </span>
              </p>
            )}
            <Button onClick={handleDownloadCSV} variant="primary" disabled={loading}>
              Descargar CSV
            </Button>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Reports;
