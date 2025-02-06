"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@apollo/client";
import { gql } from "graphql-tag";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      phone
      role
    }
  }
`;

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface UsersTableProps {
  onEditUser: (user: User) => void;
}

const UsersTable = ({ onEditUser }: UsersTableProps) => {
  const { data, loading, error } = useQuery(GET_USERS);

  if (loading)
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Skeleton className="w-24 h-4" />
            </TableHead>
            <TableHead>
              <Skeleton className="w-24 h-4" />
            </TableHead>
            <TableHead>
              <Skeleton className="w-24 h-4" />
            </TableHead>
            <TableHead>
              <Skeleton className="w-24 h-4" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 3 }).map((_, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Skeleton className="w-full h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-full h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-full h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-full h-4" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );

  if (error)
    return <p>Error al cargar usuarios: {error.message}</p>;

  const users: User[] = data?.users || [];

  return (
    <Table>
      {users.length === 0 && (
        <TableCaption>No tienes registrados movimientos</TableCaption>
      )}
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Correo</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user: User) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.phone || "N/A"}</TableCell>
            <TableCell>
              <Button variant="outline" onClick={() => onEditUser(user)}>
                Editar Usuario
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UsersTable;
