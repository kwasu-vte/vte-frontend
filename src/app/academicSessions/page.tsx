"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AcademicSession } from "@/lib/types";
import { toast } from "react-toastify";
import { FadeInFromBottom } from "../components/FadeInFromBottom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Play, Square, Edit, Trash2 } from "lucide-react";

export default function AcademicSessionsPage() {
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<AcademicSession | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    starts_at: "",
    ends_at: "",
  });

  // * Load academic sessions
  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await api.getAcademicSessions();
      if (response.success) {
        setSessions(response.data);
      } else {
        toast.error("Failed to load academic sessions");
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
      toast.error("Failed to load academic sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  // * Create new academic session
  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.createAcademicSession({
        name: formData.name,
        starts_at: formData.starts_at || null,
        ends_at: formData.ends_at || null,
      });

      if (response.success) {
        toast.success("Academic session created successfully!");
        setIsCreateModalOpen(false);
        setFormData({ name: "", starts_at: "", ends_at: "" });
        loadSessions();
      } else {
        toast.error(response.message || "Failed to create academic session");
      }
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("Failed to create academic session");
    }
  };

  // * Update academic session
  const handleUpdateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession) return;

    try {
      const response = await api.updateAcademicSession(editingSession.id, {
        name: formData.name,
        starts_at: formData.starts_at,
        ends_at: formData.ends_at,
      });

      if (response.success) {
        toast.success("Academic session updated successfully!");
        setIsEditModalOpen(false);
        setEditingSession(null);
        setFormData({ name: "", starts_at: "", ends_at: "" });
        loadSessions();
      } else {
        toast.error(response.message || "Failed to update academic session");
      }
    } catch (error) {
      console.error("Error updating session:", error);
      toast.error("Failed to update academic session");
    }
  };

  // * Start academic session
  const handleStartSession = async (sessionId: number) => {
    try {
      const response = await api.startAcademicSession(sessionId);
      if (response.success) {
        toast.success("Academic session started successfully!");
        loadSessions();
      } else {
        toast.error(response.message || "Failed to start academic session");
      }
    } catch (error) {
      console.error("Error starting session:", error);
      toast.error("Failed to start academic session");
    }
  };

  // * End academic session
  const handleEndSession = async (sessionId: number) => {
    try {
      const response = await api.endAcademicSession(sessionId);
      if (response.success) {
        toast.success("Academic session ended successfully!");
        loadSessions();
      } else {
        toast.error(response.message || "Failed to end academic session");
      }
    } catch (error) {
      console.error("Error ending session:", error);
      toast.error("Failed to end academic session");
    }
  };

  // * Open edit modal
  const openEditModal = (session: AcademicSession) => {
    setEditingSession(session);
    setFormData({
      name: session.name,
      starts_at: session.starts_at || "",
      ends_at: session.ends_at || "",
    });
    setIsEditModalOpen(true);
  };

  // * Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  // * Get active session
  const activeSession = sessions.find(session => session.active);

  return (
    <FadeInFromBottom>
      <div className="w-full h-[100vh] overflow-scroll p-4 sm:pl-[20%] sm:py-2 sm:pr-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#379E37]">Academic Sessions</h1>
            <p className="text-gray-600">Manage academic sessions and terms</p>
          </div>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#379E37] hover:bg-[#2d7a2d]">
                <Plus className="w-4 h-4 mr-2" />
                Create Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Academic Session</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSession} className="space-y-4">
                <div>
                  <Label htmlFor="name">Session Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., 2024/2025 Academic Session"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="starts_at">Start Date (Optional)</Label>
                  <Input
                    id="starts_at"
                    type="datetime-local"
                    value={formData.starts_at}
                    onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="ends_at">End Date (Optional)</Label>
                  <Input
                    id="ends_at"
                    type="datetime-local"
                    value={formData.ends_at}
                    onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#379E37] hover:bg-[#2d7a2d]">
                    Create Session
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Active Session Status */}
        {activeSession && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  Active Session: {activeSession.name}
                </h3>
                <p className="text-green-600">
                  Started: {formatDate(activeSession.starts_at)}
                  {activeSession.ends_at && ` • Ends: ${formatDate(activeSession.ends_at)}`}
                </p>
              </div>
              <Button
                onClick={() => handleEndSession(activeSession.id)}
                variant="destructive"
                size="sm"
              >
                <Square className="w-4 h-4 mr-2" />
                End Session
              </Button>
            </div>
          </div>
        )}

        {/* Sessions Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">All Academic Sessions</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#379E37] mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading sessions...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Groups</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.name}</TableCell>
                    <TableCell>{formatDate(session.starts_at)}</TableCell>
                    <TableCell>{formatDate(session.ends_at)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          session.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {session.active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>{session.groups_count || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {!session.active && (
                          <Button
                            onClick={() => handleStartSession(session.id)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          onClick={() => openEditModal(session)}
                          size="sm"
                          variant="outline"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Academic Session</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateSession} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Session Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., 2024/2025 Academic Session"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-starts_at">Start Date</Label>
                <Input
                  id="edit-starts_at"
                  type="datetime-local"
                  value={formData.starts_at}
                  onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-ends_at">End Date</Label>
                <Input
                  id="edit-ends_at"
                  type="datetime-local"
                  value={formData.ends_at}
                  onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingSession(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#379E37] hover:bg-[#2d7a2d]">
                  Update Session
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </FadeInFromBottom>
  );
}
