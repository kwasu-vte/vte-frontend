import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QrCodeGeneratorProps {
  token: string;
}

export default function QrCodeGenerator({ token }: QrCodeGeneratorProps) {
  if (!token || typeof token !== 'string') {
    return <p>Invalid token</p>;
  }

  return (
    <QRCodeSVG
      value={token}
      size={200}
      level="M"
      includeMargin={true}
      fgColor="#0B200B"
      bgColor="#D7ECD7"
    />
  );
}