import Header from "@/components/layout/Header";
import { MessagingInterface } from "@/components/messaging/MessagingInterface";
import { FREELANCER_NAV_ITEMS } from "@/constants/navigation";


function MessagePage() {
    return (
        <>
            <Header navItems={FREELANCER_NAV_ITEMS} showLogout />
            <MessagingInterface />
        </>
    );
}

export default MessagePage;