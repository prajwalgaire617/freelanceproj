import Header from "@/components/layout/Header";
import { MessagingInterface } from "@/components/messaging/MessagingInterface";


function MessagePage() {
    const freelancerNav = [
        { label: "Homepage", href: "/freelancerhomepage" },
        { label: "Find Jobs", href: "/jobs" },
        { label: "Applications", href: "/applications" },
        { label: "Messages", href: "/messages" },
        { label: "Profile", href: "/freelancerprofile" },
    ];
    return (
        <>
            <Header navItems={freelancerNav} showLogout />
            <MessagingInterface />
        </>
    );
}

export default MessagePage;