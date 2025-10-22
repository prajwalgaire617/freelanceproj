import Header from "@/components/layout/Header";
import { MessagingInterface } from "@/components/messaging/MessagingInterface";
import { AGENCY_NAV_ITEMS } from "@/constants/navigation";


function AgencyMessagePage() {
    return (
        <>
            <Header navItems={AGENCY_NAV_ITEMS} showLogout />
            <MessagingInterface />
        </>
    );
}

export default AgencyMessagePage;
