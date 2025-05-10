import React, { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Form, Input, Button, Alert } from "@heroui/react";
import { useMutation, useQuery } from 'convex/react';
import { api } from "../../convex/_generated/api";
import { Id } from '../../convex/_generated/dataModel';

export const Route = createFileRoute('/orgs_/$orgId/admin')({
  component: OrganizationAdminRouteComponent,
})

interface AlertInterface {
  type: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
  message: string;
}


function OrganizationAdminRouteComponent() {
  const { orgId } = Route.useParams()
  const navigation = useNavigate();
  const organization = useQuery(api.organizations.getOrganizationById, { id: orgId as Id<"organizations"> });
  const mutation = useMutation(api.organizations.updateOrganization);
  const isAdmin = useQuery(api.auth.hasRole, { orgId: orgId as Id<"organizations">, role: "admin" });
  const [orgName, setOrgName] = useState<string>(organization?.name || "");
  const [showAlert, setShowAlert] = useState<AlertInterface>({ type: undefined, message: "" });

  if (!isAdmin) {
    // redirect to /orgs
    navigation({ to: '/' });
  }


  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      await mutation({ id: orgId as Id<"organizations">, name: data["organizationName"] as string });
      setShowAlert({ type: "success", message: "Organization updated successfully" });
      setTimeout(() => {
        setShowAlert({ type: undefined, message: '' });
        navigation({ to: `/orgs/${orgId}` });
      }
      , 1000);
    } catch (error) {
      setShowAlert({ type: 'danger', message: 'Failed to update organization' });
      return;
    }
  }

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
              <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Admin</h2>
          </div>
      </div>
      <div className="mt-5">
        {showAlert.type && (
          <Alert
            className="mb-4"
            color={showAlert.type}
            title={showAlert.message}
          />
        )}
        <Form className="w-full max-w-lg" onSubmit={onSubmit}>
          <Input
            isRequired
            errorMessage="Please enter a valid organization Name"
            label="Organization name"
            labelPlacement="outside"
            name="organizationName"
            placeholder="Enter organization name"
            type="text"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            size="lg"
          />
          <Button type="submit" color="primary" className="mt-4">
            Save
          </Button>
        </Form>
      </div>  
    </>
  )  
}
