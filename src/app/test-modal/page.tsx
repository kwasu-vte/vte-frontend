'use client';

import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';

// * Minimal test page to isolate modal issues
export default function TestModalPage() {
  console.log('🔧 TestModalPage component mounted');

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const openModal = () => {
    console.log('🎯 Opening modal...');
    setIsModalOpen(true);
    console.log('🎯 Modal state set to true');
  };

  const closeModal = () => {
    console.log('🎯 Closing modal...');
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Modal Test Page</h1>
      <p>This page tests if NextUI modals work correctly.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={openModal}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Open Modal
        </button>
      </div>

      {/* Simple Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        size="md"
      >
        <ModalContent>
          <ModalHeader>
            <h2>Test Modal</h2>
          </ModalHeader>
          <ModalBody>
            <p>This is a test modal. If you can see this, modals are working!</p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onClick={closeModal}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
