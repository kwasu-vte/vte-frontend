// * Header Component
// * Sticky header at the top of the main content area
// * Contains breadcrumbs and user profile dropdown

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { User } from '@/lib/types';
import { Menu, Bell, ChevronDown, Plus } from 'lucide-react';
import { useSessionStore } from '@/lib/stores/sessionStore';
import { 
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  user: User;
  onMenuClick: () => void;
}

// * Generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length === 0) return [];
  
  const breadcrumbs = [];
  let currentPath = '';
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;
    
    // * Format segment for display
    let label = segment;
    if (segment === 'admin') label = 'Admin';
    else if (segment === 'mentor') label = 'Mentor';
    else if (segment === 'student') label = 'Student';
    else if (segment === 'dashboard') label = 'Dashboard';
    else if (segment === 'skills') label = 'Skills';
    else if (segment === 'groups') label = 'Groups';
    else if (segment === 'students') label = 'Students';
    else if (segment === 'mentors') label = 'Mentors';
    else if (segment === 'settings') label = 'Settings';
    else if (segment === 'profile') label = 'Profile';
    else if (segment === 'my-group') label = 'My Group';
    else if (segment === 'my-groups') label = 'My Groups';
    else if (segment === 'calendar') label = 'Calendar';
    
    // * Capitalize first letter
    label = label.charAt(0).toUpperCase() + label.slice(1);
    
    breadcrumbs.push({
      label,
      href: currentPath,
      isLast: i === segments.length - 1,
    });
  }
  
  return breadcrumbs;
}

export function Header({ user, onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);
  const { sessions, activeSessionId, refresh, activateSession, createAndActivate } = useSessionStore();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [startsAt, setStartsAt] = React.useState<string>("");
  const [endsAt, setEndsAt] = React.useState<string>("");
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(undefined);
  const [showNoActiveModal, setShowNoActiveModal] = React.useState(false);

  React.useEffect(() => {
    // * Load sessions when header mounts
    refresh();
  }, [refresh]);

  React.useEffect(() => {
    setSelectedValue(activeSessionId ? String(activeSessionId) : undefined);
  }, [activeSessionId]);

  const computeDefaultDates = React.useCallback(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const today = `${yyyy}-${mm}-${dd}`;
    const nextYear = `${yyyy + 1}-${mm}-${dd}`;
    return { today, nextYear };
  }, []);

  React.useEffect(() => {
    if (isCreateOpen) {
      const { today, nextYear } = computeDefaultDates();
      setStartsAt((prev) => prev || today);
      setEndsAt((prev) => prev || nextYear);
    } else {
      // * Reset form when closed
      setNewName("");
      setStartsAt("");
      setEndsAt("");
    }
  }, [isCreateOpen, computeDefaultDates]);

  // * When sessions are fetched and none is active, prompt admin to select/create
  React.useEffect(() => {
    if (user.role !== 'Admin') return;
    if (!Array.isArray(sessions)) return;

    // * Determine active via explicit active flag or store's activeSessionId
    const hasActive = sessions.some((s) => s.active === true) || !!activeSessionId;
    const hasAny = sessions.length > 0;

    if (!hasAny || !hasActive) setShowNoActiveModal(true);
    else setShowNoActiveModal(false);
  }, [sessions, activeSessionId, user.role]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setIsSubmitting(true);
    // * Convert date inputs (yyyy-mm-dd) to ISO strings
    const startsIso = startsAt ? new Date(`${startsAt}T00:00:00Z`).toISOString() : undefined;
    const endsIso = endsAt ? new Date(`${endsAt}T00:00:00Z`).toISOString() : undefined;
    const created = await createAndActivate({ name: newName.trim(), starts_at: startsIso, ends_at: endsIso });
    setIsSubmitting(false);
    if (created) {
      setNewName('');
      setIsCreateOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* * Left Side - Menu Button and Breadcrumbs */}
        <div className="flex items-center space-x-4">
          {/* * Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-neutral-600" />
          </button>
          
          {/* * Breadcrumbs */}
          <nav className="hidden md:flex items-center space-x-2">
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={breadcrumb.href}>
                {index > 0 && (
                  <span className="text-neutral-400 mx-2">/</span>
                )}
                {breadcrumb.isLast ? (
                  <span className="text-neutral-900 font-medium">
                    {breadcrumb.label}
                  </span>
                ) : (
                  <a
                    href={breadcrumb.href}
                    className="text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    {breadcrumb.label}
                  </a>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* * Right Side - Session selector (Admin) + Notifications and User Profile */}
        <div className="flex items-center space-x-4">
          {user.role === 'Admin' && (
            <div className="flex items-center gap-2">
              <Select
                value={selectedValue}
                onValueChange={(val) => {
                  if (val === '__create__') {
                    // * Open modal and revert back to previous selection without triggering activation
                    setIsCreateOpen(true);
                    setSelectedValue(activeSessionId ? String(activeSessionId) : undefined);
                    return;
                  }
                  setSelectedValue(val);
                  activateSession(Number(val));
                }}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder={sessions.length ? 'Select session' : 'No sessions'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__create__">
                    <span className="flex items-center">
                      <Plus className="w-4 h-4 mr-2" /> Add new session…
                    </span>
                  </SelectItem>
                  {sessions.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}{s.active ? ' (current)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create academic session</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Input
                      placeholder="e.g. 2024/2025"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-neutral-600 mb-1">Start date</label>
                        <Input
                          type="date"
                          value={startsAt}
                          onChange={(e) => setStartsAt(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-neutral-600 mb-1">End date</label>
                        <Input
                          type="date"
                          value={endsAt}
                          onChange={(e) => setEndsAt(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreate} disabled={isSubmitting || !newName.trim()}>
                        {isSubmitting ? 'Creating…' : 'Create & set current'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* * No active session prompt */}
              <Dialog open={showNoActiveModal} onOpenChange={setShowNoActiveModal}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>No active academic session</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    {sessions.length > 0 ? (
                      <>
                        <p className="text-sm text-neutral-700">Select a session to activate or create a new one.</p>
                        <Select
                          value={selectedValue}
                          onValueChange={(val) => {
                            if (val === '__create__') {
                              setShowNoActiveModal(false);
                              setIsCreateOpen(true);
                              setSelectedValue(activeSessionId ? String(activeSessionId) : undefined);
                              return;
                            }
                            setSelectedValue(val);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose a session" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__create__">
                              <span className="flex items-center"><Plus className="w-4 h-4 mr-2" /> Create new session…</span>
                            </SelectItem>
                            {sessions.map((s) => (
                              <SelectItem key={s.id} value={String(s.id)}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" onClick={() => setShowNoActiveModal(false)}>Close</Button>
                          <Button onClick={async () => {
                            if (selectedValue) {
                              await activateSession(Number(selectedValue));
                              setShowNoActiveModal(false);
                            }
                          }}>Activate</Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-neutral-700">No sessions exist. Create one to continue.</p>
                        <div className="flex justify-end">
                          <Button onClick={() => { setShowNoActiveModal(false); setIsCreateOpen(true); }}>Create session</Button>
                        </div>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
          {/* * Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors">
            <Bell className="w-5 h-5 text-neutral-600" />
            {/* * TODO: Add notification badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>
          
          {/* * User Profile Dropdown */}
          <div className="relative">
            <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-100 transition-colors">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-semibold">
                  {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-neutral-900">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-neutral-600 capitalize">
                  {user.role}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-neutral-600" />
            </button>
            
            {/* * TODO: Implement dropdown menu */}
            {/* * This will contain: Profile, Settings, Logout */}
          </div>
        </div>
      </div>
    </header>
  );
}
