import Layout from '@/components/Layout';
import { useState, useEffect } from 'react'
import FormUsers from '@/components/FormUsers';
import UsersTable from '@/components/UsersTable';
import Head from 'next/head';
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";


const UserManagement = () => {

  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [editingUser, setEditingUser] = useState<{
    id: string;
    name: string;
    role: string;
    phone: string;
  } | null>(null);

  // Verifica que el usuario esté autenticado y sea ADMIN.
  useEffect(() => {
    if (status !== "loading" && (!session || (session.user.role !== "ADMIN"))) {
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
        <title>Gestión de usuarios</title>
      </Head>
      <Layout>
        <h1 className="text-2xl font-bold mb-8 text-center">Sistema de gestión de Ingresos y Gastos</h1>
        <h2 className="text-xl underline underline-offset-8 mb-16">Gestión de Usuarios</h2>
        
        {editingUser ? (
          <FormUsers
            user={editingUser}
            onCompleted={() => setEditingUser(null)}
            onCancel={() => setEditingUser(null)}
          />
        ) : (
          <UsersTable onEditUser={setEditingUser} />
        )}
      </Layout>
    </>
  );
};

export default UserManagement;
