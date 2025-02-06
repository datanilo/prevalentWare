"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { LogOut, ChevronDown } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

const Navbar = () => {

  const { data: session } = useSession();

  return (
    <Card className="bg-gray-800 border-none pr-4 flex items-center justify-between gap-6 w-full">
      <div className="flex items-center">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={250} height={63} priority />
        </Link>
      </div>
      <div className="flex items-center">
      {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
              {session.user?.name || "Usuario"} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => signOut({callbackUrl: "/api/auth/logout"})}>
                <LogOut className="mr-2" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="primary" onClick={() => signIn("auth0")}>
            Iniciar sesión
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Navbar;