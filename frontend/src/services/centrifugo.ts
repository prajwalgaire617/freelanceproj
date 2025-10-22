import { Centrifuge } from 'centrifuge';
import axiosInstance from '../api/axios';

class CentrifugoService {
  private centrifuge: Centrifuge | null = null;
  private subscriptions: Map<string, any> = new Map();
  private isConnecting: boolean = false;
  private connectionPromise: Promise<void> | null = null;

  private isEnabled(): boolean {
    const ENV: any = (import.meta as any).env || {};
    return ENV.VITE_CENTRIFUGO_ENABLED === 'true';
  }

  async connect(userId: string) {
    // If already connected, return
    if (this.isConnected()) {
      console.log('✅ Centrifugo already connected');
      return;
    }

    // If currently connecting, wait for the connection
    if (this.isConnecting && this.connectionPromise) {
      console.log('🔄 Already connecting, waiting...');
      return this.connectionPromise;
    }

    // Start new connection
    this.isConnecting = true;
    this.connectionPromise = this._connect(userId);
    
    try {
      await this.connectionPromise;
    } finally {
      this.isConnecting = false;
      this.connectionPromise = null;
    }
  }

  private async _connect(userId: string) {
    try {
      if (!this.isEnabled()) {
        console.log('⚠️ Centrifugo disabled via VITE_CENTRIFUGO_ENABLED');
        return;
      }
      // Disconnect existing connection if any
      if (this.centrifuge) {
        this.centrifuge.disconnect();
        this.centrifuge = null;
      }

      // Get connection token from backend
      const response = await axiosInstance.post('/centrifugo/token', {
        userId,
        userInfo: {
          userId
        }
      });

      const { token, centrifugoUrl } = response.data.data;
      
      console.log('🔑 Token received:', token ? 'Yes' : 'No');
      console.log('🌐 Centrifugo URL from backend:', centrifugoUrl);

      // Resolve Centrifugo URL in order: Vite env -> backend; no localhost default to avoid noisy errors
      const envUrl = (import.meta as any).env?.VITE_CENTRIFUGO_URL as string | undefined;
      const resolvedUrl = envUrl || centrifugoUrl;
      if (!resolvedUrl) {
        console.log('⚠️ Centrifugo URL not provided; skipping connection');
        return;
      }
      console.log('🔧 Using Centrifugo URL:', resolvedUrl);

      // Create Centrifuge client
      this.centrifuge = new Centrifuge(resolvedUrl, {
        token,
      });

      // Setup connection handlers
      this.centrifuge.on('connecting', (ctx) => {
        console.log('🔄 Connecting to Centrifugo...', ctx);
      });

      this.centrifuge.on('connected', (ctx) => {
        console.log('✅ Connected to Centrifugo', ctx);
      });

      this.centrifuge.on('disconnected', (ctx) => {
        console.log('❌ Disconnected from Centrifugo', ctx);
      });

      this.centrifuge.on('error', (ctx) => {
        console.warn('❌ Centrifugo error (suppressed)', ctx?.type || ctx);
      });

      // Connect
      this.centrifuge.connect();

      console.log('🚀 Centrifugo service initialized for user:', userId);
    } catch (error) {
      console.warn('Failed to connect to Centrifugo (non-fatal):', error);
      throw error;
    }
  }

  subscribeToUserNotifications(
    userId: string,
    onNotification: (notification: any) => void
  ) {
    if (!this.isEnabled()) return null;
    if (!this.centrifuge) {
      // try to connect once lazily; fire and forget
      this.connect(userId).catch(() => {});
      return null;
    }

    const channelName = `user:${userId}`;
    console.log('🔔 Subscribing to user notifications:', channelName);

    // Check if subscription already exists
    let subscription = this.centrifuge.getSubscription(channelName);
    
    if (subscription) {
      console.log('🔄 User notification subscription already exists, re-attaching handlers');
      subscription.removeAllListeners();
    } else {
      subscription = this.centrifuge.newSubscription(channelName);
    }

    subscription.on('publication', (ctx) => {
      console.log('🔔 Notification received:', ctx.data);
      onNotification(ctx.data);
    });

    subscription.on('subscribed', (ctx) => {
      console.log('✅ Subscribed to user notifications:', channelName);
    });

    subscription.on('error', (ctx) => {
      console.error('❌ User notification subscription error:', ctx);
    });

    subscription.subscribe();
    this.subscriptions.set(channelName, subscription);

    return subscription;
  }

  subscribeToConversation(
    currentUserId: string,
    otherUserId: string,
    onMessage: (message: any) => void
  ) {
    if (!this.isEnabled()) return null;
    if (!this.centrifuge) {
      // try to connect once lazily; fire and forget
      this.connect(currentUserId).catch(() => {});
      return null;
    }

    // Create channel name (same format as backend)
    const channelName = this.getConversationChannel(currentUserId, otherUserId);

    console.log('📡 Subscribing to channel:', channelName);

    // Check if subscription already exists in Centrifuge client
    let subscription = this.centrifuge.getSubscription(channelName);
    
    if (subscription) {
      console.log('🔄 Subscription already exists, removing handlers and re-attaching');
      // Remove old listeners
      subscription.removeAllListeners();
      
      // Clear from our map
      if (this.subscriptions.has(channelName)) {
        this.subscriptions.delete(channelName);
      }
    } else {
      // Create new subscription
      console.log('✨ Creating new subscription');
      subscription = this.centrifuge.newSubscription(channelName);
    }

    subscription.on('publication', (ctx) => {
      console.log('📨 New message received:', ctx.data);
      onMessage(ctx.data);
    });

    subscription.on('subscribing', (ctx) => {
      console.log('🔄 Subscribing to channel...', ctx);
    });

    subscription.on('subscribed', (ctx) => {
      console.log('✅ Subscribed to channel:', channelName, ctx);
    });

    subscription.on('unsubscribed', (ctx) => {
      console.log('❌ Unsubscribed from channel:', ctx);
    });

    subscription.on('error', (ctx) => {
      console.error('❌ Subscription error:', ctx);
    });

    subscription.subscribe();

    this.subscriptions.set(channelName, subscription);

    return subscription;
  }

  unsubscribeFromUserNotifications(userId: string) {
    const channelName = `user:${userId}`;

    if (this.subscriptions.has(channelName)) {
      const subscription = this.subscriptions.get(channelName);
      try {
        subscription.unsubscribe();
        subscription.removeAllListeners();
        if (this.centrifuge && (this.centrifuge as any).subscriptions) {
          delete (this.centrifuge as any).subscriptions[channelName];
        }
      } catch (e) {
        console.warn('Warning while unsubscribing from user notifications:', e);
      }
      this.subscriptions.delete(channelName);
      console.log('🔔 Unsubscribed from user notifications:', channelName);
    }
  }

  unsubscribeFromConversation(currentUserId: string, otherUserId: string) {
    const channelName = this.getConversationChannel(currentUserId, otherUserId);

    if (this.subscriptions.has(channelName)) {
      const subscription = this.subscriptions.get(channelName);
      try {
        subscription.unsubscribe();
        subscription.removeAllListeners();
        // Important: Remove the subscription completely from Centrifuge client
        if (this.centrifuge && (this.centrifuge as any).subscriptions) {
          delete (this.centrifuge as any).subscriptions[channelName];
        }
      } catch (e) {
        console.warn('Warning while unsubscribing:', e);
      }
      this.subscriptions.delete(channelName);
      console.log('🔕 Unsubscribed from:', channelName);
    }
  }

  async sendMessage(receiverId: string, content: string) {
    try {
      const response = await axiosInstance.post('/messages', {
        receiverId,
        content
      });

      console.log('✅ Message sent:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      throw error;
    }
  }

  getConversationChannel(userId1: string, userId2: string): string {
    // Sort IDs to ensure consistent channel name regardless of order
    const sortedIds = [parseInt(userId1), parseInt(userId2)].sort((a, b) => a - b);
    return `chat:conversation:${sortedIds[0]}-${sortedIds[1]}`;
  }

  disconnect() {
    if (this.centrifuge) {
      // Unsubscribe from all channels
      this.subscriptions.forEach((subscription, channel) => {
        subscription.unsubscribe();
        subscription.removeAllListeners();
        console.log('🔕 Unsubscribed from:', channel);
      });
      this.subscriptions.clear();

      // Disconnect
      this.centrifuge.disconnect();
      this.centrifuge = null;
      console.log('🔌 Centrifugo disconnected');
    }
    
    // Reset connection state
    this.isConnecting = false;
    this.connectionPromise = null;
  }

  isConnected(): boolean {
    return this.centrifuge !== null && this.centrifuge.getState() === 'connected';
  }
}

// Export singleton instance
const centrifugoService = new CentrifugoService();
export default centrifugoService;

