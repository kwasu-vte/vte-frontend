// * Admin Payments Management Page
// * Template page demonstrating StateRenderer + React Query pattern
// * This follows the same pattern as other admin pages

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent, DefaultEmptyComponent } from '@/components/shared/StateRenderer';
import { PaymentsTable } from '@/components/features/admin/PaymentsTable';
import { PaymentModal } from '@/components/features/admin/PaymentModal';
import { api } from '@/lib/api';
import { Payment, CreatePaymentPayload, UpdatePaymentPayload } from '@/lib/types';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { Plus, AlertTriangle, Download, DollarSign } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  // * React Query for data fetching - only run on client
  const {
    data: payments,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      // * No direct payments list API; derive from enrollments/payments context if added later
      return [] as Payment[];
    },
    enabled: typeof window !== 'undefined', // * Only enable on client side
  });

  // * Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: async (_data: CreatePaymentPayload) => {
      // * Not supported in current api.ts; no-op placeholder
      return {} as Payment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      console.error('Error creating payment:', error);
    },
  });

  // * Update payment mutation
  const updatePaymentMutation = useMutation({
    mutationFn: async (_data: UpdatePaymentPayload) => {
      if (!selectedPayment) throw new Error('No payment selected');
      // * Not supported; no-op placeholder
      return selectedPayment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      setIsEditModalOpen(false);
      setSelectedPayment(null);
    },
    onError: (error) => {
      console.error('Error updating payment:', error);
    },
  });

  // * Delete payment mutation
  const deletePaymentMutation = useMutation({
    mutationFn: async (_paymentId: string) => {
      // * Not supported; no-op placeholder
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      setIsDeleteModalOpen(false);
      setSelectedPayment(null);
    },
    onError: (error) => {
      console.error('Error deleting payment:', error);
    },
  });

  // * Handle create payment
  const handleCreatePayment = async (data: CreatePaymentPayload | UpdatePaymentPayload) => {
    setIsSubmitting(true);
    try {
      await createPaymentMutation.mutateAsync(data as CreatePaymentPayload);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Handle edit payment
  const handleEditPayment = async (data: CreatePaymentPayload | UpdatePaymentPayload) => {
    setIsSubmitting(true);
    try {
      await updatePaymentMutation.mutateAsync(data as UpdatePaymentPayload);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Handle delete payment
  const handleDeletePayment = async () => {
    if (!selectedPayment) return;
    setIsSubmitting(true);
    try {
      await deletePaymentMutation.mutateAsync(selectedPayment.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Open create modal
  const openCreateModal = () => {
    setSelectedPayment(null);
    setIsCreateModalOpen(true);
  };

  // * Open edit modal
  const openEditModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsEditModalOpen(true);
  };

  // * Open delete modal
  const openDeleteModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDeleteModalOpen(true);
  };

  // * Close all modals
  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedPayment(null);
  };

  // * Export payments data
  const handleExportPayments = () => {
    // TODO: Implement payments export functionality
    console.log('Export payments data');
  };

  // * Calculate total amount
  const totalAmount = payments?.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) || 0;

  return (
    <div className="space-y-6">
      {/* * Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Payments Management</h1>
          <p className="text-neutral-600 mt-1">
            Track and manage payment records
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            color="secondary"
            startContent={<Download className="w-4 h-4" />}
            onClick={handleExportPayments}
          >
            Export Data
          </Button>
          <Button
            color="primary"
            startContent={<Plus className="w-4 h-4" />}
            onClick={openCreateModal}
          >
            Add Payment
          </Button>
        </div>
      </div>

      {/* * Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Amount</p>
              <p className="text-2xl font-bold text-neutral-900">
                ₦{totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Payments</p>
              <p className="text-2xl font-bold text-neutral-900">
                {payments?.length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Average Payment</p>
              <p className="text-2xl font-bold text-neutral-900">
                ₦{payments?.length ? (totalAmount / payments.length).toLocaleString() : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* * Payments Table with StateRenderer */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <StateRenderer
          data={payments}
          isLoading={isLoading}
          error={error}
          loadingComponent={
            <div className="p-6">
              <DefaultLoadingComponent />
            </div>
          }
          errorComponent={
            <div className="p-6">
              <DefaultErrorComponent 
                error={error!} 
                onRetry={() => refetch()} 
              />
            </div>
          }
          emptyComponent={
            <div className="p-6">
              <DefaultEmptyComponent 
                message="No payment records found. Add your first payment to get started."
                actionButton={
                  <Button
                    color="primary"
                    startContent={<Plus className="w-4 h-4" />}
                    onClick={openCreateModal}
                  >
                    Add Payment
                  </Button>
                }
              />
            </div>
          }
        >
          {(data) => (
            <PaymentsTable
              payments={data}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              onView={(payment) => {
                // TODO: Navigate to payment details page
                console.log('View payment:', payment);
              }}
              onProcessRefund={(payment) => {
                // TODO: Process refund
                console.log('Process refund:', payment);
              }}
            />
          )}
        </StateRenderer>
      </div>

      {/* * Create Payment Modal */}
      <PaymentModal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        onSubmit={handleCreatePayment}
        isLoading={isSubmitting}
      />

      {/* * Edit Payment Modal */}
      <PaymentModal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        onSubmit={handleEditPayment}
        payment={selectedPayment}
        isLoading={isSubmitting}
      />

      {/* * Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        size="md"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold">Delete Payment</h2>
            </div>
          </ModalHeader>
          <ModalBody>
            <p className="text-neutral-600">
              Are you sure you want to delete this payment record? 
              This action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onClick={closeModals}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onClick={handleDeletePayment}
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              Delete Payment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* * Debug Information */}
      <div className="bg-neutral-50 p-4 rounded-lg">
        <h3 className="font-semibold text-neutral-900 mb-2">Debug Information</h3>
        <div className="text-sm text-neutral-600 space-y-1">
          <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {error ? error.message : 'None'}</p>
          <p><strong>Data Count:</strong> {payments?.length || 0}</p>
          <p><strong>Query Key:</strong> [&apos;payments&apos;]</p>
          <p><strong>Mutations:</strong> Create: {createPaymentMutation.isPending ? 'Pending' : 'Idle'}, Update: {updatePaymentMutation.isPending ? 'Pending' : 'Idle'}, Delete: {deletePaymentMutation.isPending ? 'Pending' : 'Idle'}</p>
        </div>
      </div>
    </div>
  );
}
