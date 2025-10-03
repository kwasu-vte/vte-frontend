"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import QRCodeStyling, {
  DrawType,
  TypeNumber,
  Mode,
  ErrorCorrectionLevel,
  DotType,
  CornerSquareType,
  CornerDotType,
  Options
} from 'qr-code-styling';
import { GroupQrCode } from '@/lib/types';

/**
 * * QR Code Print Page
 * Printable page for individual QR codes with group and instructor information.
 * Gets QR code data from session storage.
 */
export default function QRCodePrintPage() {
  const router = useRouter();
  const qrRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState(false);
  const [qrCodeInstance, setQrCodeInstance] = useState<QRCodeStyling | null>(null);
  const [qrCodeData, setQrCodeData] = useState<GroupQrCode | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // * Load QR code data from session storage
  useEffect(() => {
    const storedData = sessionStorage.getItem('qrCodePrintData');
    if (storedData) {
      try {
        const qrData = JSON.parse(storedData) as GroupQrCode;
        setQrCodeData(qrData);
      } catch (error) {
        console.error('Failed to parse QR code data:', error);
        router.push('/admin/qr-codes');
      }
    } else {
      router.push('/admin/qr-codes');
    }
    setIsLoading(false);
  }, [router]);

  // * Generate client-side QR code as fallback
  useEffect(() => {
    if (useFallback && qrCodeData && qrRef.current) {
      const qrCode = new QRCodeStyling({
        width: 256,
        height: 256,
        type: 'svg' as DrawType,
        data: qrCodeData.token,
        image: '/kwasulogo.png',
        margin: 10,
        qrOptions: {
          typeNumber: 0 as TypeNumber,
          mode: 'Byte' as Mode,
          errorCorrectionLevel: 'Q' as ErrorCorrectionLevel
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.4,
          margin: 20,
          crossOrigin: 'anonymous',
        },
        dotsOptions: {
          color: '#000000',
          type: 'extra-rounded' as DotType
        },
        backgroundOptions: {
          color: '#FFFFFF',
        },
        cornersSquareOptions: {
          color: '#000000',
          type: 'extra-rounded' as CornerSquareType,
        },
        cornersDotOptions: {
          color: '#000000',
          type: 'dot' as CornerDotType,
        }
      });

      // * Clear previous QR code
      qrRef.current.innerHTML = '';
      
      // * Append QR code to container
      qrCode.append(qrRef.current);
      setQrCodeInstance(qrCode);

      return () => {
        if (qrRef.current) {
          qrRef.current.innerHTML = '';
        }
      };
    }
  }, [useFallback, qrCodeData]);

  // * Handle image load error - fallback to client-side generation
  const handleImageError = () => {
    setUseFallback(true);
  };

  // * Construct server QR code image URL
  const getServerQRImageUrl = () => {
    if (!qrCodeData) return '';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://timadey.alwaysdata.net';
    return `${baseUrl}/${qrCodeData.path}`;
  };

  // * Auto-print when page loads
  useEffect(() => {
    if (qrCodeData && !isLoading) {
      // * Small delay to ensure content is rendered
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [qrCodeData, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading QR code information...</p>
        </div>
      </div>
    );
  }

  if (!qrCodeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">QR Code Not Found</h2>
          <p className="text-neutral-600">No QR code data available.</p>
        </div>
      </div>
    );
  }

  const expiresAt = new Date(qrCodeData.expires_at);
  const isExpired = expiresAt < new Date();

  return (
    <div className="min-h-screen bg-white print:bg-white">
      {/* * Print styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0.25in;
            size: A4;
          }
          
          /* * Hide layout elements during print */
          body { 
            margin: 0; 
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          /* * Hide sidebar, header, and other layout elements */
          [data-sidebar],
          [data-header],
          nav,
          header:not(.print-content),
          aside,
          .sidebar,
          .header,
          .notification-container {
            display: none !important;
          }
          
          /* * Make main content full width */
          main {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: none !important;
          }
          
          /* * Hide print button and other UI elements */
          .print\\:hidden { display: none !important; }
          .print\\:text-black { color: black !important; }
          .print\\:bg-white { background: white !important; }
          .print\\:bg-gray-100 { background: #f3f4f6 !important; }
          .print\\:border { border: 1px solid #000 !important; }
          .print\\:border-black { border-color: black !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:p-2 { padding: 0.5rem !important; }
          .print\\:p-3 { padding: 0.75rem !important; }
          .print\\:m-0 { margin: 0 !important; }
          .print\\:mb-2 { margin-bottom: 0.5rem !important; }
          .print\\:mb-3 { margin-bottom: 0.75rem !important; }
          .print\\:mt-2 { margin-top: 0.5rem !important; }
          .print\\:text-xs { font-size: 0.75rem !important; }
          .print\\:text-sm { font-size: 0.875rem !important; }
          .print\\:text-base { font-size: 1rem !important; }
          .print\\:text-lg { font-size: 1.125rem !important; }
          .print\\:text-xl { font-size: 1.25rem !important; }
          .print\\:font-bold { font-weight: 700 !important; }
          .print\\:font-semibold { font-weight: 600 !important; }
          .print\\:text-center { text-align: center !important; }
          .print\\:w-full { width: 100% !important; }
          .print\\:h-full { height: 100% !important; }
          .print\\:w-64 { width: 16rem !important; }
          .print\\:h-64 { height: 16rem !important; }
          .print\\:flex { display: flex !important; }
          .print\\:flex-col { flex-direction: column !important; }
          .print\\:items-center { align-items: center !important; }
          .print\\:justify-center { justify-content: center !important; }
          .print\\:space-y-2 > * + * { margin-top: 0.5rem !important; }
          .print\\:space-y-3 > * + * { margin-top: 0.75rem !important; }
          .print\\:break-inside-avoid { break-inside: avoid !important; }
          .print\\:rounded { border-radius: 0.25rem !important; }
          .print\\:border-t { border-top: 1px solid #000 !important; }
          .print\\:bg-gray-50 { background: #f9fafb !important; }
        }
      `}</style>

      {/* * Header with print button (hidden when printing) */}
      <div className="print:hidden bg-gray-50 border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">QR Code Print View</h1>
            <p className="text-gray-600">Token: {qrCodeData.token}</p>
          </div>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🖨️ Print QR Code
          </button>
        </div>
      </div>

      {/* * Main print content */}
      <div className="max-w-4xl mx-auto p-8 print:p-2">
        <div className="bg-white print:bg-white border border-gray-200 print:border rounded-lg print:shadow-none shadow-lg p-8 print:p-2">
          
          {/* * Header Section */}
          <div className="text-center mb-6 print:mb-2 space-y-2 print:space-y-2">
            <h1 className="text-3xl print:text-xl font-bold text-gray-900 print:text-black">
              VTE Practical Session QR Code
            </h1>
            <div className="w-24 h-1 bg-blue-600 mx-auto print:bg-black"></div>
          </div>

          {/* * QR Code Section - Main Focus */}
          <div className="flex flex-col items-center justify-center space-y-4 print:space-y-2 mb-6 print:mb-3">
            <div className="bg-white print:bg-white border-2 border-gray-300 print:border-black p-6 print:p-2 rounded-lg">
              {/* * Large QR Code with Logo */}
              {!useFallback ? (
                <img 
                  src={getServerQRImageUrl()}
                  alt={`QR Code for ${qrCodeData.token}`}
                  className="w-64 h-64 print:w-64 print:h-64 object-contain"
                  onError={handleImageError}
                  onLoad={() => console.log('Server QR code loaded successfully')}
                />
              ) : (
                <div 
                  ref={qrRef}
                  className="w-64 h-64 print:w-64 print:h-64 flex items-center justify-center"
                />
              )}
            </div>
            
            {/* * Status Badge */}
            <div className={`px-4 py-2 rounded-full text-sm print:text-xs font-semibold ${
              isExpired 
                ? 'bg-red-100 print:bg-gray-100 text-red-800 print:text-black border border-red-300 print:border-black' 
                : 'bg-green-100 print:bg-gray-100 text-green-800 print:text-black border border-green-300 print:border-black'
            }`}>
              {isExpired ? 'EXPIRED' : 'ACTIVE'}
            </div>
          </div>

          {/* * Information Section - Compact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2 print:grid-cols-2">
            <div className="bg-gray-50 print:bg-gray-100 p-4 print:p-2 rounded-lg print:border">
              <h3 className="text-lg print:text-sm font-semibold text-gray-900 print:text-black mb-3 print:mb-2">
                Session Details
              </h3>
              
              <div className="space-y-2 print:space-y-1 text-sm print:text-xs">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700 print:text-black">QR Code ID:</span>
                  <span className="text-gray-900 print:text-black">{qrCodeData.id}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700 print:text-black">Group ID:</span>
                  <span className="text-gray-900 print:text-black">{qrCodeData.skill_group_id}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700 print:text-black">Points per Scan:</span>
                  <span className="text-gray-900 print:text-black">{qrCodeData.mark_value}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700 print:text-black">Expires:</span>
                  <span className="text-gray-900 print:text-black">
                    {expiresAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* * Instructions */}
            <div className="bg-blue-50 print:bg-gray-100 p-4 print:p-2 rounded-lg print:border">
              <h3 className="text-lg print:text-sm font-semibold text-blue-900 print:text-black mb-3 print:mb-2">
                Instructions
              </h3>
              <div className="text-sm print:text-xs text-blue-800 print:text-black space-y-1 print:space-y-1">
                <p>• Students scan this QR code during practical sessions</p>
                <p>• Each scan awards {qrCodeData.mark_value} points</p>
                <p>• QR code expires on {expiresAt.toLocaleDateString()}</p>
                <p>• Keep this QR code visible to students</p>
              </div>
            </div>
          </div>

          {/* * Footer */}
          <div className="mt-6 print:mt-2 pt-4 print:pt-2 border-t border-gray-200 print:border-black">
            <div className="text-center text-xs print:text-xs text-gray-500 print:text-black">
              <p>Generated on {new Date().toLocaleDateString()} • VTE System</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}