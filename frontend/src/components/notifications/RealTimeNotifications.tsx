import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import centrifugoService from '@/services/centrifugo';
import { useNavigate } from 'react-router-dom';

export const RealTimeNotifications: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const enabled = (import.meta as any).env?.VITE_CENTRIFUGO_ENABLED === 'true';
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!user || !enabled) return;
    if (!centrifugoService.isRealtimeEnabled() || centrifugoService.isSessionDisabled()) return;
    if (initializedRef.current) return;

    console.log('🔔 Setting up real-time notifications for user:', user.id);

    // Connect to Centrifugo and subscribe to user notifications
    const setupNotifications = async () => {
      try {
        if (!centrifugoService.isConnected()) {
          console.log('🔔 Attempting to connect to Centrifugo for user:', user.id);
          await centrifugoService.connect(user.id.toString());
        }
        
        // Subscribe to user notifications
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
              console.log('💬 Processing message notification:', notificationData);
              const messageData = notificationData.data;
              
              console.log('💬 Message from:', messageData.sender);
              console.log('💬 Message content preview:', messageData.content?.substring(0, 50));
              console.log('💬 Adding toast notification...');
              
              // Navigate to correct messages page based on user type
              const messagesPath = user.userType === 'client' ? '/clientmessages' : '/messages';
              
              addNotification({
                type: 'info',
                title: 'New Message',
                message: `You have a new message from ${messageData.sender?.firstName || 'Someone'}`,
                action: {
                  label: 'View Messages',
                  onClick: () => {
                    navigate(messagesPath);
                  }
                }
              });
              
              console.log('✅ Message notification toast added');
            } else {
              console.log('⚠️ Unknown notification type:', notificationData.type);
              console.log('⚠️ Full notification data:', notificationData);
            }
          }
        );
        if (!sub) return; // no logs if disabled/deferred
      } catch (error) {
        console.error('❌ Failed to setup real-time notifications:', error);
      }
    };

    // Avoid double-init in React StrictMode
    setupNotifications();
    initializedRef.current = true;

    // Cleanup on unmount
    return () => {
      if (user) {
        centrifugoService.unsubscribeFromUserNotifications(user.id.toString());
        centrifugoService.disconnect();
      }
      initializedRef.current = false;
    };
  }, [user, addNotification, navigate, enabled]);

  return null; // This component doesn't render anything
};
