import React from 'react'
import QRCode from '@/assets/qrcode.png'
import Image from 'next/image'
import { FadeInFromBottom } from '../components/FadeInFromBottom';
import QRCodeScanner from '../components/QRCodeScanner';
interface QRCodeModalProps {
    setIsQRcodeopen: (isOpen: boolean) => void;
    setButtonActive: (isOpen: boolean) => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ setIsQRcodeopen, setButtonActive }) => {
    return (
        <div className='fixed right-0 bottom-0 left-0 top-0 px-2 py4 overflow-scroll scrollbar-hide z-50 justify-center items-center flex bg-[#00000080]'
            onClick={(e) => {
                if (e.target !== e.currentTarget) {
                    return
                }
                setIsQRcodeopen(false);
                setButtonActive(false)
            }}
        >
            <div className=' w-[65%] h-[50%] bg-[#D7ECD7] flex items-center justify-center'>
                <div className=' w-full h-full flex items-center justify-center'>
                    <FadeInFromBottom>
                        <Image
                            src={QRCode}
                            alt="qr code"
                            width={200}
                        />
                    </FadeInFromBottom>
                </div>
            </div>
        </div >
    )
}

export default QRCodeModal
