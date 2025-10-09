"use client"
import React from "react"
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Button, Chip } from "@nextui-org/react"

/**
 * * ScanConfirmationModal
 * Shown after successful scan with points earned and remaining scans.
 *
 * Props:
 * - scanResult: { points: number; mentorName?: string }
 * - remainingScans: number
 * - onClose: () => void
 */
export type ScanConfirmationModalProps = {
  isOpen: boolean
  scanResult: { points: number; mentorName?: string }
  remainingScans: number
  onClose: () => void
}

export default function ScanConfirmationModal({ isOpen, scanResult, remainingScans, onClose }: ScanConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent className="bg-white shadow-md">
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">Attendance Recorded</ModalHeader>
            <ModalBody>
              <div className="flex items-center gap-3">
                <Chip color="success" variant="solid">Success</Chip>
                <p className="text-sm text-neutral-600">Your scan has been recorded.</p>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-base"><span className="font-medium">Points Earned:</span> {scanResult.points}</p>
                {scanResult.mentorName && (
                  <p className="text-base"><span className="font-medium">Mentor:</span> {scanResult.mentorName}</p>
                )}
                <p className="text-base"><span className="font-medium">Remaining Scans Today:</span> {remainingScans}</p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>Close</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}


