"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client";
import { gql } from 'graphql-tag';
import { useSession } from "next-auth/react";
import { DatePicker } from "@/components/DatePicker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Mutación para agregar un nuevo movimiento financiero
const ADD_MOVEMENT = gql`
  mutation AddMovement(
    $concept: String!
    $amount: Float!
    $date: String!
    $userId: String!
  ) {
    addMovement(concept: $concept, amount: $amount, date: $date, userId: $userId) {
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

// Consulta para obtener la lista de movimientos actualizados
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

// Consulta para obtener el reporte financiero actualizado
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

// Esquema de validación de los datos del formulario usando Zod
const movementSchema = z.object({
  concept: z.string().min(1, "El concepto es requerido"),
  amount: z.preprocess((a) => {
    if (typeof a === "string") return parseFloat(a);
    return a;
  }, z.number()),  
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
});

// Tipado de los datos que maneja el formulario
type MovementFormData = z.infer<typeof movementSchema>;

// Propiedades que recibe el formulario (acciones al completar o cancelar)
interface MovementFormProps {
  onCompleted: () => void;
  onCancel: () => void;
}

export default function MovementForm({
  onCompleted,
  onCancel,
}: MovementFormProps) {
  // Obtiene la sesión del usuario autenticado
  const { data: session } = useSession();

  // Configura el formulario con validación y valores iniciales
  const form = useForm<MovementFormData>({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      concept: "",
      amount: 0,
      date: "",
    },
  });

  // Mutación para agregar un movimiento y actualizar los datos en la UI
  const [createMovement, { loading, error }] = useMutation(ADD_MOVEMENT, {
    refetchQueries: [{ query: GET_MOVEMENTS }, { query: GET_FINANCIAL_REPORT }], // Refresca la lista de movimientos y el reporte financiero
  });

  // Maneja el envío del formulario y la creación del movimiento
  const onSubmit = async (data: MovementFormData) => {
    if (!session?.user?.id) {
      console.error("No se encontró el usuario autenticado.");
      return;
    }

    try {
      await createMovement({
        variables: {
          concept: data.concept,
          amount: data.amount,
          date: data.date,
          userId: session.user.id,
        },
      });
      onCompleted(); // Ejecuta la función de finalización tras agregar el movimiento
    } catch (err) {
      console.error("Error al crear el movimiento:", err);
    }
  };

  return (
    <div className="flex flex-col w-1/2 mx-auto bg-white border shadow py-4">
      <h2 className="text-2xl text-center font-bold mb-4">Nuevo Movimiento de Dinero</h2>
      
      <div className="w-1/2 mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="concept"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Concepto</FormLabel>
                <FormControl>
                  <Input className="bg-white" placeholder="Concepto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto</FormLabel>
                <FormControl>
                  <Input className="bg-white" type="number" placeholder="Monto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <p className="text-red-500">Error: {error.message}</p>
          )}

          <div className="flex justify-center space-x-2">
            <Button type="button" variant="default" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Agregando..." : "Agregar Movimiento"}
            </Button>
          </div>
        </form>
      </Form>
      </div>
    </div>
  );
}
