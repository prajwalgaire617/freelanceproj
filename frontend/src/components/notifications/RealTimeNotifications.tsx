import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import centrifugoService from '@/services/centrifugo';
import { useNavigate } from 'react-router-dom';

export const RealTimeNotifications: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const enabled = (import.meta as any).env?.VITE_CENTRIFUGO_ENABLED === 'true';

  useEffect(() => {
    if (!user || !enabled) return;

    console.log('🔔 Setting up real-time notifications for user:', user.id);

    // Connect to Centrifugo and subscribe to user notifications
    const setupNotifications = async () => {
      try {
        console.log('🔔 Attempting to connect to Centrifugo for user:', user.id);
        await centrifugoService.connect(user.id.toString());
        
        // Subscribe to user notifications
        console.log('🔔 Subscribing to user notifications for user:', user.id);
        const sub = centrifugoService.subscribeToUserNotifications(
          user.id.toString(),
          (notificationData) => {
            console.log('🔔 Real-time notification received:', notificationData);
            console.log('🔔 Notification type:', notificationData.type);
            
            // Handle different types of notifications
            if (notificationData.type === 'contract_notification') {
              console.log('📋 Processing contract notification:', notificationData);
              const contractData = notificationData.data;
              
              console.log('📋 Contract data:', contractData);
              console.log('📋 Adding notification to UI...');
              
              addNotification({
                type: 'info',
                title: contractData.title,
                message: contractData.message,
                action: {
                  label: 'View Contract',
                  onClick: () => {
                    navigate('/contracts');
                  }
                }
              });
              
              console.log('✅ Contract notification added to UI');
            } else if (notificationData.type === 'message_notification') {
              const messageData = notificationData.data;
              
              addNotification({
                type: 'info',
                title: 'New Message',
                message: `You have a new message from ${messageData.sender?.firstName || 'Someone'}`,
                action: {
                  label: 'View Messages',
                  onClick: () => {
                    navigate('/messages');
                  }
                }
              });
            }
          }
        );
        if (!sub) {
          console.log('ℹ️ Centrifugo subscription deferred or disabled');
        }
      } catch (error) {
        console.error('❌ Failed to setup real-time notifications:', error);
      }
    };

    setupNotifications();

    // Cleanup on unmount
    return () => {
      if (user) {
        centrifugoService.unsubscribeFromUserNotifications(user.id.toString());
        centrifugoService.disconnect();
      }
    };
  }, [user, addNotification, navigate, enabled]);

  return null; // This component doesn't render anything
};
