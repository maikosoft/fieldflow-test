import React, { useEffect, useState } from 'react';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { Button, Textarea, Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { useQuery, useMutation } from 'convex/react'
import { api } from "../../convex/_generated/api";
import { Id } from '../../convex/_generated/dataModel'
import Note from '@/components/Note';

export const Route = createFileRoute('/orgs_/$orgId/contacts/$contactId')({
    component: ContactRouteComponent,
})
  
function ContactRouteComponent() {
    const { orgId, contactId } = Route.useParams()
    const navigation = useNavigate();
    const organization = useQuery(api.organizations.getOrganizationById, { id: orgId as Id<"organizations"> });
    const contact = useQuery(api.contacts.getContactById, { id: contactId as Id<"contacts"> });
    const notes = useQuery(api.notes.getNotesByContactId, { contactId: contactId as Id<"contacts"> });
    const mutation = useMutation(api.notes.createNote);
    const [currentNote, setCurrentNote] = useState<string>("");

    const isAdmin = useQuery(api.auth.hasRole, { orgId: orgId as Id<"organizations">, role: "admin" });
    const isMember = useQuery(api.auth.hasRole, { orgId: orgId as Id<"organizations">, role: "member" });
    if (isAdmin== false && isMember == false) {
        // redirect to /orgs
        navigation({ to: '/' });
    }

    const handleAddNote = async () => {        
        if (!currentNote) return;
        try {
          await mutation({ contactId: contactId as Id<"contacts">, content: currentNote });
          setCurrentNote("");
        } catch (error) {
          console.error("Failed to create note");
          return;
        }
    };

    
    return (
      <>
        <div className="lg:flex lg:items-center lg:justify-between">
          
          <div className="min-w-0 flex-1">
            <Breadcrumbs key="lg" size="lg">
              <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to="/orgs/$orgId" params={{ orgId }}>Organization</Link></BreadcrumbItem>
              <BreadcrumbItem>Contact</BreadcrumbItem>
                
            </Breadcrumbs>
              <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">{organization?.name}</h2>
          </div>
        </div>
        <div className="flex bg-white shadow-md rounded-lg p-4 mt-5 h-3/5" style={{ height: '80vh' }}>
          {/* left side */}
          <div className="flex-col mb-4 w-1/2">
            <h3 className="text-lg font-semibold">Contact Details</h3>
            <div className="flex ml-4 mt-4">
              <div className="flex-1">Name:</div>
              <div className="flex-1 ml-2">{contact?.firstName} {contact?.lastName}</div>
            </div>
            <div className="flex ml-4 mt-4">
              <div className="flex-1">Email:</div>
              <div className="flex-1 ml-2">{contact?.email}</div>
            </div>
            <div className="flex ml-4 mt-4">
              <div className="flex-1">Phone:</div>
              <div className="flex-1 ml-2">{contact?.phone}</div>
            </div>
          </div>
          {/* right side */}
          <div className="flex-col mb-4 w-1/2 ml-4">
            <h3 className="text-lg font-semibold">Notes</h3>
            <div className="flex-col  mt-4 overflow-y-auto" style={{ height: '50vh' }}>
              {notes && notes.length > 0 && notes.map((note) => (
                <Note 
                  key={note.id} 
                  note={{ 
                    content: note.content, 
                    createdAt: note.createdAt, 
                    createdBy: note.createdBy 
                  }} 
                />
              ))}
            </div>
            {/* Add a note */}
            <div className="mt-4">
              <Textarea 
                className="max-w" 
                label="Write a note for this contact" 
                placeholder="Enter your note" 
                maxRows={2}
                onChange={(e) => setCurrentNote(e.target.value)}
                value={currentNote}
              />
              <Button 
                className="mt-2 float-right" 
                color="primary" 
                onPress={() => handleAddNote()}>Add Note</Button>
            </div>
          </div>
    
        </div>
      </>
  )
}
