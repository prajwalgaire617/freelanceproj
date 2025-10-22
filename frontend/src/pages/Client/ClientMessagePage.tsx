import Header from "@/components/layout/Header";
import { MessagingInterface } from "@/components/messaging/MessagingInterface";
import { CLIENT_NAV_ITEMS } from "@/constants/navigation";


function ClientMessagePage() {
    return (
        <>
            <Header navItems={CLIENT_NAV_ITEMS} showLogout />
        <MessagingInterface />
        </>
    );
}

export default ClientMessagePage;