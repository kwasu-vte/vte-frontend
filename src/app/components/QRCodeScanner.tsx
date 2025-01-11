import React, { useState } from 'react';
import QrScanner from 'react-qr-barcode-scanner';

const QRCodeScanner = () => {
    const [data, setData] = useState(null);

    const handleScan = (err, result) => {
        if (result) {
            setData(result.text);
        }
        if (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1 className=' font-semibold m-auto text-center'>Scan the QRCode to mark attendance</h1>
            <div className=' max-w-[50%] m-auto max-h-[80%] transform'>
                <QrScanner
                    onUpdate={handleScan}
                />
            </div>
            {data && <p>Scanned Data: {data}</p>}
        </div>
    );
};

export default QRCodeScanner;
