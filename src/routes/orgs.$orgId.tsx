import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useQuery } from 'convex/react';
import { api } from "../../convex/_generated/api";
import { Id } from '../../convex/_generated/dataModel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import ContactListTable from '../components/ContactListTable';
import Loading from '@/components/Loading';
import { Button, Breadcrumbs, BreadcrumbItem } from "@heroui/react";

export const Route = createFileRoute('/orgs/$orgId')({
    component: RouteComponent,
})

function RouteComponent() {
    const { orgId } = Route.useParams()
    const navigation = useNavigate();
    const organization = useQuery(api.organizations.getOrganizationById, { id: orgId as Id<"organizations"> });
    const isAdmin = useQuery(api.auth.hasRole, { orgId: orgId as Id<"organizations">, role: "admin" });
    const isMember = useQuery(api.auth.hasRole, { orgId: orgId as Id<"organizations">, role: "member" });

    if (isAdmin== false && isMember == false) {
        // redirect to /orgs
        navigation({ to: '/' });
    }


    if (organization === undefined) {
        return <Loading />;
    }

    

    return (
        <>
            <div className="lg:flex lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                <Breadcrumbs key="lg" size="lg">
                    <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
                    <BreadcrumbItem>Organization detail</BreadcrumbItem>
                   
                </Breadcrumbs>
                    <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">{organization?.name}</h2>
                    <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            <FontAwesomeIcon icon={fas.faLock} className="mr-1"/>
                        {organization?.role}
                        </div>
                        
                    </div>
                </div>
                <div className="mt-5 flex lg:mt-0 lg:ml-4">
                    <span className="hidden sm:block">
                        {isAdmin && (
                            <Button
                                onPress={() => navigation({ to: `/orgs/${orgId}/admin` })}
                                size="sm"
                            >
                                Admin
                            </Button>
                        )}
                    </span>
                </div>

            </div>
            <div className="mt-5">
                <ContactListTable orgId={orgId} />
            </div>
        </>
    )
}
