// * Payment Modal Component
// * Handles creating and editing payment records
// * Follows the same pattern as other modal components

'use client';

import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react';
import { Payment, CreatePaymentPayload, UpdatePaymentPayload } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePaymentPayload | UpdatePaymentPayload) => void;
  payment?: Payment | null;
  isLoading?: boolean;
}

export function PaymentModal({
  isOpen,
  onClose,
  onSubmit,
  payment,
  isLoading = false
}: PaymentModalProps) {
  const [formData, setFormData] = useState({
    student_id: '',
    amount: '',
    payment_method: '',
    status: 'completed',
    transaction_id: '',
    notes: ''
  });

  // * Fetch students for the student selection
  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await api.getUsers({ role: 'Student' });
      return response.data;
    },
  });

  // * Reset form when modal opens/closes or payment changes
  useEffect(() => {
    if (isOpen) {
      if (payment) {
        setFormData({
          student_id: payment.student.id,
          amount: payment.amount.toString(),
          payment_method: payment.payment_method || '',
          status: payment.status,
          transaction_id: payment.transaction_id || '',
          notes: payment.notes || ''
        });
      } else {
        setFormData({
          student_id: '',
          amount: '',
          payment_method: '',
          status: 'completed',
          transaction_id: '',
          notes: ''
        });
      }
    }
  }, [isOpen, payment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.student_id || !formData.amount) {
      return;
    }

    const submitData: CreatePaymentPayload | UpdatePaymentPayload = {
      student_id: formData.student_id,
      amount: parseFloat(formData.amount),
      payment_method: formData.payment_method || null,
      status: formData.status as 'completed' | 'pending' | 'failed' | 'refunded',
      transaction_id: formData.transaction_id || null,
      notes: formData.notes || null
    };

    onSubmit(submitData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = formData.student_id && formData.amount && !isNaN(parseFloat(formData.amount));

  const statusOptions = [
    { key: 'completed', value: 'completed', label: 'Completed' },
    { key: 'pending', value: 'pending', label: 'Pending' },
    { key: 'failed', value: 'failed', label: 'Failed' },
    { key: 'refunded', value: 'refunded', label: 'Refunded' }
  ];

  const paymentMethodOptions = [
    { key: 'card', value: 'card', label: 'Credit/Debit Card' },
    { key: 'bank_transfer', value: 'bank_transfer', label: 'Bank Transfer' },
    { key: 'cash', value: 'cash', label: 'Cash' },
    { key: 'mobile_money', value: 'mobile_money', label: 'Mobile Money' },
    { key: 'other', value: 'other', label: 'Other' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">
            {payment ? 'Edit Payment' : 'Add Payment Record'}
          </h2>
          <p className="text-sm text-neutral-600">
            {payment ? 'Update payment information' : 'Record a new payment transaction'}
          </p>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Student"
                placeholder="Select a student"
                selectedKeys={formData.student_id ? [formData.student_id] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  handleInputChange('student_id', selectedKey);
                }}
                isRequired
                variant="bordered"
              >
                {students?.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.first_name} {student.last_name} ({student.email})
                  </SelectItem>
                )) || []}
              </Select>

              <Input
                label="Amount (₦)"
                placeholder="Enter amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                isRequired
                variant="bordered"
                startContent="₦"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Payment Method"
                placeholder="Select payment method"
                selectedKeys={formData.payment_method ? [formData.payment_method] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  handleInputChange('payment_method', selectedKey);
                }}
                variant="bordered"
              >
                {paymentMethodOptions.map((option) => (
                  <SelectItem key={option.key} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Status"
                placeholder="Select status"
                selectedKeys={formData.status ? [formData.status] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  handleInputChange('status', selectedKey);
                }}
                isRequired
                variant="bordered"
              >
                {statusOptions.map((option) => (
                  <SelectItem key={option.key} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <Input
              label="Transaction ID"
              placeholder="Enter transaction ID (optional)"
              value={formData.transaction_id}
              onChange={(e) => handleInputChange('transaction_id', e.target.value)}
              variant="bordered"
            />

            <Textarea
              label="Notes"
              placeholder="Add any additional notes (optional)"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              variant="bordered"
              minRows={3}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={onClose}
              isDisabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={isLoading}
              isDisabled={!isFormValid || isLoading}
            >
              {payment ? 'Update Payment' : 'Add Payment'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
