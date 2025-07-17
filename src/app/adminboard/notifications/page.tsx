'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New subscription', message: 'John Doe subscribed to the Pro plan', read: false, date: '2 hours ago' },
    { id: 2, title: 'Payment received', message: 'Payment of $19.99 from Jane Smith', read: false, date: '5 hours ago' },
    { id: 3, title: 'System update', message: 'Scheduled maintenance tomorrow at 2 AM', read: true, date: '1 day ago' },
    { id: 4, title: 'New feature', message: 'Check out our new reporting dashboard', read: true, date: '2 days ago' },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </div>
          <Button variant="outline" size="sm">
            Mark all as read
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 border rounded-lg ${notification.read ? 'bg-white' : 'bg-blue-50 border-blue-200'}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${notification.read ? 'bg-gray-100' : 'bg-blue-100'}`}>
                    <Bell className={`h-4 w-4 ${notification.read ? 'text-gray-600' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!notification.read && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => markAsRead(notification.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deleteNotification(notification.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsPage;