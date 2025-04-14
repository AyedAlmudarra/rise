import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Badge, Button, Dropdown } from 'flowbite-react';
import SimpleBar from 'simplebar-react';
import { Link } from 'react-router-dom';

// Define a basic structure for a notification (adjust as needed)
interface NotificationType {
  id: string;
  icon: string; // Icon name or component
  bgcolor: string; // Background color class for icon
  color: string; // Text color class for icon
  title: string;
  subtitle: string;
  time: string;
  read: boolean;
  link?: string; // Optional link for the notification
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    // TODO: Fetch notifications from backend/API here
    // Example: fetchNotifications().then(data => { setNotifications(data.items); setUnreadCount(data.unread); });
    // For now, we'll keep it empty
    setNotifications([]);
    setUnreadCount(0);
  }, []); // Fetch on mount

  const handleMarkAllRead = () => {
    // TODO: Implement logic to mark all notifications as read in the backend
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    console.log('Marking all notifications as read');
  };

  const handleNotificationClick = (notification: NotificationType) => {
    // TODO: Implement logic to mark notification as read in backend
    // TODO: Implement navigation if notification.link exists
    console.log('Notification clicked:', notification.id);
    if (!notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(notifications.map(n => n.id === notification.id ? { ...n, read: true } : n));
    }
    // Example navigation: if (notification.link) navigate(notification.link);
  };


  return (
    <div className="relative group/menu">
      <Dropdown
        label=""
        className="w-screen sm:w-[360px] py-6 rounded-sm shadow-lg" // Added shadow
        dismissOnClick={false}
        renderTrigger={() => (
          <button className="relative h-10 w-10 hover:bg-lightprimary dark:hover:bg-darkprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary focus:outline-none">
            <Icon icon="solar:bell-bing-line-duotone" height={20} />
            {unreadCount > 0 && (
              <span className="rounded-full absolute end-1 top-1 bg-error text-[10px] h-4 w-4 flex justify-center items-center text-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        )}
      >
        <div className="flex items-center px-6 justify-between border-b pb-3 mb-3 dark:border-gray-700">
          <h3 className="mb-0 text-lg font-semibold text-ld dark:text-white">Notifications</h3>
          {unreadCount > 0 && <Badge color={'primary'}>{unreadCount} new</Badge>}
        </div>

        <SimpleBar className="max-h-80">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              notification.link ? (
                 // Render as a Link
                 <Dropdown.Item
                   as={Link}
                   to={notification.link} // 'to' is valid here
                   className={`px-6 py-3 flex items-center bg-hover group/link w-full ${notification.read ? 'opacity-60' : ''}`}
                   key={notification.id}
                   onClick={() => handleNotificationClick(notification)}
                 >
                    {/* Duplicated Content Start - Consider abstracting if it gets complex */}
                    <div
                     className={`h-11 w-11 flex-shrink-0 rounded-full flex justify-center items-center ${notification.bgcolor}`}
                    >
                     <Icon icon={notification.icon} height={20} className={notification.color} />
                    </div>
                    <div className="ps-4 flex justify-between w-full items-start">
                     <div className="w-3/4 text-start">
                         <h5 className="mb-1 text-sm font-medium group-hover/link:text-primary dark:text-white">
                         {notification.title}
                         </h5>
                         <div className="text-xs text-darklink dark:text-gray-400 line-clamp-1">
                         {notification.subtitle}
                         </div>
                     </div>
                     <div className="text-xs text-gray-500 dark:text-gray-400 block self-start pt-1">
                         {notification.time}
                     </div>
                    </div>
                    {/* Duplicated Content End */}
                 </Dropdown.Item>
               ) : (
                 // Render as a standard div-like item
                 <Dropdown.Item
                   // No 'as' or 'to' prop needed here
                   className={`px-6 py-3 flex items-center bg-hover group/link w-full ${notification.read ? 'opacity-60' : ''}`}
                   key={notification.id}
                   onClick={() => handleNotificationClick(notification)}
                 >
                    {/* Duplicated Content Start - Consider abstracting if it gets complex */}
                     <div
                      className={`h-11 w-11 flex-shrink-0 rounded-full flex justify-center items-center ${notification.bgcolor}`}
                     >
                      <Icon icon={notification.icon} height={20} className={notification.color} />
                     </div>
                     <div className="ps-4 flex justify-between w-full items-start">
                      <div className="w-3/4 text-start">
                          <h5 className="mb-1 text-sm font-medium group-hover/link:text-primary dark:text-white">
                          {notification.title}
                          </h5>
                          <div className="text-xs text-darklink dark:text-gray-400 line-clamp-1">
                          {notification.subtitle}
                          </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 block self-start pt-1">
                          {notification.time}
                      </div>
                     </div>
                    {/* Duplicated Content End */}
                 </Dropdown.Item>
               )
            ))
          ) : (
             <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                <Icon icon="solar:bell-off-outline" className="mx-auto mb-2 text-gray-400 dark:text-gray-500" height={32}/>
                No new notifications
            </div>
          )}
        </SimpleBar>
        <div className="pt-5 px-6">
          <Button
            color={'primary'}
            className="w-full border border-primary text-primary hover:bg-primary hover:text-white"
            pill
            outline
            // TODO: Link this button to a dedicated "All Notifications" page
            // Example: as={Link} to="/notifications"
          >
            See All Notifications
          </Button>
        </div>
      </Dropdown>
    </div>
  );
};

export default Notifications;

