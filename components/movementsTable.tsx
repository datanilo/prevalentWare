import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "graphql-tag";
import FormMovements from "@/components/FormMovements";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

// Consulta GraphQL para obtener los movimientos
const GET_MOVEMENTS = gql`
  query GetMovements {
    movements {
      id
      concept
      amount
      date
      user {
        name
      }
    }
  }
`;

// Mutación GraphQL para eliminar movimientos
const DELETE_MOVEMENTS = gql`
  mutation DeleteMovements($ids: [String!]!) {
    deleteMovements(ids: $ids) {
      id
    }
  }
`;

interface Movement {
  id: string;
  concept: string;
  amount: number;
  date: string;
  user: {
    name: string;
  };
}

const MovementsTable = () => {

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const [showForm, setShowForm] = useState(false);
  const [selectedMovements, setSelectedMovements] = useState<string[]>([]);

  const { data, loading, refetch } = useQuery(GET_MOVEMENTS);

  const [deleteMovements, { loading: deleting, error: deleteError }] =
    useMutation(DELETE_MOVEMENTS, {
      onCompleted: () => {
        setSelectedMovements([]);
        refetch();
      },
    });

  const handleDelete = async () => {
    if (selectedMovements.length === 0) return;
    try {
      await deleteMovements({
        variables: { ids: selectedMovements },
      });
    } catch (err) {
      console.error("Error al eliminar movimientos:", err);
    }
  };

  const movements: Movement[] = data?.movements || [];

  const totalAmount = movements.reduce((sum, movement) => sum + movement.amount, 0);

  const isAllSelected =
    movements.length > 0 &&
    movements.every((movement) => selectedMovements.includes(movement.id));


  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = movements.map((movement) => movement.id);
      setSelectedMovements(allIds);
    } else {
      setSelectedMovements([]);
    }
  };

  const handleSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    if (e.target.checked) {
      setSelectedMovements((prev) => [...prev, id]);
    } else {
      setSelectedMovements((prev) =>
        prev.filter((selectedId) => selectedId !== id)
      );
    }
  };

  if (loading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            {isAdmin && (
              <TableHead>
                <Skeleton className="w-6 h-6" />
              </TableHead>
            )}
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
              {isAdmin && (
                <TableCell>
                  <Skeleton className="w-6 h-6" />
                </TableCell>
              )}
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
  }

  if (showForm) {
    return (
      <div className="w-full flex flex-col items-center">
        <FormMovements
          onCompleted={() => {
            setShowForm(false);
            refetch();
          }}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      {isAdmin && (
        <div className="flex justify-end mb-4 space-x-2">
          <Button
            variant="destructive"
            className="px-6"
            onClick={handleDelete}
            disabled={selectedMovements.length === 0 || deleting}
          >
            {deleting ? "Eliminando..." : "Eliminar Movimientos"}
          </Button>
          <Button
            variant="primary"
            className="px-6"
            onClick={() => setShowForm(true)}
          >
            Nuevo Movimiento
          </Button>
        </div>
      )}

      {deleteError && (
        <p className="text-red-500">
          Error al eliminar movimientos: {deleteError.message}
        </p>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {isAdmin && (
              <TableHead>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </TableHead>
            )}
            <TableHead>Concepto</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Usuario</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 5 : 4} className="text-center py-4">
                No tienes registrados movimientos
              </TableCell>
            </TableRow>
          ) : (
            movements.map((movement: Movement) => (
              <TableRow key={movement.id}>
                {isAdmin && (
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedMovements.includes(movement.id)}
                      onChange={(e) => handleSelect(e, movement.id)}
                    />
                  </TableCell>
                )}
                <TableCell>{movement.concept}</TableCell>
                <TableCell>{movement.amount}</TableCell>
                <TableCell>
                  {new Date(Number(movement.date)).toLocaleDateString("es-ES", {
                    timeZone: "UTC",
                  })}
                </TableCell>
                <TableCell>{movement.user.name}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="text-right py-3 pr-10 text-lg font-semibold bg-gray-300">
        <p>Total: {totalAmount} </p>
      </div>
    </div>
  );
};

export default MovementsTable;
