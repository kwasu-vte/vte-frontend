"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader, Button, Select, SelectItem } from '@nextui-org/react';
import { ArrowLeft, Printer } from 'lucide-react';
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

/**
 * * QR Code Print Selector Page
 * Allows admin to select the number of QR codes to print (1 or multiples of 2, max 24)
 * and navigate to the dynamic print page.
 */
export default function QRCodePrintSelectorPage() {
  const router = useRouter();
  const qrRef = useRef<HTMLDivElement>(null);
  const [qrCodeData, setQrCodeData] = useState<GroupQrCode | null>(null);
  const [quantity, setQuantity] = useState<string>('1');
  const [isLoading, setIsLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [qrCodeInstance, setQrCodeInstance] = useState<QRCodeStyling | null>(null);

  // * Generate quantity options (1, or multiples of 2, max 24)
  const quantityOptions = [
    { value: '1', label: '1 QR Code (1 page)' },
    { value: '2', label: '2 QR Codes (1 page)' },
    { value: '4', label: '4 QR Codes (1 page)' },
    { value: '6', label: '6 QR Codes (1 page)' },
    { value: '8', label: '8 QR Codes (1 page)' },
    { value: '10', label: '10 QR Codes (1 page)' },
    { value: '12', label: '12 QR Codes (1 page)' },
    { value: '14', label: '14 QR Codes (1 page)' },
    { value: '16', label: '16 QR Codes (1 page)' },
    { value: '18', label: '18 QR Codes (1 page)' },
    { value: '20', label: '20 QR Codes (1 page)' },
    { value: '22', label: '22 QR Codes (2 pages)' },
    { value: '24', label: '24 QR Codes (2 pages)' },
  ];

  // * Calculate pages for selected quantity
  const getPagesForQuantity = (qty: number) => {
    if (qty <= 20) return 1;
    return Math.ceil(qty / 20);
  };

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
        width: 96,
        height: 96,
        type: 'svg' as DrawType,
        data: qrCodeData.token,
        image: '/kwasulogo.png',
        margin: 6,
        qrOptions: {
          typeNumber: 0 as TypeNumber,
          mode: 'Byte' as Mode,
          errorCorrectionLevel: 'Q' as ErrorCorrectionLevel
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.3,
          margin: 10,
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

  // * Handle print with selected quantity (now generates PDF)
  const handlePrint = () => {
    if (!qrCodeData) return;
    
    // * Store PDF configuration in session storage
    sessionStorage.setItem('qrCodePDFConfig', JSON.stringify({
      qrCodeData,
      quantity: parseInt(quantity),
      timestamp: new Date().toISOString()
    }));
    
    // * Navigate to PDF generator page
    router.push('/admin/qr-codes/pdf-generator');
  };

  // * Handle back navigation
  const handleBack = () => {
    router.push('/admin/qr-codes');
  };

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
          <Button
            color="primary"
            variant="bordered"
            onPress={handleBack}
            className="mt-4"
          >
            Back to QR Codes
          </Button>
        </div>
      </div>
    );
  }

  const expiresAt = new Date(qrCodeData.expires_at);
  const isExpired = expiresAt < new Date();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* * Header */}
        <div className="mb-6">
          <Button
            color="default"
            variant="light"
            startContent={<ArrowLeft className="h-4 w-4" />}
            onPress={handleBack}
            className="mb-4"
          >
            Back to QR Codes
          </Button>
          <h1 className="text-3xl font-bold text-neutral-900">Print QR Codes</h1>
          <p className="text-neutral-600 mt-1">Configure how many QR codes you want to print</p>
        </div>

        {/* * QR Code Preview */}
        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-lg font-semibold">QR Code Preview</h3>
          </CardHeader>
          <CardBody>
            <div className="flex items-center space-x-4">
              <div className="bg-white border-2 border-gray-300 p-4 rounded-lg">
                {!useFallback ? (
                  <img 
                    src={`${process.env.NEXT_PUBLIC_API_URL || 'https://timadey.alwaysdata.net'}${qrCodeData.path}`}
                    alt={`QR Code for ${qrCodeData.token}`}
                    className="w-24 h-24 object-contain"
                    onError={handleImageError}
                    onLoad={() => console.log('Server QR code loaded successfully')}
                  />
                ) : (
                  <div 
                    ref={qrRef}
                    className="w-24 h-24 flex items-center justify-center"
                  />
                )}
              </div>
              <div className="flex-1">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Token:</span>
                    <span className="text-sm text-gray-900 ml-2 font-mono">
                      {qrCodeData.token.substring(0, 20)}...
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Group ID:</span>
                    <span className="text-sm text-gray-900 ml-2">{qrCodeData.skill_group_id}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Points per Scan:</span>
                    <span className="text-sm text-gray-900 ml-2">{qrCodeData.mark_value}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <span className={`text-sm ml-2 font-semibold ${
                      isExpired ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {isExpired ? 'EXPIRED' : 'ACTIVE'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* * Print Configuration */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Print Configuration</h3>
          </CardHeader>
          <CardBody className="space-y-6">
            {/* * Quantity Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Number of QR Codes to Print
              </label>
              <Select
                selectedKeys={[quantity]}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Select quantity"
                className="max-w-xs"
              >
                {quantityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              <p className="text-xs text-gray-500">
                Choose 1 QR code or multiples of 2 (maximum 24)
              </p>
            </div>

            {/* * Layout Preview */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Layout Preview
              </label>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">
                  {quantity === '1' ? 'Single QR code' : `${quantity} QR codes in grid layout`}
                  {getPagesForQuantity(parseInt(quantity)) > 1 && (
                    <span className="text-blue-600 font-medium"> • {getPagesForQuantity(parseInt(quantity))} pages</span>
                  )}
                </div>
                <div className="grid gap-2" style={{
                  gridTemplateColumns: quantity === '1' ? '1fr' : 
                    parseInt(quantity) <= 6 ? 'repeat(2, 1fr)' :
                    parseInt(quantity) <= 12 ? 'repeat(3, 1fr)' :
                    parseInt(quantity) <= 20 ? 'repeat(4, 1fr)' :
                    'repeat(4, 1fr)'
                }}>
                  {Array.from({ length: Math.min(parseInt(quantity), 20) }, (_, i) => (
                    <div key={i} className="bg-gray-100 border border-gray-300 rounded p-2 text-center">
                      <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-1"></div>
                      <div className="text-xs text-gray-500">QR {i + 1}</div>
                    </div>
                  ))}
                  {parseInt(quantity) > 20 && (
                    <div className="col-span-full text-center text-xs text-gray-500 mt-2">
                      ... and {parseInt(quantity) - 20} more on page 2
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* * Action Button */}
            <div className="flex justify-end">
              <Button
                color="primary"
                size="lg"
                startContent={<Printer className="h-5 w-5" />}
                onPress={handlePrint}
                className="px-8"
              >
                Generate PDF ({getPagesForQuantity(parseInt(quantity))} page{getPagesForQuantity(parseInt(quantity)) > 1 ? 's' : ''})
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* * Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <h3 className="text-lg font-semibold">Print Instructions</h3>
          </CardHeader>
          <CardBody>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• The QR codes will be arranged in an optimal grid layout for printing</p>
              <p>• Each QR code will include the session details and instructions</p>
              <p>• Large quantities (22-24) will be split across multiple pages automatically</p>
              <p>• <strong>Generate PDF:</strong> Creates downloadable PDF file with all QR codes</p>
              <p>• PDFs are optimized for A4 paper size and professional printing</p>
              <p>• QR codes will be printed in black and white for better scanning</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
