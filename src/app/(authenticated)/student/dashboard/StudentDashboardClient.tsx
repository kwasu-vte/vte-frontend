'use client';

import React from 'react';
import { Card, CardBody, Button, Chip, Spinner } from '@heroui/react';
import { 
  BookOpen, Users, QrCode, Calendar, User, 
  RefreshCw, AlertCircle, CheckCircle2, Clock 
} from 'lucide-react';
import { useStudentDashboardData } from '@/lib/hooks/use-student-dashboard-data';

interface StudentDashboardClientProps {
  userId: string;
}

export function StudentDashboardClient({ userId }: StudentDashboardClientProps) {
  const { profile, enrollment, upcomingPracticals, error, isLoading } = useStudentDashboardData(userId);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // * Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-default-50 p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-default-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // * Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-default-50 p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-danger mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-default-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-default-600 mb-4">{error.message}</p>
          <Button color="primary" onPress={handleRefresh}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const enrollmentStatus = enrollment?.status || 'Not Enrolled';
  const upcomingCount = upcomingPracticals.length;
  const groupNumber = enrollment?.group?.group_number || '—';
  const groupSize = enrollment?.group?.current_student_count || '0';

  return (
    <div className="min-h-screen bg-default-50 p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-default-900">Dashboard</h1>
          <p className="text-sm text-default-600 mt-1">
            {enrollment ? `${enrollment.skill?.title} - ${enrollmentStatus}` : 'Welcome back'}
          </p>
        </div>
        <Button
          color="default"
          variant="flat"
          size="sm"
          isLoading={isRefreshing}
          startContent={!isRefreshing && <RefreshCw className="h-4 w-4" />}
          onPress={handleRefresh}
        >
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Status" 
          value={enrollmentStatus}
          icon={enrollment ? CheckCircle2 : AlertCircle}
          color={enrollment ? "success" : "default"}
        />
        <StatCard 
          title="Group" 
          value={groupNumber}
          icon={Users}
          color={enrollment?.group ? "primary" : "default"}
        />
        <StatCard 
          title="Upcoming" 
          value={upcomingCount}
          icon={Clock}
          color={upcomingCount > 0 ? "warning" : "default"}
        />
        <StatCard 
          title="Group Size" 
          value={groupSize}
          icon={Users}
          color="default"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Next Step Card */}
          <Card shadow="sm">
            <CardBody className="p-5">
              <NextStepContent profile={profile} enrollment={enrollment} />
            </CardBody>
          </Card>

          {/* Enrollment Details */}
          {enrollment && (
            <Card shadow="sm">
              <CardBody className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-default-900 mb-1">
                      {enrollment.skill?.title}
                    </h3>
                    <p className="text-sm text-default-600">
                      Group {groupNumber} • {groupSize} students
                    </p>
                  </div>
                  <Chip 
                    color={enrollment.status === 'assigned' ? 'success' : 'primary'}
                    variant="flat"
                    size="sm"
                  >
                    {enrollment.status}
                  </Chip>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Upcoming Practicals */}
          {enrollment && upcomingPracticals.length > 0 && (
            <Card shadow="sm">
              <CardBody className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-default-900">
                    Upcoming Sessions
                  </h3>
                  <Chip size="sm" variant="flat">
                    {upcomingPracticals.length}
                  </Chip>
                </div>
                <div className="space-y-3">
                  {upcomingPracticals.map((practical, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-default-100"
                    >
                      <span className="font-medium text-sm text-default-900">
                        {practical.skill}
                      </span>
                      <span className="text-sm text-default-600">
                        {new Date(practical.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Right Column - Quick Actions */}
        <div className="lg:col-span-1">
          <Card shadow="sm">
            <CardBody className="p-5">
              <h3 className="font-semibold text-default-900 mb-4">Quick Actions</h3>
              <QuickActionButtons enrollment={enrollment} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  const colorClasses = {
    success: 'bg-success-50 border-success-200 text-success-600',
    primary: 'bg-primary-50 border-primary-200 text-primary-600',
    warning: 'bg-warning-50 border-warning-200 text-warning-600',
    default: 'bg-default-100 border-default-200 text-default-600',
  };

  return (
    <Card shadow="none" className={`border ${colorClasses[color]?.split(' ')[1] || 'border-default-200'}`}>
      <CardBody className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-default-600 uppercase mb-1">
              {title}
            </p>
            <p className="text-xl font-bold text-default-900">{value}</p>
          </div>
          {Icon && (
            <Icon className={`h-5 w-5 ${colorClasses[color]?.split(' ')[2] || 'text-default-600'}`} />
          )}
        </div>
      </CardBody>
    </Card>
  );
}

function NextStepContent({ profile, enrollment }: any) {
  const status = (enrollment?.status || '').toString().toLowerCase();
  const payStatus = (enrollment?.payment_status || '').toString().toLowerCase();
  
  let config = {
    title: 'All Set!',
    description: 'Check your upcoming sessions and group details.',
    ctaLabel: '',
    ctaHref: '',
    color: 'success' as const,
    icon: CheckCircle2,
  };

  if (!profile) {
    config = {
      title: 'Complete Your Profile',
      description: 'Add your details to enable enrollment in skills.',
      ctaLabel: 'Complete Profile',
      ctaHref: '/student/profile',
      color: 'primary',
      icon: User,
    };
  } else if (!enrollment) {
    config = {
      title: 'Enroll in a Skill',
      description: 'Choose a practical training program to get started.',
      ctaLabel: 'Browse Skills',
      ctaHref: '/student/skills',
      color: 'primary',
      icon: BookOpen,
    };
  } else if (payStatus === 'failed') {
    config = {
      title: 'Payment Failed',
      description: 'Please retry your payment to continue with enrollment.',
      ctaLabel: 'Retry Payment',
      ctaHref: '/student/enrollment',
      color: 'danger',
      icon: AlertCircle,
    };
  } else if (payStatus.includes('pending') || payStatus === 'unpaid' || status === 'unpaid' || status.includes('pending')) {
    config = {
      title: 'Payment Pending',
      description: 'Complete your payment to secure your spot.',
      ctaLabel: 'Complete Payment',
      ctaHref: '/student/enrollment',
      color: 'warning',
      icon: Clock,
    };
  } else if (['paid', 'assigned'].includes(status)) {
    const awaitingGroup = status === 'paid' && !enrollment.group?.id;
    config = {
      title: awaitingGroup ? 'Awaiting Group Assignment' : 'Group Assigned',
      description: awaitingGroup ? 'You will be assigned to a group soon.' : 'View your group details and schedule.',
      ctaLabel: awaitingGroup ? 'View Status' : 'View Group',
      ctaHref: awaitingGroup ? '/student/enrollment' : '/student/my-group',
      color: 'success',
      icon: awaitingGroup ? Clock : Users,
    };
  } else if (status === 'cancelled') {
    config = {
      title: 'Enrollment Cancelled',
      description: 'Browse and enroll in another skill.',
      ctaLabel: 'Browse Skills',
      ctaHref: '/student/skills',
      color: 'warning',
      icon: AlertCircle,
    };
  }

  const Icon = config.icon;

  return (
    <div className="flex items-start gap-4">
      <div className={`flex-shrink-0 p-2 rounded-lg ${
        config.color === 'success' ? 'bg-success-100' :
        config.color === 'primary' ? 'bg-primary-100' :
        config.color === 'warning' ? 'bg-warning-100' :
        config.color === 'danger' ? 'bg-danger-100' : 'bg-default-100'
      }`}>
        <Icon className={`h-5 w-5 ${
          config.color === 'success' ? 'text-success-600' :
          config.color === 'primary' ? 'text-primary-600' :
          config.color === 'warning' ? 'text-warning-600' :
          config.color === 'danger' ? 'text-danger-600' : 'text-default-600'
        }`} />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-default-900 mb-1">{config.title}</h3>
        <p className="text-sm text-default-600 mb-3">{config.description}</p>
        {config.ctaHref && (
          <Button
            as="a"
            href={config.ctaHref}
            color={config.color}
            size="sm"
            variant="flat"
          >
            {config.ctaLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

function QuickActionButtons({ enrollment }: any) {
  const actions = [
    {
      label: 'Browse Skills',
      href: '/student/skills',
      icon: BookOpen,
      color: 'primary' as const,
    },
    {
      label: 'My Profile',
      href: '/student/profile',
      icon: User,
      color: 'default' as const,
    },
  ];

  if (enrollment?.group) {
    actions.push(
      {
        label: 'My Group',
        href: '/student/my-group',
        icon: Users,
        color: 'primary' as const,
      },
      {
        label: 'Mark Attendance',
        href: '/student/scan-qr',
        icon: QrCode,
        color: 'success' as const,
      },
      {
        label: 'View Schedule',
        href: '/student/schedule',
        icon: Calendar,
        color: 'default' as const,
      }
    );
  }

  return (
    <div className="space-y-2">
      {actions.map((action) => (
        <Button
          key={action.label}
          as="a"
          href={action.href}
          color={action.color}
          variant="flat"
          className="w-full justify-start"
          startContent={<action.icon className="h-4 w-4" />}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}