// * Mentor Calendar Page
// * Shows mentor's schedule and upcoming sessions
// * Follows the same pattern as other pages with StateRenderer + React Query

'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent, DefaultEmptyComponent } from '@/components/shared/StateRenderer';
import { api } from '@/lib/api';
import { Button, Card, CardBody, CardHeader, Chip, Badge } from '@nextui-org/react';
import { Calendar, Clock, Users, MapPin, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  group: {
    id: string;
    name: string;
    skill: {
      title: string;
    };
  };
  startTime: string;
  endTime: string;
  location?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  attendees: number;
  maxAttendees: number;
}

export default function MentorCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  // * React Query for data fetching - get mentor's schedule
  const {
    data: events,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['mentor-calendar', currentDate.toISOString().split('T')[0]],
    queryFn: async () => {
      // TODO: Implement mentor calendar endpoint
      // For now, return mock data
      return [
        {
          id: '1',
          title: 'Web Development Session',
          group: {
            id: 'group-1',
            name: 'Group A',
            skill: { title: 'Web Development' }
          },
          startTime: '2024-01-15T09:00:00Z',
          endTime: '2024-01-15T11:00:00Z',
          location: 'Lab 1',
          status: 'upcoming',
          attendees: 8,
          maxAttendees: 10
        },
        {
          id: '2',
          title: 'Mobile App Development',
          group: {
            id: 'group-2',
            name: 'Group B',
            skill: { title: 'Mobile Development' }
          },
          startTime: '2024-01-15T14:00:00Z',
          endTime: '2024-01-15T16:00:00Z',
          location: 'Lab 2',
          status: 'ongoing',
          attendees: 6,
          maxAttendees: 8
        }
      ] as CalendarEvent[];
    },
  });

  // * Navigation functions
  const goToPreviousWeek = () => {
    setCurrentDate(prev => new Date(prev.getTime() - 7 * 24 * 60 * 60 * 1000));
  };

  const goToNextWeek = () => {
    setCurrentDate(prev => new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // * Get week dates
  const getWeekDates = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      dates.push(day);
    }
    return dates;
  };

  // * Get events for a specific date
  const getEventsForDate = (date: Date) => {
    if (!events) return [];
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => 
      event.startTime.split('T')[0] === dateStr
    );
  };

  // * Format time for display
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // * Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'default';
      case 'ongoing': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  const weekDates = getWeekDates(currentDate);

  return (
    <div className="space-y-6">
      {/* * Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Calendar</h1>
          <p className="text-neutral-600 mt-1">
            View your schedule and manage upcoming sessions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            color="secondary"
            variant="light"
            onPress={() => setViewMode(viewMode === 'week' ? 'month' : 'week')}
          >
            {viewMode === 'week' ? 'Month View' : 'Week View'}
          </Button>
          <Button
            color="primary"
            startContent={<Plus className="w-4 h-4" />}
            onPress={() => {
              // TODO: Open create event modal
              console.log('Create new event');
            }}
          >
            Add Event
          </Button>
        </div>
      </div>

      {/* * Calendar Navigation */}
      <Card>
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                isIconOnly
                variant="light"
                onPress={goToPreviousWeek}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                {currentDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h2>
              <Button
                isIconOnly
                variant="light"
                onPress={goToNextWeek}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Button
              color="primary"
              variant="light"
              onPress={goToToday}
            >
              Today
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* * Calendar View */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <StateRenderer
          data={events}
          isLoading={isLoading}
          error={error}
          loadingComponent={
            <div className="p-6">
              <DefaultLoadingComponent />
            </div>
          }
          errorComponent={
            <div className="p-6">
              <DefaultErrorComponent 
                error={error!} 
                onRetry={() => refetch()} 
              />
            </div>
          }
          emptyComponent={
            <div className="p-6">
              <DefaultEmptyComponent 
                message="No events scheduled. Add your first event to get started."
                actionButton={
                  <Button
                    color="primary"
                    startContent={<Plus className="w-4 h-4" />}
                    onPress={() => console.log('Create event')}
                  >
                    Add Event
                  </Button>
                }
              />
            </div>
          }
        >
          {(data) => (
            <div className="p-6">
              {/* * Week View */}
              {viewMode === 'week' && (
                <div className="space-y-4">
                  {/* * Day Headers */}
                  <div className="grid grid-cols-7 gap-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                      <div key={day} className="text-center">
                        <div className="text-sm font-medium text-neutral-600 mb-2">{day}</div>
                        <div className={`text-lg font-semibold ${
                          weekDates[index].toDateString() === new Date().toDateString()
                            ? 'text-blue-600 bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto'
                            : 'text-neutral-900'
                        }`}>
                          {weekDates[index].getDate()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* * Events Grid */}
                  <div className="grid grid-cols-7 gap-4">
                    {weekDates.map((date, index) => {
                      const dayEvents = getEventsForDate(date);
                      return (
                        <div key={index} className="min-h-[200px] border border-neutral-200 rounded-lg p-3">
                          <div className="space-y-2">
                            {dayEvents.map((event) => (
                              <Card key={event.id} className="p-3">
                                <CardBody className="p-0">
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-medium text-sm text-neutral-900 line-clamp-1">
                                        {event.title}
                                      </h4>
                                      <Chip
                                        size="sm"
                                        color={getStatusColor(event.status)}
                                        variant="flat"
                                      >
                                        {event.status}
                                      </Chip>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2 text-xs text-neutral-600">
                                        <Clock className="w-3 h-3" />
                                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                      </div>
                                      <div className="flex items-center gap-2 text-xs text-neutral-600">
                                        <Users className="w-3 h-3" />
                                        {event.attendees}/{event.maxAttendees} students
                                      </div>
                                      {event.location && (
                                        <div className="flex items-center gap-2 text-xs text-neutral-600">
                                          <MapPin className="w-3 h-3" />
                                          {event.location}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </CardBody>
                              </Card>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* * Month View */}
              {viewMode === 'month' && (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600">
                    Month view will be implemented in a future update.
                  </p>
                </div>
              )}
            </div>
          )}
        </StateRenderer>
      </div>

      {/* * Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Total Events</p>
                <p className="text-xl font-bold text-neutral-900">{events?.length || 0}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">This Week</p>
                <p className="text-xl font-bold text-neutral-900">
                  {events?.filter(e => e.status === 'upcoming' || e.status === 'ongoing').length || 0}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Total Students</p>
                <p className="text-xl font-bold text-neutral-900">
                  {events?.reduce((sum, event) => sum + event.attendees, 0) || 0}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Locations</p>
                <p className="text-xl font-bold text-neutral-900">
                  {new Set(events?.map(e => e.location).filter(Boolean) || []).size}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* * Debug Information */}
      <div className="bg-neutral-50 p-4 rounded-lg">
        <h3 className="font-semibold text-neutral-900 mb-2">Debug Information</h3>
        <div className="text-sm text-neutral-600 space-y-1">
          <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {error ? error.message : 'None'}</p>
          <p><strong>Events Count:</strong> {events?.length || 0}</p>
          <p><strong>Current Date:</strong> {currentDate.toISOString().split('T')[0]}</p>
          <p><strong>View Mode:</strong> {viewMode}</p>
        </div>
      </div>
    </div>
  );
}
