"use client";

import { Protected } from "@/components/protected";
import { useFetchGroups } from "@/hooks/queries/useFetchGroups";
import React, { useRef, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { QRCodeCanvas } from "qrcode.react";
import useAuth from "@/lib/useAuth";
import { useRouter } from "next/navigation";

const Attendance = () => {
  const { data: groups, isLoading } = useFetchGroups();
  const { mounted, isLoggedIn } = useAuth();
  const router = useRouter();

  if (mounted && isLoggedIn === false) {
    router.push("/auth/sign_in");
  }

  const [selectedGroup, setSelectedGroup] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [qrCode, setQrCode] = useState<{ id: string; name: string } | null>(
    null
  );
  const qrRef = useRef<HTMLDivElement>(null);

  const handleSelectGroup = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    const selectedGroup = groups?.data?.find(
      (group: { id: string }) => group.id === selectedId
    );

    if (selectedGroup) {
      setSelectedGroup(selectedGroup);
      setQrCode(null);
    }
  };

  const generateQRCode = () => {
    if (selectedGroup) {
      setQrCode(selectedGroup);
    }
  };

  const downloadQRCode = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector("canvas");
      if (canvas) {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${qrCode?.name}-QR-Code.png`;
        link.click();
      }
    }
  };

  const printQRCode = () => {
    if (qrCode) {
      const printWindow = window.open("", "_blank");
      printWindow?.document.write(`
        <html>
          <head>
            <title>Print QR Code</title>
            <style>
              body { text-align: center; font-family: Arial, sans-serif; margin: 20px; }
              .qr-container { display: flex; flex-direction: column; align-items: center; }
              img { max-width: 200px; margin: 10px 0; }
              h2 { color: #333; }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <h2>${qrCode.name}</h2>
              <img src="${qrRef.current
                ?.querySelector("canvas")
                ?.toDataURL("image/png")}" alt="QR Code" />
              <p>Group ID: ${qrCode.id}</p>
            </div>
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      printWindow?.document.close();
    }
  };

  return (
    <Protected>
      <AdminSidebar />
      <div className="w-full h-[100vh] overflow-scroll p-4 sm:pl-[20%] sm:py-2 sm:pr-4">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-green-800">
            Groups Attendance
          </h2>
          <div>
            <label className="mr-2 font-medium text-green-900">
              Select Group:
            </label>
            <select
              className="border p-2 rounded bg-white"
              onChange={handleSelectGroup}
              value={selectedGroup?.id || ""}
            >
              <option value="" disabled>
                -- Select a group --
              </option>
              {isLoading ? (
                <option>Loading...</option>
              ) : (
                groups?.data?.map((group: { id: string; name: string }) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {selectedGroup && (
            <button
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={generateQRCode}
            >
              Generate QR Code
            </button>
          )}

          {qrCode && (
            <div className="mt-4 flex flex-col items-center" ref={qrRef}>
              <QRCodeCanvas value={qrCode.id} size={150} />
              <p className="text-sm text-gray-600 mt-2">
                Group ID: {qrCode.id}
              </p>
              <p className="text-lg font-semibold text-green-700">
                {qrCode.name}
              </p>

              <div className="flex gap-4 mt-3">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={downloadQRCode}
                >
                  Download QR
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={printQRCode}
                >
                  Print QR
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Protected>
  );
};

export default Attendance;
