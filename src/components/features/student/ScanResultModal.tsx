"use client"
import React from "react"
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Button, Chip } from "@heroui/react"

/**
 * * ScanResultModal
 * Shows result after QR scan: success with points/timestamp or error message.
 *
 * Props:
 * - scanResult: { success: boolean; message?: string; points?: number; timestamp?: string; studentName?: string }
 * - onClose: () => void
 * - onRescan?: () => void
 */
export type ScanResultModalProps = {
  isOpen: boolean
  scanResult: { success: boolean; message?: string; points?: number; timestamp?: string; studentName?: string }
  onClose: () => void
  onRescan?: () => void
}

export default function ScanResultModal({ isOpen, scanResult, onClose, onRescan }: ScanResultModalProps) {
  const { success, message, points, timestamp, studentName } = scanResult

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent className="bg-white shadow-md">
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {success ? "Scan Successful" : "Scan Failed"}
            </ModalHeader>
            <ModalBody>
              <div className="flex items-center gap-3">
                <Chip color={success ? "success" : "danger"} variant="solid">
                  {success ? "Success" : "Error"}
                </Chip>
                <p className="text-sm text-neutral-600">
                  {success ? (message || "Attendance recorded.") : (message || "Unable to record attendance.")}
                </p>
              </div>
              {success && (
                <div className="mt-2 space-y-1">
                  {typeof points === "number" && (
                    <p className="text-base"><span className="font-medium">Points:</span> {points}</p>
                  )}
                  {timestamp && (
                    <p className="text-base"><span className="font-medium">Time:</span> {new Date(timestamp).toLocaleString()}</p>
                  )}
                  {studentName && (
                    <p className="text-base"><span className="font-medium">Student:</span> {studentName}</p>
                  )}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              {onRescan && (
                <Button variant="bordered" onPress={onRescan}>
                  Rescan
                </Button>
              )}
              <Button color="primary" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}


