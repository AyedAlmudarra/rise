import React from 'react';
import { Card, Timeline, Badge } from 'flowbite-react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import {
  IconArrowRight,
  IconCalendar,
  IconCheck
} from "@tabler/icons-react";

// Mock data (copied from StartupDashboard for now - replace with dynamic data later)
const recentActivities = [
  { id: 1, action: 'Updated financial metrics', timestamp: '2 hours ago', user: 'You' },
  { id: 2, action: 'Investor from Blue Capital viewed your pitch deck', timestamp: '1 day ago', user: 'Sarah Chen' },
  { id: 3, action: 'Added team member profile', timestamp: '3 days ago', user: 'You' },
  { id: 4, action: 'Received new funding match', timestamp: '1 week ago', user: 'System' },
];

const upcomingTasks = [
  { id: 1, title: 'Investor meeting with VentureX', date: 'Tomorrow, 2:00 PM', priority: 'high' },
  { id: 2, title: 'Update financial projections', date: 'Next Monday', priority: 'medium' },
  { id: 3, title: 'Complete pitch deck revisions', date: 'In 3 days', priority: 'high' },
];

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/startup/dashboard',
    title: 'Startup Dashboard',
  },
  {
    title: 'Activity & Tasks',
  },
];

const StartupActivityPage = () => {
  // TODO: Add state and useEffect to fetch real activity/task data

  // Function body copied from StartupDashboard.tsx (renderActivitySection)
  const renderActivityContent = () => {
    // TODO: Add loading/error handling based on real data fetching
    // if (dataLoading || dataError) return null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Timeline */}
        <Card>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Activity</h3>
            {/* TODO: Link button to full activity log page? */}
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
              View all <IconArrowRight size={14} className="ml-1" />
            </button>
          </div>

          <Timeline>
            {recentActivities.map((activity) => (
              <Timeline.Item key={activity.id}>
                <Timeline.Point />
                <Timeline.Content>
                  <Timeline.Time>{activity.timestamp}</Timeline.Time>
                  <Timeline.Title>{activity.action}</Timeline.Title>
                  <Timeline.Body>
                    <span className="text-sm text-gray-500 dark:text-gray-400">By {activity.user}</span>
                  </Timeline.Body>
                </Timeline.Content>
              </Timeline.Item>
            ))}
            {/* TODO: Add placeholder if no activities exist */}
          </Timeline>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Upcoming Tasks</h3>
            {/* TODO: Link button to calendar/task management page? */}
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
              View calendar <IconCalendar size={14} className="ml-1" />
            </button>
          </div>

          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-lg border ${
                  task.priority === 'high'
                    ? 'border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10'
                    : task.priority === 'medium'
                    ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-900/30 dark:bg-yellow-900/10'
                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white text-sm">{task.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{task.date}</p>
                  </div>
                  <div className="flex items-start">
                    <Badge
                      color={task.priority === 'high' ? 'failure' : task.priority === 'medium' ? 'warning' : 'info'}
                      size="xs"
                    >
                      {task.priority}
                    </Badge>
                    {/* TODO: Implement task completion logic */}
                    <button className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <IconCheck size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
             {/* TODO: Add placeholder if no tasks exist */}

            {/* TODO: Implement add task functionality */}
            <button className="w-full py-2 text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center mt-2">
              <IconArrowRight size={14} className="mr-1" /> Add new task
            </button>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <>
      <BreadcrumbComp title="Activity & Tasks" items={BCrumb} />
      {renderActivityContent()}
    </>
  );
};

export default StartupActivityPage; 