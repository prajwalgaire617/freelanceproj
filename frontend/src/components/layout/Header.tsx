// import React from "react";

// const Header: React.FC = () => {
//     return (
//         <header className="border-b sticky top-0 bg-background/70 backdrop-blur-md z-50">
//             <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
//                 <h1 className="text-xl font-semibold text-primary">FreeLancePro</h1>
//                 <nav className="hidden md:flex gap-6 text-sm">
//                     <a href="#findwork" className="hover:text-primary">Find Work</a>
//                     <a href="#categories" className="hover:text-primary">Categories</a>
//                     <a href="#topfreelancers" className="hover:text-primary">Top Freelancers</a>
//                     <a href="#about" className="hover:text-primary">Messages</a>
//                 </nav>
//             </div>
//         </header>
//     );
// };

// export default Header;

import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { NovuInbox } from "../novu-inbox";
// import MessageNotification from "@/components/notifications/MessageNotification";
// import NotificationDropdown from "@/components/notifications/NotificationDropdown";

interface NavItem {
  label: string;
  href: string;
}

interface HeaderProps {
  navItems: NavItem[];
}

const Header: React.FC<HeaderProps> = ({ navItems }) => {
  const { user } = useAuth();
  
  return (
    <header className="border-b sticky top-0 bg-background/70 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        <h1 className="text-xl font-semibold text-primary">WorkLabs</h1>

        <nav className="hidden md:flex gap-6 text-sm items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
          
          {/* Notifications */}
          {user && (
            <div className="flex items-center gap-2">
              {/* <NotificationDropdown />
              <MessageNotification 
                userType={user.userType as "freelancer" | "client"}
              /> */}
              <NovuInbox />

            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
