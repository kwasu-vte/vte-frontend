// * Payments Table Component
// * Displays payment records in a table format with actions
// * Follows the same pattern as other table components

'use client';

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { Payment } from '@/lib/types';
import { MoreVertical, Edit, Trash2, Eye, DollarSign, RefreshCw } from 'lucide-react';

interface PaymentsTableProps {
  payments: Payment[];
  onEdit: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
  onView: (payment: Payment) => void;
  onProcessRefund: (payment: Payment) => void;
}

export function PaymentsTable({
  payments,
  onEdit,
  onDelete,
  onView,
  onProcessRefund
}: PaymentsTableProps) {
  const columns = [
    { key: 'student', label: 'Student' },
    { key: 'amount', label: 'Amount' },
    { key: 'method', label: 'Payment Method' },
    { key: 'status', label: 'Status' },
    { key: 'date', label: 'Date' },
    { key: 'actions', label: 'Actions' }
  ];

  const getStatusColor = (payment: Payment) => {
    switch (payment.status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      case 'refunded':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusText = (payment: Payment) => {
    return payment.status.charAt(0).toUpperCase() + payment.status.slice(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(numAmount);
  };

  return (
    <Table aria-label="Payments table">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key}>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={payments}>
        {(payment) => (
          <TableRow key={payment.id}>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-semibold text-neutral-900">
                  {payment.student.first_name} {payment.student.last_name}
                </span>
                <span className="text-sm text-neutral-500">{payment.student.email}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-bold text-green-600">
                  {formatAmount(payment.amount)}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium text-neutral-900">
                  {payment.payment_method || 'Unknown'}
                </span>
                <span className="text-sm text-neutral-500">
                  {payment.transaction_id || 'No transaction ID'}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <Chip
                color={getStatusColor(payment)}
                variant="flat"
                size="sm"
              >
                {getStatusText(payment)}
              </Chip>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium text-neutral-900">
                  {formatDate(payment.created_at)}
                </span>
                <span className="text-sm text-neutral-500">
                  {payment.updated_at !== payment.created_at ? 'Updated' : 'Created'}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Payment actions">
                  {[
                    <DropdownItem
                      key="view"
                      startContent={<Eye className="w-4 h-4" />}
                      onPress={() => onView(payment)}
                    >
                      View Details
                    </DropdownItem>,
                    <DropdownItem
                      key="edit"
                      startContent={<Edit className="w-4 h-4" />}
                      onPress={() => onEdit(payment)}
                    >
                      Edit Payment
                    </DropdownItem>,
                    ...(payment.status === 'completed' ? [
                      <DropdownItem
                        key="refund"
                        startContent={<RefreshCw className="w-4 h-4" />}
                        onPress={() => onProcessRefund(payment)}
                        className="text-warning"
                      >
                        Process Refund
                      </DropdownItem>
                    ] : []),
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                      startContent={<Trash2 className="w-4 h-4" />}
                      onPress={() => onDelete(payment)}
                    >
                      Delete Payment
                    </DropdownItem>
                  ]}
                </DropdownMenu>
              </Dropdown>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
