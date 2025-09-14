// * Student My Group Page
// * Shows the student's assigned group and group members
// * Follows the same pattern as other pages with StateRenderer + React Query

'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent, DefaultEmptyComponent } from '@/components/shared/StateRenderer';
import { api } from '@/lib/api';
import { Group, User } from '@/lib/types';
import { Button, Card, CardBody, CardHeader, Chip, Avatar, AvatarGroup, Progress, Divider } from '@nextui-org/react';
import { Users, Calendar, Clock, MapPin, BookOpen, User, MessageCircle, Phone, Mail } from 'lucide-react';

interface GroupMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  level: string;
  avatar?: string;
  isOnline?: boolean;
}

interface GroupDetails {
  id: string;
  name: string;
  skill: {
    id: string;
    title: string;
    description: string;
  };
  mentor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    specialization?: string;
  };
  members: GroupMember[];
  schedule: {
    start: string;
    end: string;
    days: string[];
    location?: string;
  };
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
  announcements: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    author: string;
  }[];
}

export default function StudentMyGroupPage() {
  // * React Query for data fetching - get student's group details
  const {
    data: groupDetails,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['student-group'],
    queryFn: async () => {
      // TODO: Implement student group details endpoint
      // For now, return mock data
      return {
        id: 'group-1',
        name: 'Group A',
        skill: {
          id: 'skill-1',
          title: 'Web Development',
          description: 'Learn modern web development with React, Node.js, and databases'
        },
        mentor: {
          id: 'mentor-1',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@example.com',
          phone: '+234 801 234 5678',
          specialization: 'Full-Stack Development'
        },
        members: [
          {
            id: 'student-1',
            firstName: 'You',
            lastName: 'Student',
            email: 'you@example.com',
            level: '300',
            isOnline: true
          },
          {
            id: 'student-2',
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@example.com',
            level: '300',
            isOnline: false
          },
          {
            id: 'student-3',
            firstName: 'Bob',
            lastName: 'Johnson',
            email: 'bob.johnson@example.com',
            level: '400',
            isOnline: true
          },
          {
            id: 'student-4',
            firstName: 'Alice',
            lastName: 'Brown',
            email: 'alice.brown@example.com',
            level: '300',
            isOnline: false
          }
        ],
        schedule: {
          start: '2024-01-15',
          end: '2024-06-15',
          days: ['Monday', 'Wednesday', 'Friday'],
          location: 'Lab 1, Computer Science Building'
        },
        progress: {
          completed: 8,
          total: 12,
          percentage: 67
        },
        announcements: [
          {
            id: 'announcement-1',
            title: 'Project Submission Deadline',
            content: 'Remember that the final project is due next Friday. Please ensure all components are working properly.',
            createdAt: '2024-01-20T10:00:00Z',
            author: 'John Smith'
          },
          {
            id: 'announcement-2',
            title: 'Lab Session Cancelled',
            content: 'Today\'s lab session has been cancelled due to maintenance. We will resume next week.',
            createdAt: '2024-01-18T14:30:00Z',
            author: 'John Smith'
          }
        ]
      } as GroupDetails;
    },
  });

  // * Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // * Get member initials for avatar
  const getMemberInitials = (member: GroupMember) => {
    return `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase();
  };

  // * Get online members count
  const onlineMembers = groupDetails?.members.filter(member => member.isOnline).length || 0;

  return (
    <div className="space-y-6">
      {/* * Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">My Group</h1>
          <p className="text-neutral-600 mt-1">
            View your group details, members, and progress
          </p>
        </div>
      </div>

      {/* * Group Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <StateRenderer
          data={groupDetails}
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
                message="You are not assigned to any group yet. Contact an administrator to get assigned to a group."
                actionButton={
                  <Button
                    color="primary"
                    startContent={<Users className="w-4 h-4" />}
                    onPress={() => window.location.href = '/student/skills'}
                  >
                    Browse Skills
                  </Button>
                }
              />
            </div>
          }
        >
          {(data) => (
            <div className="p-6 space-y-6">
              {/* * Group Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-neutral-900">{data.name}</h2>
                  <p className="text-lg text-neutral-600">{data.skill.title}</p>
                  <p className="text-sm text-neutral-500">{data.skill.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Chip color="primary" variant="flat">
                    {data.members.length} Members
                  </Chip>
                  <Chip color="success" variant="flat">
                    {onlineMembers} Online
                  </Chip>
                </div>
              </div>

              {/* * Progress Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-neutral-900">Course Progress</h3>
                  <span className="text-sm text-neutral-600">
                    {data.progress.completed} of {data.progress.total} modules completed
                  </span>
                </div>
                <Progress
                  value={data.progress.percentage}
                  color="primary"
                  className="w-full"
                />
                <div className="text-center text-sm text-neutral-600">
                  {data.progress.percentage}% Complete
                </div>
              </div>

              <Divider />

              {/* * Schedule Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Schedule</h3>
                      <p className="text-sm text-neutral-600">Class timings and location</p>
                    </div>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-600">Duration:</span>
                        <span className="font-medium">
                          {formatDate(data.schedule.start)} - {formatDate(data.schedule.end)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-600">Days:</span>
                        <span className="font-medium">{data.schedule.days.join(', ')}</span>
                      </div>
                      {data.schedule.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-neutral-400" />
                          <span className="text-neutral-600">Location:</span>
                          <span className="font-medium">{data.schedule.location}</span>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Mentor</h3>
                      <p className="text-sm text-neutral-600">Your group mentor</p>
                    </div>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <div className="space-y-2">
                      <div className="font-medium text-neutral-900">
                        {data.mentor.firstName} {data.mentor.lastName}
                      </div>
                      {data.mentor.specialization && (
                        <div className="text-sm text-neutral-600">
                          {data.mentor.specialization}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-600">{data.mentor.email}</span>
                      </div>
                      {data.mentor.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-neutral-400" />
                          <span className="text-neutral-600">{data.mentor.phone}</span>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* * Group Members */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-900">Group Members</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.members.map((member) => (
                    <Card key={member.id}>
                      <CardBody className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar
                              name={getMemberInitials(member)}
                              size="md"
                              className="text-sm"
                            />
                            {member.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-neutral-900">
                                {member.firstName} {member.lastName}
                              </span>
                              {member.id === 'student-1' && (
                                <Chip size="sm" color="primary" variant="flat">
                                  You
                                </Chip>
                              )}
                            </div>
                            <div className="text-sm text-neutral-600">{member.email}</div>
                            <div className="text-xs text-neutral-500">Level {member.level}</div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              onPress={() => {
                                // TODO: Open chat with member
                                console.log('Chat with', member.firstName);
                              }}
                            >
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>

              {/* * Announcements */}
              {data.announcements.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neutral-900">Recent Announcements</h3>
                  <div className="space-y-3">
                    {data.announcements.map((announcement) => (
                      <Card key={announcement.id}>
                        <CardBody className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-neutral-900">
                                {announcement.title}
                              </h4>
                              <span className="text-xs text-neutral-500">
                                {new Date(announcement.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-600">
                              {announcement.content}
                            </p>
                            <div className="text-xs text-neutral-500">
                              By {announcement.author}
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </StateRenderer>
      </div>

      {/* * Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-neutral-900">Course Materials</h3>
                <p className="text-sm text-neutral-600">Access learning resources</p>
              </div>
              <Button
                color="primary"
                variant="light"
                size="sm"
                onPress={() => {
                  // TODO: Navigate to course materials
                  console.log('View course materials');
                }}
              >
                View
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-neutral-900">Group Chat</h3>
                <p className="text-sm text-neutral-600">Chat with group members</p>
              </div>
              <Button
                color="primary"
                variant="light"
                size="sm"
                onPress={() => {
                  // TODO: Open group chat
                  console.log('Open group chat');
                }}
              >
                Chat
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-neutral-900">Schedule</h3>
                <p className="text-sm text-neutral-600">View upcoming sessions</p>
              </div>
              <Button
                color="primary"
                variant="light"
                size="sm"
                onPress={() => {
                  // TODO: Navigate to schedule
                  console.log('View schedule');
                }}
              >
                View
              </Button>
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
          <p><strong>Group ID:</strong> {groupDetails?.id || 'None'}</p>
          <p><strong>Members Count:</strong> {groupDetails?.members.length || 0}</p>
          <p><strong>Online Members:</strong> {onlineMembers}</p>
        </div>
      </div>
    </div>
  );
}
