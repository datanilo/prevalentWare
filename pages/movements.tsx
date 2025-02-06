import Layout from '@/components/Layout';
import MovementsTable from '@/components/movementsTable';
import Head from 'next/head';
import { useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";

const Movements = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  // Verifica que el usuario esté autenticado y sea ADMIN o USER.
  useEffect(() => {
    if (status !== "loading" && (!session || (session.user.role !== "ADMIN" && session.user.role !== "USER"))) {
      toast({
        title: "Acceso denegado",
        description: "No tienes permiso para ver esta página.",
        variant: "destructive",
      });

        router.replace("/");
    }
  }, [session, status, router, toast]);

  return (
    <>
      <Head>
        <title>Ingresos y Egresos</title>
      </Head>
      <Layout>
        <h1 className="text-2xl font-bold mb-8 text-center">Sistema de gestión de Ingresos y Gastos</h1>
        <h2 className="text-xl underline underline-offset-8 mb-4">Ingresos y egresos</h2>
        <MovementsTable />
      </Layout>
    </>
  );
};

export default Movements;
