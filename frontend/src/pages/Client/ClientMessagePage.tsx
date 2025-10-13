import Header from "@/components/layout/Header";
import { MessagingInterface } from "@/components/messaging/MessagingInterface";


function ClientMessagePage() {
    const clientNav = [
        { label: "Homepage", href: "/clienthomepage" },
        { label: "Find Jobs", href: "/jobs" },
        { label: "Applications", href: "/applications" },
        { label: "Profile", href: "/clientprofile" },
    ];
    return (
        <>
            <Header navItems={clientNav} />
        <MessagingInterface />
        </>
    );
}

export default ClientMessagePage;