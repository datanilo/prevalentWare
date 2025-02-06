"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client";
import { gql } from 'graphql-tag';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel,  SelectTrigger,  SelectValue} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const UPDATE_USER = gql`
  mutation UpdateUser($id: String!, $name: String!, $role: Role!, $phone: String!) {
    updateUser(id: $id, name: $name, role: $role, phone: $phone) {
      id
      name
      role
      email
      phone
    }
  }
`;

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

const userSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  role: z.enum(["USER", "ADMIN"], {
    errorMap: () => ({ message: "Rol inválido" }),
  }),
  phone: z.string().min(10, "El teléfono es inválido, digite un número de 10 digitos"),
});


type UserFormData = z.infer<typeof userSchema>;

interface FormUsersProps {
  user: {
    id: string;
    name: string;
    role: string;
    phone: string;
  };
  onCompleted: () => void;
  onCancel: () => void;
}

export default function FormUsers({ user, onCompleted, onCancel }: FormUsersProps) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user.name,
      role: user.role as "USER" | "ADMIN",
      phone: user.phone || "",
    },
  });

  const [updateUser, { loading, error }] = useMutation(UPDATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      await updateUser({
        variables: {
          id: user.id,
          name: data.name,
          role: data.role,
          phone: data.phone,
        },
      });
      onCompleted();
    } catch (err) {
      console.error("Error al actualizar el usuario:", err);
    }
  };

  return (
    <div className="flex flex-col w-1/2 mx-auto bg-white border shadow py-4">
      <h2 className="text-2xl text-center font-bold mb-4">Editar Usuario</h2>
      <div className="w-1/2 mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input className="bg-white" placeholder="Nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input className="bg-white" placeholder="Teléfono" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Rol</FormLabel>
                  <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>
                        <SelectItem value="USER">Usuario</SelectItem>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <p className="text-red-500">Error: {error.message}</p>}

            <div className="flex justify-center space-x-2">
              <Button type="button" variant="default" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
