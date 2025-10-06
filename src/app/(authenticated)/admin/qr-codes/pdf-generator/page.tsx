"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import html3pdf from 'html3pdf';
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
 * * PDF Generator Page
 * Generates downloadable PDF with multiple QR codes using html3pdf.
 * Gets print configuration from session storage and creates optimized PDF layout.
 */
export default function PDFGeneratorPage() {
  const router = useRouter();
  const qrRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [useFallback, setUseFallback] = useState(false);
  const [qrCodeInstances, setQrCodeInstances] = useState<QRCodeStyling[]>([]);
  const [printConfig, setPrintConfig] = useState<PrintConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // * Load print configuration from session storage
  useEffect(() => {
    const storedConfig = sessionStorage.getItem('qrCodePDFConfig');
    if (storedConfig) {
      try {
        const config = JSON.parse(storedConfig) as PrintConfig;
        setPrintConfig(config);
      } catch (error) {
        console.error('Failed to parse PDF configuration:', error);
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
            width: 150,
            height: 150,
            type: 'svg' as DrawType,
            data: printConfig.qrCodeData.token,
            image: '/kwasulogo.png',
            margin: 6,
            qrOptions: {
              typeNumber: 0 as TypeNumber,
              mode: 'Byte' as Mode,
              errorCorrectionLevel: 'Q' as ErrorCorrectionLevel
            },
            imageOptions: {
              hideBackgroundDots: true,
              imageSize: 0.25,
              margin: 12,
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

  // * Calculate optimal layout for PDF
  const getPDFLayout = (quantity: number) => {
    // * PDF page dimensions in pixels (A4 at 96 DPI)
    const pageWidth = 794; // A4 width in pixels
    const pageHeight = 1123; // A4 height in pixels
    const margin = 40; // 40px margins
    const availableWidth = pageWidth - (margin * 2);
    const availableHeight = pageHeight - (margin * 2) - 100; // Account for header/footer
    
    // * QR code sizes with padding
    const qrSizes = {
      small: { size: 120, padding: 20 }, // 140px total per QR code
      medium: { size: 150, padding: 25 }, // 175px total per QR code
      large: { size: 200, padding: 30 }, // 230px total per QR code
    };
    
    // * Calculate optimal grid for PDF page
    if (quantity === 1) {
      return { 
        cols: 1, 
        rows: 1, 
        qrSize: 'large',
        qrClass: 'w-48 h-48',
        perPage: 1,
        totalPages: 1
      };
    }
    
    // * Try different grid configurations
    const configs = [
      { cols: 2, rows: 3, qrSize: 'medium', qrClass: 'w-36 h-36' }, // 6 per page
      { cols: 3, rows: 4, qrSize: 'small', qrClass: 'w-28 h-28' }, // 12 per page
      { cols: 4, rows: 5, qrSize: 'small', qrClass: 'w-24 h-24' }, // 20 per page
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
      qrClass: 'w-24 h-24',
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

  // * Generate PDF using html3pdf with HTML content
// Replace your handleGeneratePDF function with this:

const handleGeneratePDF = async () => {
  if (!printConfig) return;
  
  setIsGeneratingPDF(true);
  
  try {
    const { qrCodeData, quantity } = printConfig;
    const expiresAt = new Date(qrCodeData.expires_at);
    const isExpired = expiresAt < new Date();
    const pageLayout = getPDFLayout(quantity);
    const qrCodePages = getQRCodePages(quantity, pageLayout.perPage);

    // * Pre-load logo image as base64
    const logoDataUrl = await loadImageAsDataUrl('/kwasulogo.png');

    // * Generate all QR codes first and wait for them
    const qrCodeDataUrls = await Promise.all(
      Array.from({ length: quantity }, (_, i) => generateQRCodeImage(qrCodeData.token, logoDataUrl))
    );

    // * Create HTML content for PDF
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>QR Codes - Group ${qrCodeData.skill_group_id}</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
          }
          .header h1 {
            font-size: 24px;
            margin: 0 0 10px 0;
            font-weight: bold;
          }
          .header p {
            font-size: 14px;
            margin: 5px 0;
          }
          .qr-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
            margin-bottom: 20px;
          }
          .qr-code-item {
            display: inline-block;
            text-align: center;
            page-break-inside: avoid;
            margin: 10px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: white;
          }
          .qr-code-item img {
            width: 150px;
            height: 150px;
            display: block;
            margin: 0 auto 8px auto;
          }
          .qr-info {
            font-size: 11px;
            line-height: 1.4;
          }
          .qr-info strong {
            font-size: 12px;
            display: block;
            margin-bottom: 4px;
          }
          .status {
            font-weight: bold;
            margin-top: 4px;
          }
          .status.active {
            color: #16a34a;
          }
          .status.expired {
            color: #dc2626;
          }
          .instructions {
            margin-top: 20px;
            padding: 15px;
            background-color: #f8f9fa;
            border-left: 4px solid #007bff;
            page-break-inside: avoid;
          }
          .instructions h3 {
            margin: 0 0 10px 0;
            font-size: 16px;
          }
          .instructions ul {
            margin: 0;
            padding-left: 20px;
          }
          .instructions li {
            margin: 5px 0;
            font-size: 12px;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
            page-break-inside: avoid;
          }
          .page-break {
            page-break-after: always;
          }
        </style>
      </head>
      <body>
    `;

    // * Generate pages
    for (let pageIndex = 0; pageIndex < qrCodePages.length; pageIndex++) {
      const page = qrCodePages[pageIndex];
      
      htmlContent += `
        <div class="header">
          <h1>VTE Practical Session QR Codes</h1>
          <p>${quantity} QR Code${quantity > 1 ? 's' : ''} for Group ${qrCodeData.skill_group_id}</p>
          ${pageLayout.totalPages > 1 ? `<p>Page ${page.pageNumber} of ${pageLayout.totalPages}</p>` : ''}
        </div>
        
        <div class="qr-grid">
      `;

      // * Add QR codes for this page
      for (const qrIndex of page.qrCodes) {
        htmlContent += `
          <div class="qr-code-item">
            <img src="${qrCodeDataUrls[qrIndex]}" alt="QR Code ${qrIndex + 1}" />
            <div class="qr-info">
              <strong>QR #${qrIndex + 1}</strong>
              <div>Points: ${qrCodeData.mark_value}</div>
              <div>Expires: ${expiresAt.toLocaleDateString()}</div>
              <div class="status ${isExpired ? 'expired' : 'active'}">
                ${isExpired ? 'EXPIRED' : 'ACTIVE'}
              </div>
            </div>
          </div>
        `;
      }

      htmlContent += `
        </div>
      `;

      // * Add instructions on first page only
      if (pageIndex === 0) {
        htmlContent += `
          <div class="instructions">
            <h3>Instructions:</h3>
            <ul>
              <li>Students scan any QR code during practical sessions</li>
              <li>Each scan awards ${qrCodeData.mark_value} points</li>
              <li>QR codes expire on ${expiresAt.toLocaleDateString()}</li>
              <li>Keep QR codes visible to students</li>
              <li>Distribute QR codes as needed for your session</li>
            </ul>
          </div>
        `;
      }

      htmlContent += `
        <div class="footer">
          <p>Generated on ${new Date().toLocaleDateString()} • VTE System • ${quantity} QR Code${quantity > 1 ? 's' : ''}</p>
          <p>Page ${page.pageNumber} of ${pageLayout.totalPages}</p>
        </div>
      `;

      // * Add page break if not last page
      if (pageIndex < qrCodePages.length - 1) {
        htmlContent += '<div class="page-break"></div>';
      }
    }

    htmlContent += `
      </body>
      </html>
    `;

    // * Configure html3pdf options
    const opt = {
      margin: 0.5,
      filename: `qr-codes-group-${qrCodeData.skill_group_id}-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
        allowTaint: false,
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      }
    };

    // * Generate and save PDF
    await html3pdf().set(opt).from(htmlContent).save();

  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  } finally {
    setIsGeneratingPDF(false);
  }
};

// * Helper function to load image as data URL
const loadImageAsDataUrl = (imagePath) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      try {
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      } catch (error) {
        console.error('Error converting image to data URL:', error);
        resolve(''); // Return empty string if conversion fails
      }
    };
    
    img.onerror = () => {
      console.warn('Failed to load logo image, proceeding without it');
      resolve(''); // Return empty string if image fails to load
    };
    
    img.src = imagePath;
  });
};

// * Helper function to generate QR code as data URL
const generateQRCodeImage = async (token, logoDataUrl) => {
  return new Promise((resolve, reject) => {
    // Create temporary container
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);

    const qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      type: 'canvas' as DrawType,
      data: token,
      image: logoDataUrl || undefined,
      margin: 4,
      qrOptions: {
        typeNumber: 0 as TypeNumber,
        mode: 'Byte' as Mode,
        errorCorrectionLevel: 'Q' as ErrorCorrectionLevel
      },
      imageOptions: logoDataUrl ? {
        hideBackgroundDots: true,
        imageSize: 0.2,
        margin: 5
      } : undefined,
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

    qrCode.append(tempDiv);

    // Wait for QR code to render
    setTimeout(async () => {
      try {
        const blob = await qrCode.getRawData('png');
        if (blob) {
          const reader = new FileReader();
          reader.onloadend = () => {
            document.body.removeChild(tempDiv);
            resolve(reader.result);
          };
          reader.onerror = () => {
            document.body.removeChild(tempDiv);
            reject(new Error('Failed to read QR code blob'));
          };
          reader.readAsDataURL(blob);
        } else {
          document.body.removeChild(tempDiv);
          reject(new Error('Failed to generate QR code blob'));
        }
      } catch (error) {
        document.body.removeChild(tempDiv);
        reject(error);
      }
    }, 100); // Give QR code time to render
  });
};

  // * Handle back navigation
  const handleBack = () => {
    router.push('/admin/qr-codes/print-selector');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading PDF configuration...</p>
        </div>
      </div>
    );
  }

  if (!printConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">PDF Configuration Not Found</h2>
          <p className="text-neutral-600">No PDF configuration available.</p>
          <button
            onClick={handleBack}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Print Selector
          </button>
        </div>
      </div>
    );
  }

  const { qrCodeData, quantity } = printConfig;
  const expiresAt = new Date(qrCodeData.expires_at);
  const isExpired = expiresAt < new Date();
  const pageLayout = getPDFLayout(quantity);
  const qrCodePages = getQRCodePages(quantity, pageLayout.perPage);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* * Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Back to Print Selector
          </button>
          <h1 className="text-3xl font-bold text-neutral-900">Generate PDF</h1>
          <p className="text-neutral-600 mt-1">
            Generate downloadable PDF with {quantity} QR Code{quantity > 1 ? 's' : ''}
          </p>
        </div>

        {/* * PDF Preview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">PDF Preview</h3>
            <button
              onClick={handleGeneratePDF}
              disabled={isGeneratingPDF}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating PDF...
                </>
              ) : (
                <>
                  📄 Download PDF
                </>
              )}
            </button>
          </div>

          {/* * PDF Info */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">PDF Information</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Format: A4 Portrait</p>
              <p>• Pages: {pageLayout.totalPages}</p>
              <p>• QR Codes per page: {pageLayout.perPage}</p>
              <p>• Layout: {pageLayout.cols} × {pageLayout.rows} grid</p>
              <p>• File size: ~{Math.ceil(quantity * 0.1)}KB (estimated)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
