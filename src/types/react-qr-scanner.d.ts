declare module 'react-qr-scanner' {
  import { Component } from 'react';

  interface QrScannerProps {
    delay?: number;
    onError?: (err: any) => void;
    onScan?: (data: any) => void;
    style?: React.CSSProperties;
    constraints?: {
      video: {
        facingMode: string;
      };
    };
  }

  export default class QrScanner extends Component<QrScannerProps> {}
}
