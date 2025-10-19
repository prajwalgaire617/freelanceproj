import React, { useEffect, useState } from 'react';
import { Inbox } from '@novu/react';
import { useNavigate } from 'react-router';

export function NovuInbox() {
  const navigate = useNavigate();
  const [subscriberId, setSubscriberId] = useState(null);
  
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && user.id) {
        setSubscriberId(user.id.toString());
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }, []);

  // Don't render until we have subscriber ID
  if (!subscriberId) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Inbox
      applicationIdentifier="NAiOuTU5VtKH"
      subscriberId={subscriberId}
      routerPush={(path) => navigate(path)}
      // Enable real-time updates
      backendUrl="https://api.novu.co"
      socketUrl="https://ws.novu.co"
     
      // Notification interaction handlers
      onNotificationClick={(notification) => {
        console.log('Notification clicked:', notification);
        
        // Handle navigation based on notification payload
        if (notification.data?.jobPostId) {
          navigate(`/jobs/${notification.data.jobPostId}`);
        }
      }}
      
    />
  );
}