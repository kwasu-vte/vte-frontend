// * CalendarView Component
// * Displays events and activities in a calendar format
// * Used for scheduling, attendance tracking, and event management

'use client';

import React, { useState } from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Activity } from '@/lib/types';

interface CalendarViewProps {
  events: Activity[];
  onEventClick?: (event: Activity) => void;
  onDateClick?: (date: Date) => void;
  className?: string;
  showNavigation?: boolean;
  initialDate?: Date;
}

export function CalendarView({
  events,
  onEventClick,
  onDateClick,
  className = '',
  showNavigation = true,
  initialDate = new Date(),
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(initialDate);

  // * Get calendar data for current month
  const getCalendarData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // * Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // * Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // * Get events for a specific date
  const getEventsForDate = (date: Date) => {
    if (!date) return [];
    
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDate = new Date(event.start_time).toISOString().split('T')[0];
      return eventDate === dateString;
    });
  };

  // * Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // * Format month and year for display
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const days = getCalendarData();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className={`${className}`}>
      <CardBody className="p-0">
        {/* * Calendar Header */}
        {showNavigation && (
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <div className="flex items-center space-x-4">
              <CalendarIcon className="w-5 h-5 text-neutral-500" />
              <h3 className="text-lg font-semibold text-neutral-900">
                {formatMonthYear(currentDate)}
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={goToPreviousMonth}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="light"
                size="sm"
                onPress={goToToday}
                className="text-neutral-500 hover:text-neutral-700"
              >
                Today
              </Button>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={goToNextMonth}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* * Calendar Grid */}
        <div className="p-6">
          {/* * Day names header */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map(day => (
              <div
                key={day}
                className="text-center text-sm font-medium text-neutral-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* * Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              const isToday = date && 
                date.toDateString() === new Date().toDateString();
              const isCurrentMonth = date && 
                date.getMonth() === currentDate.getMonth();
              const dayEvents = date ? getEventsForDate(date) : [];

              return (
                <div
                  key={index}
                  className={`
                    min-h-[100px] p-2 border border-neutral-200
                    ${isCurrentMonth ? 'bg-white' : 'bg-neutral-50'}
                    ${isToday ? 'bg-primary-50 border-primary-200' : ''}
                    hover:bg-neutral-50 transition-colors cursor-pointer
                    ${date ? 'cursor-pointer' : 'cursor-default'}
                  `}
                  onClick={() => {
                    if (date && onDateClick) {
                      onDateClick(date);
                    }
                  }}
                >
                  {/* * Day number */}
                  {date && (
                    <div className={`
                      text-sm font-medium mb-1
                      ${isCurrentMonth ? 'text-neutral-900' : 'text-neutral-400'}
                      ${isToday ? 'text-primary-600 font-bold' : ''}
                    `}>
                      {date.getDate()}
                    </div>
                  )}

                  {/* * Events for this day */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event, eventIndex) => (
                      <div
                        key={event.id}
                        className={`
                          text-xs px-2 py-1 rounded truncate
                          ${event.type === 'class' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                          }
                          hover:opacity-80 transition-opacity cursor-pointer
                        `}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onEventClick) {
                            onEventClick(event);
                          }
                        }}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-neutral-500 text-center">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// * Event List Component (Alternative view)
interface EventListProps {
  events: Activity[];
  onEventClick?: (event: Activity) => void;
  className?: string;
  showDate?: boolean;
  showTime?: boolean;
}

export function EventList({
  events,
  onEventClick,
  className = '',
  showDate = true,
  showTime = true,
}: EventListProps) {
  // * Group events by date
  const groupedEvents = events.reduce((groups, event) => {
    const date = new Date(event.start_time).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {} as Record<string, Activity[]>);

  // * Sort events within each day by start time
  Object.keys(groupedEvents).forEach(date => {
    groupedEvents[date].sort((a, b) => 
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {Object.entries(groupedEvents).map(([date, dayEvents]) => (
        <div key={date}>
          <h4 className="text-sm font-semibold text-neutral-700 mb-2">
            {new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h4>
          <div className="space-y-2">
            {dayEvents.map(event => (
              <Card
                key={event.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                isPressable
                onPress={() => onEventClick?.(event)}
              >
                <CardBody className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-neutral-900 mb-1">
                        {event.title}
                      </h5>
                      <p className="text-sm text-neutral-600 mb-2">
                        {event.group.name}
                      </p>
                      {showTime && (
                        <p className="text-xs text-neutral-500">
                          {new Date(event.start_time).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })} - {new Date(event.end_time).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                    <div className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${event.type === 'class' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                      }
                    `}>
                      {event.type}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
