export const dynamic = 'force-dynamic';

import { QRDistributionTracker } from '@/components/features/admin/QRDistributionTracker';

export default function AdminQrDistributionPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-neutral-900">QR Distribution</h1>
				<p className="text-neutral-600 mt-1">Track QR code distribution to mentors.</p>
			</div>
			<div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
				<QRDistributionTracker />
			</div>
		</div>
	);
}


