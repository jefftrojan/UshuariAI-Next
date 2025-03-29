// components/OrganizationApprovalNotification.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { XIcon } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  status: "read" | "unread";
  createdAt: string;
}

interface OrganizationApprovalNotificationProps {
  organizationId: string;
}

const OrganizationApprovalNotification = ({
  organizationId,
}: OrganizationApprovalNotificationProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);

      // In a real app, this would fetch from your API
      // For demo purposes, we'll mock a notification based on user role

      // Simulate API call
      setTimeout(() => {
        // Mock notifications
        const mockNotifications: Notification[] = [
          {
            id: "notif-1",
            title: "Organization Status Updated",
            message:
              "Your organization has been approved! You can now receive and handle legal assistance calls.",
            status: "unread",
            createdAt: new Date().toISOString(),
          },
        ];

        setNotifications(mockNotifications);
        setIsLoading(false);

        // Show notification if there are any unread ones
        if (mockNotifications.some((n) => n.status === "unread")) {
          setShow(true);
        }
      }, 1000);
    };

    fetchNotifications();
  }, [organizationId]);

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    // In a real app, this would be an API call
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, status: "read" as const }
          : notification
      )
    );
  };

  // Dismiss notification
  const dismiss = () => {
    setShow(false);

    // Mark all as read
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        status: "read" as const,
      }))
    );
  };

  if (!show || notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-md w-full bg-white border border-blue-200 rounded-lg shadow-lg overflow-hidden z-50">
      <div className="bg-blue-500 text-white px-4 py-2 flex justify-between items-center">
        <h3 className="font-medium">Organization Updates</h3>
        <button
          onClick={dismiss}
          className="text-white hover:text-blue-100"
          aria-label="Close notifications"
        >
          <XIcon size={18} />
        </button>
      </div>

      <div className="p-4 max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-md border ${
                  notification.status === "unread"
                    ? "border-blue-200 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <h4 className="font-medium text-gray-800">
                  {notification.title}
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  {notification.message}
                </p>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                  {notification.status === "unread" && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationApprovalNotification;
