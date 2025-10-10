"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Printer } from 'lucide-react';
import QRCodeStyling, {
  DrawType,
  TypeNumber,
  Mode,
  ErrorCorrectionLevel,
  DotType,
  CornerSquareType,
  CornerDotType,
} from 'qr-code-styling';
import { GroupQrCode } from '@/lib/types';

interface PrintConfig {
  qrCodeData: GroupQrCode;
  quantity: number;
  timestamp: string;
}

/**
 * * Dynamic QR Code Print Page
 * Printable page for multiple QR codes with dynamic grid layout.
 * Gets print configuration from session storage and arranges QR codes optimally.
 */
export default function DynamicQRCodePrintPage() {
  const router = useRouter();
  const qrRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [useFallback, setUseFallback] = useState(false);
  const [qrCodeInstances, setQrCodeInstances] = useState<QRCodeStyling[]>([]);
  const [printConfig, setPrintConfig] = useState<PrintConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // * Load print configuration from session storage
  useEffect(() => {
    const storedConfig = sessionStorage.getItem('qrCodePrintConfig');
    if (storedConfig) {
      try {
        const config = JSON.parse(storedConfig) as PrintConfig;
        setPrintConfig(config);
      } catch (error) {
        console.error('Failed to parse print configuration:', error);
        router.push('/admin/qr-codes');
      }
    } else {
      router.push('/admin/qr-codes');
    }
    setIsLoading(false);
  }, [router]);

  // * Generate client-side QR codes as fallback
  useEffect(() => {
    if (useFallback && printConfig) {
      const instances: QRCodeStyling[] = [];
      
      for (let i = 0; i < printConfig.quantity; i++) {
        const qrRef = qrRefs.current[i];
        if (qrRef) {
          const qrCode = new QRCodeStyling({
            width: 200,
            height: 200,
            type: 'svg' as DrawType,
            data: printConfig.qrCodeData.token,
            image: '/kwasulogo.png',
            margin: 8,
            qrOptions: {
              typeNumber: 0 as TypeNumber,
              mode: 'Byte' as Mode,
              errorCorrectionLevel: 'Q' as ErrorCorrectionLevel
            },
            imageOptions: {
              hideBackgroundDots: true,
              imageSize: 0.3,
              margin: 15,
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
          qrRef.innerHTML = '';
          
          // * Append QR code to container
          qrCode.append(qrRef);
          instances.push(qrCode);
        }
      }
      
      setQrCodeInstances(instances);

      return () => {
        qrRefs.current.forEach(ref => {
          if (ref) {
            ref.innerHTML = '';
          }
        });
      };
    }
  }, [useFallback, printConfig]);

  // * Handle image load error - fallback to client-side generation
  const handleImageError = () => {
    setUseFallback(true);
  };

  // * Construct server QR code image URL
  const getServerQRImageUrl = () => {
    if (!printConfig) return '';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://timadey.alwaysdata.net';
    return `${baseUrl}/${printConfig.qrCodeData.path}`;
  };

  // * Calculate optimal layout for A4 page
  const getPageLayout = (quantity: number) => {
    // * A4 page dimensions: ~8.27" x 11.69" with 0.25" margins = ~7.77" x 11.19"
    // * Account for header, footer, and spacing
    const availableHeight = 10.5; // inches
    const availableWidth = 7.5; // inches
    
    // * QR code sizes with padding and borders
    const qrSizes = {
      small: { size: 1.2, padding: 0.2 }, // 1.4" total per QR code
      medium: { size: 1.6, padding: 0.3 }, // 1.9" total per QR code
      large: { size: 2.0, padding: 0.4 }, // 2.4" total per QR code
    };
    
    // * Calculate optimal grid for A4 page
    if (quantity === 1) {
      return { 
        cols: 1, 
        rows: 1, 
        qrSize: 'large',
        qrClass: 'w-64 h-64',
        perPage: 1,
        totalPages: 1
      };
    }
    
    // * Try different grid configurations
    const configs = [
      { cols: 2, rows: 3, qrSize: 'medium', qrClass: 'w-48 h-48' }, // 6 per page
      { cols: 3, rows: 4, qrSize: 'small', qrClass: 'w-40 h-40' }, // 12 per page
      { cols: 4, rows: 5, qrSize: 'small', qrClass: 'w-32 h-32' }, // 20 per page
    ];
    
    // * Find best configuration
    for (const config of configs) {
      const perPage = config.cols * config.rows;
      const totalPages = Math.ceil(quantity / perPage);
      
      // * Check if this configuration fits well
      const qrConfig = qrSizes[config.qrSize as keyof typeof qrSizes];
      const totalWidth = config.cols * (qrConfig.size + qrConfig.padding);
      const totalHeight = config.rows * (qrConfig.size + qrConfig.padding);
      
      if (totalWidth <= availableWidth && totalHeight <= availableHeight) {
        return {
          ...config,
          perPage,
          totalPages
        };
      }
    }
    
    // * Fallback to smallest size
    return {
      cols: 4,
      rows: 5,
      qrSize: 'small',
      qrClass: 'w-32 h-32',
      perPage: 20,
      totalPages: Math.ceil(quantity / 20)
    };
  };

  // * Split QR codes into pages
  const getQRCodePages = (quantity: number, perPage: number) => {
    const pages = [];
    for (let i = 0; i < quantity; i += perPage) {
      const pageStart = i;
      const pageEnd = Math.min(i + perPage, quantity);
      pages.push({
        pageNumber: Math.floor(i / perPage) + 1,
        qrCodes: Array.from({ length: pageEnd - pageStart }, (_, index) => pageStart + index)
      });
    }
    return pages;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading print configuration...</p>
        </div>
      </div>
    );
  }

  if (!printConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Print Configuration Not Found</h2>
          <p className="text-neutral-600">No print configuration available.</p>
        </div>
      </div>
    );
  }

  const { qrCodeData, quantity } = printConfig;
  const expiresAt = new Date(qrCodeData.expires_at);
  const isExpired = expiresAt < new Date();
  const pageLayout = getPageLayout(quantity);
  const qrCodePages = getQRCodePages(quantity, pageLayout.perPage);

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
          
          /* * Page break handling */
          .print-page {
            page-break-after: always;
            min-height: 11in;
            display: flex;
            flex-direction: column;
          }
          
          .print-page:last-child {
            page-break-after: avoid;
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
          .print\\:grid { display: grid !important; }
          .print\\:gap-2 { gap: 0.5rem !important; }
          .print\\:gap-4 { gap: 1rem !important; }
        }
      `}</style>

      {/* * Header with print button (hidden when printing) */}
      <div className="print:hidden bg-gray-50 border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">QR Code Print View</h1>
            <p className="text-gray-600">
              Printing {quantity} QR Code{quantity > 1 ? 's' : ''} • Token: {qrCodeData.token}
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Printer className="w-4 h-4 inline mr-2" />
            Print QR Codes
          </button>
        </div>
      </div>

      {/* * Main print content */}
      <div className="max-w-6xl mx-auto p-8 print:p-0">
        {qrCodePages.map((page, pageIndex) => (
          <div 
            key={page.pageNumber}
            className={`print-page bg-white print:bg-white border border-gray-200 print:border rounded-lg print:shadow-none shadow-lg p-8 print:p-2 ${pageIndex === 0 ? 'mt-0' : 'mt-8 print:mt-0'}`}
          >
            
            {/* * Header Section */}
            <div className="text-center mb-6 print:mb-2 space-y-2 print:space-y-2">
              <h1 className="text-3xl print:text-xl font-bold text-gray-900 print:text-black">
                VTE Practical Session QR Codes
              </h1>
              <div className="w-24 h-1 bg-blue-600 mx-auto print:bg-black"></div>
              <p className="text-sm print:text-xs text-gray-600 print:text-black">
                {quantity} QR Code{quantity > 1 ? 's' : ''} for {qrCodeData.skill} Group {qrCodeData.skill_group_id}
                {pageLayout.totalPages > 1 && (
                  <span> • Page {page.pageNumber} of {pageLayout.totalPages}</span>
                )}
              </p>
            </div>

            {/* * QR Codes Grid */}
            <div 
              className="grid gap-4 print:gap-2 mb-6 print:mb-3 flex-1"
              style={{
                gridTemplateColumns: `repeat(${pageLayout.cols}, 1fr)`,
                gridTemplateRows: `repeat(${pageLayout.rows}, 1fr)`
              }}
            >
              {page.qrCodes.map((qrIndex) => (
                <div 
                  key={qrIndex}
                  className="bg-white print:bg-white border-2 border-gray-300 print:border-black p-4 print:p-2 rounded-lg print:break-inside-avoid"
                >
                  {/* * QR Code */}
                  <div className="flex flex-col items-center justify-center space-y-2 print:space-y-1">
                    <div className="bg-white print:bg-white border border-gray-200 print:border-black p-2 print:p-1 rounded">
                      {!useFallback ? (
                        <img 
                          src={getServerQRImageUrl()}
                          alt={`QR Code ${qrIndex + 1} for ${qrCodeData.token}`}
                          className={`${pageLayout.qrClass} print:${pageLayout.qrClass} object-contain`}
                          onError={handleImageError}
                          onLoad={() => console.log(`Server QR code ${qrIndex + 1} loaded successfully`)}
                        />
                      ) : (
                        <div 
                          ref={(el) => { qrRefs.current[qrIndex] = el as HTMLDivElement | null; }}
                          className={`${pageLayout.qrClass} print:${pageLayout.qrClass} flex items-center justify-center`}
                        />
                      )}
                    </div>
                    
                    {/* * Status Badge */}
                    <div className={`px-2 py-1 rounded-full text-xs print:text-xs font-semibold ${
                      isExpired 
                        ? 'bg-red-100 print:bg-gray-100 text-red-800 print:text-black border border-red-300 print:border-black' 
                        : 'bg-green-100 print:bg-gray-100 text-green-800 print:text-black border border-green-300 print:border-black'
                    }`}>
                      {isExpired ? 'EXPIRED' : 'ACTIVE'}
                    </div>
                  </div>

                  {/* * QR Code Info */}
                  <div className="mt-3 print:mt-2 text-center">
                    <div className="text-xs print:text-xs text-gray-600 print:text-black space-y-1 print:space-y-1">
                      <div className="font-medium">QR #{qrIndex + 1}</div>
                      <div>Points: {qrCodeData.mark_value}</div>
                      <div>Expires: {expiresAt.toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* * Instructions Section (only on first page) */}
            {pageIndex === 0 && (
              <div className="bg-blue-50 print:bg-gray-100 p-4 print:p-2 rounded-lg print:border">
                <h3 className="text-lg print:text-sm font-semibold text-blue-900 print:text-black mb-3 print:mb-2">
                  Instructions
                </h3>
                <div className="text-sm print:text-xs text-blue-800 print:text-black space-y-1 print:space-y-1">
                  <p>• Students scan any QR code during practical sessions</p>
                  <p>• Each scan awards {qrCodeData.mark_value} points</p>
                  <p>• QR codes expire on {expiresAt.toLocaleDateString()}</p>
                  <p>• Keep QR codes visible to students</p>
                  <p>• Distribute QR codes as needed for your session</p>
                </div>
              </div>
            )}

            {/* * Footer */}
            <div className="mt-6 print:mt-2 pt-4 print:pt-2 border-t border-gray-200 print:border-black">
              <div className="text-center text-xs print:text-xs text-gray-500 print:text-black">
                <p>Generated on {new Date().toLocaleDateString()} • VTE System • {quantity} QR Code{quantity > 1 ? 's' : ''}</p>
                {pageLayout.totalPages > 1 && (
                  <p>Page {page.pageNumber} of {pageLayout.totalPages}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
