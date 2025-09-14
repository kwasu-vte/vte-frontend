// * Student Payment Page
// * Shows payment history and allows new payments
// * Follows the same pattern as other pages with StateRenderer + React Query

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent, DefaultEmptyComponent } from '@/components/shared/StateRenderer';
import { api } from '@/lib/api';
import { Payment, Skill } from '@/lib/types';
import { Button, Card, CardBody, CardHeader, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem, Input } from '@nextui-org/react';
import { CreditCard, DollarSign, CheckCircle, XCircle, Clock, AlertCircle, ExternalLink } from 'lucide-react';

interface PaymentHistory {
  id: string;
  amount: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  reference: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentFormData {
  skillId: string;
  specialization: string | null;
  amount: number;
}

export default function StudentPaymentPage() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
    skillId: '',
    specialization: null,
    amount: 0
  });

  const queryClient = useQueryClient();

  // * React Query for data fetching - get payment history
  const {
    data: paymentHistory,
    isLoading: paymentsLoading,
    error: paymentsError,
    refetch: refetchPayments
  } = useQuery({
    queryKey: ['student-payments'],
    queryFn: async () => {
      // TODO: Implement student payment history endpoint
      // For now, return mock data
      return [
        {
          id: 'payment-1',
          amount: '50000',
          status: 'completed',
          paymentMethod: 'Paystack',
          reference: 'TXN123456789',
          description: 'Web Development Course Payment',
          createdAt: '2024-01-10T10:00:00Z',
          updatedAt: '2024-01-10T10:05:00Z'
        },
        {
          id: 'payment-2',
          amount: '30000',
          status: 'pending',
          paymentMethod: 'Paystack',
          reference: 'TXN987654321',
          description: 'Mobile Development Course Payment',
          createdAt: '2024-01-15T14:30:00Z',
          updatedAt: '2024-01-15T14:30:00Z'
        }
      ] as PaymentHistory[];
    },
  });

  // * React Query for available skills
  const {
    data: availableSkills,
    isLoading: skillsLoading,
    error: skillsError
  } = useQuery({
    queryKey: ['payment-skills'],
    queryFn: async () => {
      const response = await api.getSkills();
      return response.data;
    },
  });

  // * Make payment mutation
  const makePaymentMutation = useMutation({
    mutationFn: async (data: PaymentFormData) => {
      const response = await api.makePayment({
        course: data.skillId,
        specialization: data.specialization
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Redirect to payment gateway
      if (data.authorization_url) {
        window.open(data.authorization_url, '_blank');
      }
      setIsPaymentModalOpen(false);
      setPaymentForm({ skillId: '', specialization: null, amount: 0 });
    },
    onError: (error) => {
      console.error('Error initiating payment:', error);
    },
  });

  // * Handle payment form change
  const handleFormChange = (field: keyof PaymentFormData, value: string | number) => {
    setPaymentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // * Handle skill selection
  const handleSkillSelection = (skillId: string) => {
    const skill = availableSkills?.find(s => s.id === skillId);
    if (skill) {
      setPaymentForm(prev => ({
        ...prev,
        skillId,
        amount: 50000 // Default amount, should come from skill data
      }));
    }
  };

  // * Handle payment submission
  const handlePaymentSubmit = async () => {
    if (!paymentForm.skillId) return;
    
    setIsSubmitting(true);
    try {
      await makePaymentMutation.mutateAsync(paymentForm);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Close modals
  const closeModals = () => {
    setIsPaymentModalOpen(false);
    setPaymentForm({ skillId: '', specialization: null, amount: 0 });
  };

  // * Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'danger';
      case 'refunded': return 'default';
      default: return 'default';
    }
  };

  // * Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'refunded': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // * Calculate statistics
  const totalPaid = paymentHistory?.filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + parseFloat(payment.amount), 0) || 0;
  const pendingAmount = paymentHistory?.filter(p => p.status === 'pending')
    .reduce((sum, payment) => sum + parseFloat(payment.amount), 0) || 0;
  const totalTransactions = paymentHistory?.length || 0;

  return (
    <div className="space-y-6">
      {/* * Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Payment Center</h1>
          <p className="text-neutral-600 mt-1">
            Manage your course payments and view payment history
          </p>
        </div>
        <Button
          color="primary"
          startContent={<CreditCard className="w-4 h-4" />}
          onPress={() => setIsPaymentModalOpen(true)}
        >
          Make Payment
        </Button>
      </div>

      {/* * Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Paid</p>
              <p className="text-2xl font-bold text-neutral-900">
                ₦{totalPaid.toLocaleString()}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Pending</p>
              <p className="text-2xl font-bold text-neutral-900">
                ₦{pendingAmount.toLocaleString()}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Transactions</p>
              <p className="text-2xl font-bold text-neutral-900">{totalTransactions}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* * Payment History */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-900">Payment History</h2>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
          <StateRenderer
            data={paymentHistory}
            isLoading={paymentsLoading}
            error={paymentsError}
            loadingComponent={
              <div className="p-6">
                <DefaultLoadingComponent />
              </div>
            }
            errorComponent={
              <div className="p-6">
                <DefaultErrorComponent 
                  error={paymentsError!} 
                  onRetry={() => refetchPayments()} 
                />
              </div>
            }
            emptyComponent={
              <div className="p-6">
                <DefaultEmptyComponent 
                  message="No payment history found. Make your first payment to get started."
                  actionButton={
                    <Button
                      color="primary"
                      startContent={<CreditCard className="w-4 h-4" />}
                      onPress={() => setIsPaymentModalOpen(true)}
                    >
                      Make Payment
                    </Button>
                  }
                />
              </div>
            }
          >
            {(data) => (
              <div className="p-6 space-y-4">
                {data.map((payment) => (
                  <Card key={payment.id}>
                    <CardBody className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium text-neutral-900">
                              {payment.description}
                            </h3>
                            <Chip
                              color={getStatusColor(payment.status)}
                              variant="flat"
                              size="sm"
                              startContent={getStatusIcon(payment.status)}
                            >
                              {payment.status}
                            </Chip>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-neutral-600">Amount:</span>
                              <span className="ml-2 font-medium">₦{parseFloat(payment.amount).toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-neutral-600">Method:</span>
                              <span className="ml-2 font-medium">{payment.paymentMethod}</span>
                            </div>
                            <div>
                              <span className="text-neutral-600">Reference:</span>
                              <span className="ml-2 font-medium font-mono text-xs">{payment.reference}</span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-neutral-500">
                            Created: {new Date(payment.createdAt).toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          {payment.status === 'pending' && (
                            <Button
                              color="primary"
                              variant="light"
                              size="sm"
                              startContent={<ExternalLink className="w-4 h-4" />}
                              onPress={() => {
                                // TODO: Open payment gateway for pending payment
                                console.log('Complete payment:', payment.reference);
                              }}
                            >
                              Complete Payment
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </StateRenderer>
        </div>
      </div>

      {/* * Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={closeModals}
        size="md"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Make Payment</h2>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Select
                label="Select Course"
                placeholder="Choose a course to pay for"
                selectedKeys={paymentForm.skillId ? [paymentForm.skillId] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  handleSkillSelection(selectedKey);
                }}
                isRequired
              >
                {availableSkills?.map((skill) => (
                  <SelectItem key={skill.id} value={skill.id}>
                    {skill.title}
                  </SelectItem>
                )) || []}
              </Select>

              <Input
                label="Amount (₦)"
                type="number"
                value={paymentForm.amount.toString()}
                onChange={(e) => handleFormChange('amount', parseFloat(e.target.value) || 0)}
                isRequired
                isDisabled
                description="Amount is determined by the selected course"
              />

              <Input
                label="Specialization (Optional)"
                placeholder="Enter specialization if applicable"
                value={paymentForm.specialization || ''}
                onChange={(e) => handleFormChange('specialization', e.target.value)}
                description="Leave empty if not applicable"
              />

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Payment Information:</p>
                    <ul className="mt-1 space-y-1">
                      <li>• You will be redirected to Paystack for secure payment</li>
                      <li>• Payment is processed securely and encrypted</li>
                      <li>• You will receive a confirmation email after successful payment</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={closeModals}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              startContent={<CreditCard className="w-4 h-4" />}
              onPress={handlePaymentSubmit}
              isLoading={isSubmitting}
              isDisabled={!paymentForm.skillId || isSubmitting}
            >
              Proceed to Payment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* * Debug Information */}
      <div className="bg-neutral-50 p-4 rounded-lg">
        <h3 className="font-semibold text-neutral-900 mb-2">Debug Information</h3>
        <div className="text-sm text-neutral-600 space-y-1">
          <p><strong>Payments Loading:</strong> {paymentsLoading ? 'Yes' : 'No'}</p>
          <p><strong>Skills Loading:</strong> {skillsLoading ? 'Yes' : 'No'}</p>
          <p><strong>Payment History:</strong> {paymentHistory?.length || 0}</p>
          <p><strong>Available Skills:</strong> {availableSkills?.length || 0}</p>
          <p><strong>Selected Skill:</strong> {paymentForm.skillId || 'None'}</p>
        </div>
      </div>
    </div>
  );
}
