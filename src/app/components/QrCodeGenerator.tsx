import React from 'react';
import { useQRCode } from 'next-qrcode';

export default function QrCodeGenerator(token: string) {
  const { Image } = useQRCode();

  if (!token || typeof token !== 'string') {
    return <p>Invalid token</p>;
  }

  return (
    <Image
      text={token}
      options={{
        type: 'image/jpeg',
        quality: 0.3,
        errorCorrectionLevel: 'M',
        margin: 5,
        scale: 4,
        width: 200,
        color: {
          dark: '#0B200B',
          light: '#D7ECD7',
        },
      }}
    />
  );
}