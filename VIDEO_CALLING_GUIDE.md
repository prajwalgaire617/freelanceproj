# Jitsi Video Calling Feature - Implementation Guide

## 🎥 Overview

WorkLab now includes integrated video calling functionality using Jitsi Meet. Users can initiate video calls directly from the messaging interface, allowing freelancers and clients to have face-to-face conversations without leaving the platform.

## ✨ Features

- **One-Click Video Calls**: Start a video call with any conversation partner
- **Real-time Invitations**: Video call invitations appear in the chat in real-time
- **Join Anytime**: Recipients can join ongoing calls by clicking the invitation
- **Full Video Controls**: 
  - Toggle camera on/off
  - Mute/unmute microphone
  - Screen sharing support
  - End call functionality
- **Persistent Room Names**: Unique room IDs ensure privacy between conversations
- **Mobile Responsive**: Works on desktop and mobile devices

## 🏗️ Architecture

### Frontend Components

1. **VideoCallModal** (`frontend/src/components/messaging/VideoCallModal.tsx`)
   - Full-screen video call interface
   - Integrates Jitsi Meet SDK
   - Custom control bar for call controls
   - Auto-cleanup on component unmount

2. **VideoCallInvitation** (`frontend/src/components/messaging/VideoCallInvitation.tsx`)
   - Displays video call invitations in the chat
   - Join/rejoin call buttons
   - Visual differentiation between sender and receiver

3. **MessagingInterface** (Updated)
   - Added "Start Video Call" button in chat header
   - Handles video call room creation
   - Sends video call invitation messages
   - Renders video call invitations in message list

### Backend Updates

1. **Message Types** (`src/constants/index.js`)
   - Added `VIDEO_CALL: 'video_call'` to MESSAGE_TYPES

2. **Database Model** (`src/db/models/message.js`)
   - Updated messageType ENUM to include `'video_call'`

3. **Migration** (`src/db/migrations/20250126000000-add-video-call-to-message-type.js`)
   - Adds `video_call` to the messageType ENUM in the database

## 🚀 Setup Instructions

### 1. Install Dependencies

The Jitsi React SDK has already been installed:
```bash
npm install @jitsi/react-sdk
```

### 2. Environment Configuration

The Jitsi domain is configured in `frontend/.env`:
```env
# Jitsi Video Calling
VITE_JITSI_DOMAIN=meet.jit.si
```

**Options:**
- **Use Jitsi's Free Service**: `meet.jit.si` (default, no setup required)
- **Self-Host Jitsi**: Install your own Jitsi server for more control and privacy
  - Follow: https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-quickstart
  - Update `VITE_JITSI_DOMAIN` to your server domain

### 3. Run Database Migration

```bash
cd /Users/prajwalgaire/worklab
npm run migrate
```

This adds the `video_call` message type to the database.

### 4. Start the Application

```bash
# Backend
cd /Users/prajwalgaire/worklab
npm run dev

# Frontend (in another terminal)
cd /Users/prajwalgaire/worklab/frontend
npm run dev
```

## 📖 Usage Guide

### For Users

1. **Starting a Call**:
   - Open any conversation in the Messages page
   - Click the "Start Video Call" button in the chat header
   - A video call invitation will be sent to the other person
   - You'll automatically join the video call room

2. **Receiving a Call**:
   - Video call invitations appear as special messages in the chat
   - Click the "Join Call" button to connect
   - The video interface will open automatically

3. **During the Call**:
   - Use the control bar at the bottom to:
     - Toggle microphone (mute/unmute)
     - Toggle camera (on/off)
     - Share your screen
     - End the call

4. **Rejoining a Call**:
   - Call invitations remain in the chat
   - Click "Rejoin Call" to return to an active call

### Call Privacy

- Each conversation pair has a unique room ID
- Room names are generated as: `worklab-call-{smaller-user-id}-{larger-user-id}`
- Only the two conversation participants know the room name
- Rooms are ephemeral - they exist only while someone is connected

## 🔧 Technical Details

### Room Name Generation

```typescript
const userId = Number(user.id);
const otherUserId = selectedConversationId;
const roomName = `worklab-call-${Math.min(userId, otherUserId)}-${Math.max(userId, otherUserId)}`;
```

This ensures:
- Same room for both participants regardless of who initiates
- Unique room per conversation pair
- Predictable format for debugging

### Message Format

Video call invitations are stored as messages with:
```typescript
{
  messageType: 'video_call',
  content: JSON.stringify({
    type: 'video_call_invitation',
    roomName: 'worklab-call-1-5',
    callerName: 'John Doe',
    callerId: 1
  })
}
```

### Jitsi Configuration

The Jitsi Meet instance is configured to:
- Start with audio and video enabled
- Hide moderator indicators
- Disable welcome page
- Enable prejoin bypass for seamless entry
- Customize toolbar buttons

## 🎨 UI/UX Features

1. **Visual Design**:
   - Video call button with video icon in chat header
   - Gradient-styled call invitations in blue
   - Full-screen modal for video calls
   - Custom control bar overlaying video

2. **Real-time Updates**:
   - Call invitations appear instantly via Centrifugo WebSocket
   - Toast notifications for call events
   - Loading indicators during connection

3. **Responsive Design**:
   - Mobile-friendly controls
   - Adaptive video layout
   - Touch-optimized buttons

## 🔒 Security & Privacy

1. **Room Security**:
   - Unique room names prevent unauthorized access
   - Rooms are not publicly listed
   - End-to-end encryption (when using Jitsi defaults)

2. **Data Privacy**:
   - Video/audio streams go directly between participants
   - No video recording by default
   - Call history saved as messages only

## 🚀 Advanced Configuration

### Self-Hosting Jitsi

For production environments, consider self-hosting Jitsi:

1. **Benefits**:
   - Full control over infrastructure
   - Custom branding
   - Better privacy
   - No external dependencies
   - Recording capabilities

2. **Setup**:
   ```bash
   # Install Jitsi Meet on Ubuntu/Debian
   wget -qO - https://download.jitsi.org/jitsi-key.gpg.key | sudo apt-key add -
   sudo sh -c "echo 'deb https://download.jitsi.org stable/' > /etc/apt/sources.list.d/jitsi-stable.list"
   sudo apt update
   sudo apt install jitsi-meet
   ```

3. **Configure WorkLab**:
   ```env
   VITE_JITSI_DOMAIN=meet.yourdomain.com
   ```

### Custom Branding

Modify `VideoCallModal.tsx` to customize:
```typescript
interfaceConfigOverwrite={{
  APP_NAME: 'WorkLab',
  SHOW_JITSI_WATERMARK: false,
  SHOW_WATERMARK_FOR_GUESTS: false,
  DEFAULT_BACKGROUND: '#1a1a1a',
  // ... more options
}}
```

## 🐛 Troubleshooting

### Video Not Loading
- Check browser permissions for camera/microphone
- Verify `VITE_JITSI_DOMAIN` is correctly set
- Check browser console for errors
- Try a different browser (Chrome/Firefox recommended)

### Can't Join Call
- Ensure both users are on the same room name
- Check network firewall settings
- Verify WebRTC is not blocked

### Poor Video Quality
- Check internet connection speed
- Reduce video quality in Jitsi settings
- Close other bandwidth-intensive applications

## 📊 Monitoring & Analytics

To track video call usage:

1. **Database Queries**:
   ```sql
   -- Count video call invitations
   SELECT COUNT(*) FROM messages WHERE messageType = 'video_call';
   
   -- Top users by video calls
   SELECT senderId, COUNT(*) as call_count 
   FROM messages 
   WHERE messageType = 'video_call' 
   GROUP BY senderId 
   ORDER BY call_count DESC;
   ```

2. **Add Analytics** (optional):
   - Track call duration
   - Monitor connection quality
   - Log technical issues

## 🎯 Future Enhancements

Potential improvements:
1. **Call Recording**: Save call recordings to cloud storage
2. **Call History**: Dedicated page showing past video calls
3. **Screen Sharing Notifications**: Alert when someone starts sharing
4. **Call Scheduling**: Schedule video calls for future dates
5. **Group Calls**: Support for multi-party video conferences
6. **Call Quality Indicators**: Show connection quality in real-time
7. **Virtual Backgrounds**: Blur or replace backgrounds
8. **Picture-in-Picture**: Continue browsing while in a call

## 📝 Notes

- Video calls use peer-to-peer connections when possible (better quality)
- Falls back to TURN servers when P2P is not available
- Default Jitsi service has usage limits - consider self-hosting for production
- Mobile support works best in Chrome/Safari

## 🆘 Support

If you encounter issues:
1. Check browser console for errors
2. Verify all migrations ran successfully
3. Ensure Centrifugo is running for real-time messaging
4. Test with different browsers
5. Check Jitsi Meet service status at https://status.jitsi.org/

---

**Congratulations!** 🎉 Your WorkLab platform now has professional video calling capabilities!
