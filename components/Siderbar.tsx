import { Card } from "@/components/ui/card";
import Link from 'next/link';
import { sidebarLinks } from "@/config/sidebar-links";

const Sidebar = () => {
  return (
    <Card className="w-64 bg-gray-800 text-white p-4">
      <nav className="mt-4">
        <ul>
          {sidebarLinks.map((link) => (
            <li className="mb-2" key={link.path}>
              <Link 
                href={link.path} 
                className="block py-2 px-4 hover:bg-gray-700">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Card>
  );
};

export default Sidebar;