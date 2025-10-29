# Jitsi Video Calling - Quick Start

## 🎥 What's New

WorkLab now supports video calling! Click the "Start Video Call" button in any conversation to begin a face-to-face meeting.

## ⚡ Quick Setup

1. **Already Installed** ✅
   - Jitsi React SDK installed
   - Components created
   - Database updated

2. **Environment Variables** ✅
   - Check `frontend/.env` for Jitsi configuration
   - Default: Uses free Jitsi service at `meet.jit.si`

3. **Run Migration**
   ```bash
   cd /Users/prajwalgaire/worklab
   npm run migrate
   ```

4. **Start App**
   ```bash
   # Terminal 1: Backend
   npm run dev

   # Terminal 2: Frontend
   cd frontend && npm run dev
   ```

## 🎮 How to Use

### Start a Call
1. Go to Messages page
2. Select any conversation
3. Click "Start Video Call" button (top right)
4. Video interface opens automatically
5. Wait for other person to join

### Join a Call
1. Receive video call invitation in chat
2. Click "Join Call" button
3. Video interface opens
4. Start talking!

### During Call
- 🎤 **Toggle Mic**: Click microphone icon
- 📹 **Toggle Camera**: Click camera icon  
- 🖥️ **Share Screen**: Click monitor icon
- ☎️ **End Call**: Click red phone icon

## 🏗️ What Was Implemented

### Frontend
- ✅ `VideoCallModal.tsx` - Full-screen video interface
- ✅ `VideoCallInvitation.tsx` - Call invitation cards in chat
- ✅ Updated `MessagingInterface.tsx` with video call button
- ✅ Real-time call invitations via Centrifugo

### Backend
- ✅ Added `video_call` message type to constants
- ✅ Updated Message model ENUM
- ✅ Created database migration
- ✅ Video call messages saved to database

### Database
- ✅ Messages table supports `messageType = 'video_call'`
- ✅ Call invitations stored as regular messages

## 📁 Files Created/Modified

### New Files
```
frontend/src/components/messaging/VideoCallModal.tsx
frontend/src/components/messaging/VideoCallInvitation.tsx
src/db/migrations/20250126000000-add-video-call-to-message-type.js
VIDEO_CALLING_GUIDE.md (detailed docs)
VIDEO_CALLING_QUICKSTART.md (this file)
```

### Modified Files
```
frontend/src/components/messaging/MessagingInterface.tsx
src/constants/index.js
src/db/models/message.js
frontend/.env
frontend/package.json (added @jitsi/react-sdk)
```

## 🔍 Testing

1. **Test Basic Call**:
   - Login as two different users (two browsers)
   - Start conversation between them
   - User 1: Click "Start Video Call"
   - User 2: Should see invitation in real-time
   - User 2: Click "Join Call"
   - Both should see each other's video

2. **Test Controls**:
   - Toggle microphone - audio should mute/unmute
   - Toggle camera - video should turn on/off
   - Share screen - screen should be visible
   - End call - should close video interface

3. **Test Message Persistence**:
   - Start a call
   - Close browser
   - Reopen and check messages
   - Call invitation should still be visible
   - Click "Rejoin Call" to reconnect

## ⚙️ Configuration

### Default Settings (in `frontend/.env`)
```env
VITE_JITSI_DOMAIN=meet.jit.si
VITE_CENTRIFUGO_ENABLED=true
VITE_CENTRIFUGO_URL=ws://localhost:8000/connection/websocket
# Keep this unset or false to avoid browser CORS warnings in dev
VITE_CENTRIFUGO_HEALTHCHECK_ENABLED=false
```

### Use Your Own Jitsi Server (Optional)
```env
VITE_JITSI_DOMAIN=meet.yourdomain.com
```

### Using 8x8/JAAS or secure domains
- If you set `VITE_JITSI_DOMAIN` to a JAAS domain (e.g., `8x8.vc`) you must also provide a valid JWT:

```env
VITE_JITSI_DOMAIN=8x8.vc
VITE_JITSI_JWT=eyJhbGciOi...   # token that grants moderator/participant access
```

- If a JAAS domain is configured but no `VITE_JITSI_JWT` is present, the app will automatically fall back to `meet.jit.si` to avoid the "No moderator found. Click to login" prompt.
- To self-host Jitsi with authenticated rooms, configure your deployment and set `VITE_JITSI_DOMAIN` and `VITE_JITSI_JWT` accordingly.

### Meet.jit.si lobby (membersOnly) and how to fix it

You may see this in the browser console when joining free rooms:

```
CONFERENCE FAILED: conference.connectionError.membersOnly ... @lobby.meet.jit.si
```

This means the room was put behind Jitsi's Lobby (anti-abuse) and requires a moderator to admit participants. On meet.jit.si there is no reliable way to force-disable Lobby from the client, and if both users join at the same time there may be no moderator to admit anyone.

Try these mitigations first (no server change):
- Set these frontend flags and restart the dev server:
   ```env
   VITE_JITSI_OPEN_IN_NEW_TAB=true
   VITE_JITSI_PREJOIN_ENABLED=true
   VITE_JITSI_DISABLE_THIRD_PARTY=false
   VITE_JITSI_DOMAIN=meet.jit.si
   ```
- Start the call (caller first), then have the receiver click Join after ~1.5s.
- Use long, unique room names (already handled automatically).

If you still hit Lobby, switch to JAAS (recommended) or self-host Jitsi.

### Recommended: Enable JAAS with dynamic JWTs (no more Lobby)

1) Create a free JaaS project and get credentials:
- App ID (used in the path prefix)
- API Key ID (kid)
- API Key Secret

2) Add these to your backend `.env`:
```env
JAAS_APP_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
JAAS_API_KEY_ID=your_kid
JAAS_API_KEY_SECRET=your_secret
```

3) Add these to your frontend `frontend/.env`:
```env
VITE_JITSI_DOMAIN=8x8.vc
VITE_JITSI_APP_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # same as JAAS_APP_ID
VITE_JITSI_OPEN_IN_NEW_TAB=true
VITE_JITSI_PREJOIN_ENABLED=true
```

4) How it works now
- When you start/answer a call, the frontend will request a short-lived JWT from the backend at `POST /api/jitsi/token?room=ROOM&moderator=true|false`.
- The call opens at: `https://8x8.vc/vpaas-magic-cookie-<APP_ID>/<ROOM>?jwt=<TOKEN>#...`
- The caller joins as moderator; the receiver as a regular participant.
- Result: no Lobby/membersOnly and reliable joins.

No extra UI steps are required; this is fully integrated into the Start/Join flow.

## 🚨 Common Issues

**Video not working?**
- Check browser camera/mic permissions
- Try Chrome or Firefox
- Allow popups from localhost

**Can't hear audio?**
- Check browser audio permissions  
- Unmute microphone in video controls
- Check system audio settings

**Call invitation not appearing?**
- Verify Centrifugo is running
- Check WebSocket connection in browser console
- Refresh both browser windows

**No ringtone on incoming call?**
- Some browsers block autoplay. Click anywhere on the page, then try again.
- Keep the tab focused at least once after login to grant audio context.
- Ensure system output volume is up and not muted.

**Seeing /health CORS warnings in console?**
- Ensure `VITE_CENTRIFUGO_HEALTHCHECK_ENABLED=false` (or unset) and rebuild frontend; WS will still connect normally.

## 🎯 Key Features

✅ **One-click calling** - No setup needed  
✅ **Real-time invitations** - Instant notifications  
✅ **Persistent invitations** - Rejoin anytime  
✅ **Full controls** - Camera, mic, screen share  
✅ **Private rooms** - Unique per conversation  
✅ **Mobile friendly** - Works on phones/tablets  
✅ **Free to use** - Uses Jitsi's free service  

## 📦 Package Information

```json
{
  "@jitsi/react-sdk": "^1.4.0"
}
```

## 🔐 Privacy & Security

- ✅ Unique room per conversation pair
- ✅ Room names not publicly listed
- ✅ End-to-end encryption (Jitsi default)
- ✅ No call recording by default
- ✅ Peer-to-peer video when possible

## 🎨 UI Components

**Video Call Button**
- Location: Top-right of chat header
- Icon: Video camera
- Label: "Start Video Call"

**Call Invitation Card**
- Style: Blue gradient background
- Shows: Caller name, join button
- Appears: In message list

**Video Modal**
- Size: Full screen (90vh)
- Controls: Bottom overlay bar
- Style: Professional dark theme

## 📖 For More Details

See `VIDEO_CALLING_GUIDE.md` for:
- Architecture details
- Self-hosting Jitsi
- Advanced configuration
- Troubleshooting guide
- Future enhancements

## ✨ Enjoy Video Calling!

Your WorkLab platform now supports professional video calls. Users can communicate face-to-face directly from the messaging interface!

---

**Quick Links:**
- Jitsi Documentation: https://jitsi.github.io/handbook/
- Jitsi React SDK: https://github.com/jitsi/jitsi-meet-react-sdk
- Self-Hosting Guide: https://jitsi.github.io/handbook/docs/devops-guide/
