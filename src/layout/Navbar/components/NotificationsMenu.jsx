import { useSelector, useDispatch } from 'react-redux';
import { markAllAsRead } from '../../../features/notifications/notificationsSlice';
import { Bell, Check, Clock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const NotificationsMenu = () => {
  const notifications = useSelector((state) => state.notifications.notifications);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (time) => {
    // Add your time formatting logic here
    return time;
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="btn btn-ghost btn-sm sm:btn-md relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary text-secondary-content text-xs flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-screen sm:w-96 max-w-[calc(100vw-2rem)] transform transition-all">
          <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden">
            <div className="p-4 border-b border-base-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    className="btn btn-ghost btn-xs gap-2"
                    onClick={() => dispatch(markAllAsRead())}
                  >
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline">Mark all as read</span>
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-y-auto max-h-[60vh] sm:max-h-[400px] overscroll-contain">
              {notifications.length > 0 ? (
                <ul className="divide-y divide-base-200">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className={`p-4 transition-colors ${
                        notification.isUnread ? 'bg-base-200/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium ${notification.isUnread ? 'text-base-content' : 'text-base-content/70'}`}
                          >
                            {notification.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-sm text-base-content/60">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(notification.time)}</span>
                          </div>
                        </div>
                        {notification.isUnread && (
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center text-base-content/60">
                  <p>No notifications</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-base-200 bg-base-100">
                <button
                  className="btn btn-ghost btn-sm w-full text-base-content/70"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsMenu;
