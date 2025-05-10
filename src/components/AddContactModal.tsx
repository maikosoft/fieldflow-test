import React from 'react';
import { Modal, ModalContent, ModalHeader, 
    ModalBody, Button, Form, Input } from '@heroui/react';
import { Id } from '../../convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { api } from "../../convex/_generated/api";

interface AddContactModalProps {
    orgId: Id<"organizations">;
    isOpen: boolean;
    onClose: () => void;
    success: () => void;
    error: () => void;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ orgId, isOpen, onClose, success, error }) => {
    const mutation = useMutation(api.contacts.createContact);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const data = Object.fromEntries(new FormData(e.currentTarget));

        try {
            await mutation({
                orgId: orgId,
                firstName: data.firstName as string,
                lastName: data.lastName as string,
                email: data.email as string,
                phone: data.phone as string,
                
            })
            success(); // Call the success function passed as a prop
            onClose(); // Close the modal
        } catch (e) {
            console.error("Failed to create contact", e);
            error(); // Call the error function passed as a prop
            return;
        }
        
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} size="2xl" onClose={onClose}>
        <ModalContent>
              <ModalHeader className="flex flex-col gap-1">Add new contact</ModalHeader>
              <ModalBody>
                <Form className="w-full max-w-xl mb-3" onSubmit={onSubmit}>
                    <Input
                        isRequired
                        errorMessage="Please enter your first name"
                        label="First Name"
                        labelPlacement="outside"
                        name="firstName"
                        placeholder="Enter your first name"
                        type="text"
                    />
                    <Input
                        isRequired
                        errorMessage="Please enter your last name"
                        label="Last Name"
                        labelPlacement="outside"
                        name="lastName"
                        placeholder="Enter your last name"
                        type="text"
                    />
                    <Input
                        errorMessage="Please enter a valid email"
                        label="Email"
                        labelPlacement="outside"
                        name="email"
                        placeholder="Enter your email"
                        type="email"
                    />
                    <Input
                        label="Phone"
                        labelPlacement="outside"
                        name="phone"
                        placeholder="Enter your phone number"
                        type="tel"
                    />
                    {/* button to right */}
                    <div className="flex w-full justify-end align-end">
                        <Button type="submit" color="primary" className="mt-4">
                            Add Contact
                        </Button>
                    </div>
                    {/* <Button type="submit" color="primary">
                        Add Contact
                    </Button> */}
                </Form>
              </ModalBody>
        </ModalContent>
      </Modal>
    );
};

export default AddContactModal;