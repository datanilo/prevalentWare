import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Siderbar';
import { Toaster } from "@/components/ui/toaster";

const Layout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="flex flex-col h-screen">
      <Toaster />
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-12 bg-gray-50 text-black">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
