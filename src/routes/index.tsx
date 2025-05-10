import { createFileRoute, Link } from '@tanstack/react-router'
import {Card, CardHeader, CardFooter, Divider, Chip } from "@heroui/react";
import { useQuery } from 'convex/react';
import { api } from "../../convex/_generated/api";
import Loading from '@/components/Loading';


export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const organizations = useQuery(api.organizations.getOrganizations);
  
  if (organizations === undefined) {
    return <Loading />
  }

  return (
    <div className="p-2 flex flex-col gap-2 mx-auto ">
      <h3 className="text-2xl font-bold">Select your organization:</h3>
      <div className="grid grid-cols-2 gap-4">
      {organizations && organizations.length > 0 && organizations.map((org) => (
          <Card key={org._id}>
            <CardHeader>
              <Link to="/orgs/$orgId" params={{ orgId: org._id as string }}>
                <h3 className="text-xl font-bold">{org.name}</h3>
              </Link>
            </CardHeader>
            <Divider />
            <CardFooter>
              Role: <Chip size="sm">{org.role}</Chip>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}