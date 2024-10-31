"use client"
import React from 'react'
import { useDisclosure, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, } from '@nextui-org/react';
import Cookies from 'js-cookie';

import { FadeInFromBottom } from '../components/FadeInFromBottom';

const CreateStaffModal = ({ isOpen, onOpenChange}) => {
    const [message, setMessage] = React.useState({
        "error": false,
        "message": ""
    });
    const [staffDetails, setStaffDetails] = React.useState({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    })

    async function handleSubmit() {
        console.log(staffDetails);
        try {
            let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/register_staff`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${Cookies.get('access_token')}`
                },
                body: JSON.stringify(staffDetails)
            });

            if (res.ok) {
                console.log('Staff created successfully');
                setMessage({
                    "error": false,
                    "message": "Staff created successfully"
                });
                return;
            }
            setMessage({
                "error": true,
                "message": "An Unknown Error Occured"
            });
        } catch (err) {
            console.error(err);
            setMessage({
                "error": true,
                "message": "An Unknown Error Occured"
            });
        }
    }

    function handleChange(e) {
        console.log(e.target.name, e.target.value);
        setStaffDetails({
            ...staffDetails,
            [e.target.name]: e.target.value
        })
    }

    return (
        <FadeInFromBottom>
            <Modal
                backdrop="opaque" 
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                radius="lg"
                classNames={{
                    backdrop: "bg-[#00000080] backdrop-opacity-40",
                    base: "border-[#292f46] bg-[#D7ECD7]",
                    header: "border-b-[1px] border-[#292f46]",
                    footer: "border-t-[1px] border-[#292f46]",
                    closeButton: "hover:bg-white/5 active:bg-white/10",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <h1 className=" font-extrabold text-[#379E37] mb-4 text-xl">
                                    Create Staff
                                </h1>
                            </ModalHeader>
                            <ModalBody>
                                {message.error && <p className="text-[#ea3a3a] mb-4">{message.message}</p>}
                                {!(message.error) && (message.message != "") && <p className="text-green-500 mb-4">{message.message}</p>}
                                <input onChange={handleChange} type="text" name="first_name" placeholder="First Name" className="w-full p-2 mb-4 rounded-md" />
                                <input onChange={handleChange} type="text" name="last_name" placeholder="Last Name" className="w-full p-2 mb-4 rounded-md" />
                                <input onChange={handleChange} type="email" name="email" placeholder="Email" className="w-full p-2 mb-4 rounded-md" />
                                <input onChange={handleChange} type="password" name="password" placeholder="Password" className="w-full p-2 mb-4 rounded-md" />
                            </ModalBody>
                            <ModalFooter>
                                <button className='p-2 px-4 rounded-md hover:text-red-500 duration-500' onClick={onClose}>
                                    Close
                                </button>
                                <button onClick={handleSubmit} className="bg-green-600 duration-500 hover:bg-green-500 text-white p-2 px-4 rounded-md" >
                                    Submit
                                </button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </FadeInFromBottom>
    )
}

export default CreateStaffModal;