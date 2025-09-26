export const dynamic = 'force-dynamic';

export default function AdminQrPrintPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-neutral-900">Print QR Codes</h1>
				<p className="text-neutral-600 mt-1">Prepare print layouts for generated QR batches.</p>
			</div>
			<div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
				<p className="text-sm text-neutral-700">Use the QR generation history on the main QR Codes page to select batches to print. Printing UX to be wired to selected batches.</p>
			</div>
		</div>
	);
}


