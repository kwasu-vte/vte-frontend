import React from 'react'
import QRCode from '@/assets/qrcode.png'
import Image from 'next/image'
interface QRCodeModalProps {
    setIsQRcodeModalOpen: (isOpen: boolean) => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ setIsQRcodeModalOpen }) => {
    return (
        <div className='fixed right-0 bottom-0 left-0 top-0 px-2 py4 overflow-scroll scrollbar-hide z-50 justify-center items-center flex bg-[#00000080]'
            onClick={(e) => {
                if (e.target !== e.currentTarget) {
                    return
                }
                setIsQRcodeModalOpen(false)
            }}
        >
            <div className=' w-[65%] h-[50%] bg-[#D7ECD7] flex items-center justify-center'>
                <Image
                    src={QRCode}
                    alt="qr code"
                    width={200}
                />
            </div>
        </div>
    )
}

export default QRCodeModal
