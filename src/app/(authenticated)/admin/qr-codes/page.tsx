"use client";

import { useState } from 'react';
import { QRGenerationForm } from '@/components/features/admin/QRGenerationForm';
import { QRDistributionTracker } from '@/components/features/admin/QRDistributionTracker';

export default function AdminQrCodesPage() {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">QR Codes</h1>
        <p className="text-neutral-600 mt-1">Generate and track QR codes per group.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <QRGenerationForm onGroupSelected={(id) => setSelectedGroupId(id)} />
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <QRDistributionTracker selectedGroupId={selectedGroupId} />
        </div>
      </div>
    </div>
  );
}


