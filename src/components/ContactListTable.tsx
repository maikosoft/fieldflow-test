import { useState} from 'react';
import { Id } from '../../convex/_generated/dataModel';
import { useNavigate } from '@tanstack/react-router';
import {Table, TableHeader, TableColumn, TableBody, TableRow, 
    TableCell, Button, Alert, Input} from "@heroui/react";
import { useQuery } from 'convex/react';
import { api } from "../../convex/_generated/api";
import AddContactModal from './AddContactModal';




interface ContactListTableProps {
    orgId: string;
}
interface AlertInterface {
    type: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
    message: string;
}

function ContactListTable({ orgId }: ContactListTableProps) {
    const navigation = useNavigate();
    const contacts = useQuery(api.contacts.getContacts, { orgId: orgId as Id<"organizations"> });
    const [openAddContactModal, setOpenAddContactModal] = useState(false);
    const [showAlert, setShowAlert] = useState<AlertInterface>({ type: undefined, message: "" });
    const [contactsFiltered, setContactsFiltered] = useState(contacts);

    const handleShowAlert = (type: AlertInterface["type"], message: string) => {
        setShowAlert({ type, message });
        setTimeout(() => {
            setShowAlert({ type: undefined, message: '' });
        }, 3000);
    };

    const handleSearch = (searchTerm: string) => {
        if (searchTerm === "") {
            setContactsFiltered(contacts);
        } else {
            const filteredContacts = contacts?.filter((contact) =>
                contact.firstName.toLowerCase().includes(searchTerm) ||
                contact.lastName.toLowerCase().includes(searchTerm) ||
                contact.email.toLowerCase().includes(searchTerm) ||
                contact.phone.toLowerCase().includes(searchTerm)
            );
            setContactsFiltered(filteredContacts);
        }
    };
    if (contacts === undefined) {
        return <div>Loading...</div>
    }

    return (
        <div className="w-full p-4 bg-white rounded-lg shadow">
            {showAlert.type && (
                <Alert
                    className="mb-4"
                    color={showAlert.type}
                    title={showAlert.message}
                />
            )}
            <h2 className="text-xl font-semibold mb-4">Contacts:</h2>
            <div className="flex flex-row justify-between items-center mb-4">
                <div className="flex">
                    <Input
                        type="text"
                        placeholder="Search contacts..."
                        className="rounded-lg px-4 py-2"
                        onChange={(e) => {
                            const searchTerm = e.target.value.toLowerCase();
                            handleSearch(searchTerm);
                        }}
                    />
                </div>
                <div className="flex">
                    <Button
                        onPress={() => setOpenAddContactModal(true)}
                        className="mb-4"
                    >
                        Add Contact
                    </Button>
                </div>
            </div>
            <Table 
                isStriped 
                aria-label="Example static collection table" 
                onRowAction={(e) => navigation({ to: `/orgs/${orgId}/contacts/${e}` })}>
                <TableHeader>
                    <TableColumn>First Name</TableColumn>
                    <TableColumn>Last Name</TableColumn>
                    <TableColumn>Email</TableColumn>
                    <TableColumn>Phone</TableColumn>
                </TableHeader>
                <TableBody>
                    <>
                        {contactsFiltered && contactsFiltered.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-gray-500">
                                    No contacts found.
                                </TableCell>
                            </TableRow>
                        )}
                        {contactsFiltered && contactsFiltered.map((contact) => (
                            <TableRow key={contact._id} style={{cursor: 'pointer'}}>
                                <TableCell>{contact.firstName}</TableCell>
                                <TableCell>{contact.lastName}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell>{contact.phone}</TableCell>
                            </TableRow>
                        ))}
                    </>
                </TableBody>
            </Table>
            <AddContactModal 
                orgId={orgId as Id<"organizations">}
                isOpen={openAddContactModal} 
                onClose={() => setOpenAddContactModal(false)}
                success={() => handleShowAlert('success', 'Contact added successfully')}
                error={() => handleShowAlert('warning', 'Error adding contact')}
            />
        </div>
    )
};

export default ContactListTable;