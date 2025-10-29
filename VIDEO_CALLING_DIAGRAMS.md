# Jitsi Video Calling - Visual Flow Diagram

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        WORKLAB VIDEO CALLING                    │
│                         Architecture Diagram                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐                              ┌──────────────────┐
│   User A         │                              │   User B         │
│  (Caller)        │                              │  (Receiver)      │
└────────┬─────────┘                              └────────┬─────────┘
         │                                                 │
         │ 1. Clicks "Start Video Call"                   │
         │                                                 │
         ▼                                                 │
┌─────────────────────────────────────────────────────────┴────────┐
│              MessagingInterface Component                         │
│  • Generates room name: worklab-call-5-12                        │
│  • Opens VideoCallModal for User A                               │
│  • Sends video_call message to backend                           │
└─────────────┬────────────────────────────────────────────────────┘
              │
              │ 2. POST /api/messages
              │    messageType: 'video_call'
              │
              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend API Server                            │
│  • Saves video call message to database                         │
│  • Broadcasts to Centrifugo WebSocket                           │
└─────────────┬────────────────────────────────────────────────────┘
              │
              │ 3. Real-time broadcast
              │
              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Centrifugo WebSocket Server                     │
│  • Publishes to conversation channel                            │
│  • Delivers to User B in real-time                              │
└─────────────┬────────────────────────────────────────────────────┘
              │
              │ 4. WebSocket message
              │
              ▼
┌─────────────────────────────────────────────────────────────────┐
│           User B's MessagingInterface Component                  │
│  • Receives video call invitation                               │
│  • Renders VideoCallInvitation component in chat                │
│  • Shows "Join Call" button                                     │
└─────────────┬────────────────────────────────────────────────────┘
              │
              │ 5. User B clicks "Join Call"
              │
              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VideoCallModal Opens                          │
│  • Both users connect to same Jitsi room                        │
│  • Room: worklab-call-5-12                                      │
└─────────────┬────────────────────────────────────────────────────┘
              │
              │ 6. Jitsi Meet SDK establishes connection
              │
              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Jitsi Meet Server                            │
│  (meet.jit.si or self-hosted)                                   │
│  • Facilitates WebRTC connections                               │
│  • Handles signaling                                            │
└─────────────┬────────────────────────────────────────────────────┘
              │
              │ 7. WebRTC peer-to-peer video/audio streams
              │
              ▼
┌──────────────────┐                              ┌──────────────────┐
│   User A         │◄────────────────────────────►│   User B         │
│  Video Call UI   │    Direct Video/Audio Stream │  Video Call UI   │
└──────────────────┘                              └──────────────────┘
```

## 🔄 Message Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                   VIDEO CALL MESSAGE FLOW                        │
└─────────────────────────────────────────────────────────────────┘

User Action
    │
    ▼
┌─────────────────────────────────────┐
│  Start Video Call Button Clicked    │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  Generate Unique Room Name                          │
│  Format: worklab-call-{min_id}-{max_id}            │
│  Example: worklab-call-5-12                        │
└─────────────────┬───────────────────────────────────┘
                  │
                  ├─────────────────┬──────────────────┐
                  ▼                 ▼                  ▼
    ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
    │ Open Video Modal │  │ Send API Request │  │ Save to Database │
    │ for Caller       │  │ with message     │  │ as video_call    │
    └──────────────────┘  └─────────┬────────┘  └──────────────────┘
                                    │
                                    ▼
                          ┌──────────────────────┐
                          │ Centrifugo Broadcast │
                          │ to Conversation      │
                          └─────────┬────────────┘
                                    │
                                    ▼
                          ┌──────────────────────┐
                          │ Receiver's Browser   │
                          │ Gets WebSocket Event │
                          └─────────┬────────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────────┐
                    │ VideoCallInvitation Component    │
                    │ Rendered in Chat                 │
                    └─────────┬────────────────────────┘
                              │
                              ▼
                    ┌──────────────────────────────────┐
                    │ User Clicks "Join Call"          │
                    └─────────┬────────────────────────┘
                              │
                              ▼
                    ┌──────────────────────────────────┐
                    │ Open Video Modal for Receiver    │
                    │ Connect to Same Room             │
                    └─────────┬────────────────────────┘
                              │
                              ▼
                    ┌──────────────────────────────────┐
                    │ Both Users in Video Call         │
                    │ Peer-to-Peer Connection          │
                    └──────────────────────────────────┘
```

## 🎬 Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                 REACT COMPONENT HIERARCHY                        │
└─────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────┐
                    │  MessagesPage       │
                    │  /messages          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ MessagingInterface  │
                    │                     │
                    │ • Conversations     │
                    │ • Selected Chat     │
                    │ • Messages List     │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
    ┌────────────────┐  ┌─────────────────┐  ┌──────────────────┐
    │ Message        │  │ ContractMessage │  │ VideoCall        │
    │ (text/file)    │  │ Component       │  │ Invitation       │
    └────────────────┘  └─────────────────┘  └────────┬─────────┘
                                                       │
                                                       │ onClick
                                                       │ Join Call
                                                       ▼
                                            ┌───────────────────────┐
                                            │ VideoCallModal        │
                                            │                       │
                                            │ • JitsiMeeting        │
                                            │ • Control Bar         │
                                            │ • Camera/Mic Toggle   │
                                            │ • Screen Share        │
                                            │ • End Call Button     │
                                            └───────────────────────┘
```

## 🗃️ Database Schema Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE STRUCTURE                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│                   Users Table                     │
├───────────────┬──────────────────────────────────┤
│ id (PK)       │ INTEGER                          │
│ firstName     │ VARCHAR                          │
│ lastName      │ VARCHAR                          │
│ email         │ VARCHAR                          │
│ userType      │ ENUM (freelancer/client/agency) │
└───────────────┴──────────────────────────────────┘
        │                            │
        │                            │
        ▼                            ▼
┌──────────────────────────────────────────────────┐
│                 Messages Table                    │
├───────────────┬──────────────────────────────────┤
│ id (PK)       │ INTEGER                          │
│ senderId (FK) │ INTEGER → Users.id               │
│ receiverId(FK)│ INTEGER → Users.id               │
│ content       │ TEXT (JSON for video_call)       │
│ messageType   │ ENUM (text/image/file/          │
│               │       system/contract/           │
│               │       video_call) ◄── NEW!       │
│ contractId    │ INTEGER (nullable)               │
│ sentAt        │ DATETIME                         │
│ isRead        │ BOOLEAN                          │
└───────────────┴──────────────────────────────────┘

Video Call Message Example:
┌──────────────────────────────────────────────────┐
│ id: 123                                          │
│ senderId: 5                                      │
│ receiverId: 12                                   │
│ content: '{                                      │
│   "type": "video_call_invitation",              │
│   "roomName": "worklab-call-5-12",             │
│   "callerName": "John Doe",                     │
│   "callerId": 5                                 │
│ }'                                              │
│ messageType: 'video_call'    ◄── NEW!          │
│ sentAt: 2025-01-26 10:30:00                    │
└──────────────────────────────────────────────────┘
```

## 🎨 UI Layout Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    MESSAGES PAGE LAYOUT                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  WorkLab                                            [User Menu]   │
├──────────────┬───────────────────────────────────────────────────┤
│              │  John Doe                    [📹 Start Video Call] │
│ Conversations│  ─────────────────────────────────────────────────│
│ List         │                                                    │
├──────────────┤  ┌──────────────────────────────────────────────┐ │
│ [Avatar] Bob │  │ 📹 John Doe is calling...                    │ │
│ Latest msg.. │  │ Join the video call to connect               │ │
│              │  │                                  [Join Call]  │ │
│ [Avatar] Sara│  └──────────────────────────────────────────────┘ │
│ Latest msg.. │                                                    │
│              │  Hey, how's the project going?                    │
│ [Avatar] Mike│                                                    │
│ Latest msg.. │  Great! Almost done with the design               │
│              │                                                    │
│ [Avatar] Lisa│  ┌──────────────────────────────────────────────┐ │
│ Latest msg.. │  │ You started a video call                     │ │
│              │  │ Waiting for the other person to join         │ │
│              │  │                                 [Rejoin Call] │ │
│              │  └──────────────────────────────────────────────┘ │
│              │                                                    │
│              │  Can we discuss the requirements?                 │
├──────────────┼────────────────────────────────────────────────────┤
│              │  [📎] [Type message...              ] [➤ Send]    │
└──────────────┴────────────────────────────────────────────────────┘
```

## 🎥 Video Call Modal Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  Video Call - worklab-call-5-12                   [Connecting...] │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│                                                                   │
│                      JITSI MEET IFRAME                           │
│                                                                   │
│                  [Main Video Stream]                             │
│                                                                   │
│                                                                   │
│  [Thumbnail]  [Thumbnail]  [Thumbnail]                          │
│  Your Video   Remote 1     Remote 2                             │
│                                                                   │
├──────────────────────────────────────────────────────────────────┤
│                  CONTROL BAR (Dark Overlay)                      │
│                                                                   │
│         [🎤]      [📹]      [🖥️]      [☎️]                       │
│       Mute     Camera   Screen     End Call                      │
│                         Share                                     │
└──────────────────────────────────────────────────────────────────┘
```

## 📊 State Management Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│            MESSAGINGINTERFACE STATE FLOW                         │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  MessagingInterface Component State        │
├────────────────────────────────────────────┤
│  • conversations: Conversation[]           │
│  • selectedConversationId: number | null   │
│  • message: string                         │
│  • attachments: File[]                     │
│  • showVideoCall: boolean        ◄── NEW!  │
│  • videoCallRoomName: string     ◄── NEW!  │
└────────────────┬───────────────────────────┘
                 │
                 │ User clicks "Start Video Call"
                 │
                 ▼
┌────────────────────────────────────────────┐
│  setShowVideoCall(true)                    │
│  setVideoCallRoomName("worklab-call-...")  │
└────────────────┬───────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────┐
│  sendVideoCallInvitation(roomName)         │
│  • POST /api/messages                      │
│  • messageType: 'video_call'               │
└────────────────┬───────────────────────────┘
                 │
                 ├──────────────┬─────────────┐
                 ▼              ▼             ▼
        ┌─────────────┐  ┌──────────┐  ┌──────────┐
        │ Save to DB  │  │Centrifugo│  │ Update   │
        │             │  │Broadcast │  │ Local UI │
        └─────────────┘  └──────────┘  └──────────┘
                                             │
                                             ▼
                                   ┌──────────────────┐
                                   │ VideoCallModal   │
                                   │ Opens            │
                                   └──────────────────┘
```

## 🔐 Security & Privacy Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  SECURITY ARCHITECTURE                           │
└─────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────┐
                    │   User Initiates    │
                    │   Video Call        │
                    └──────────┬──────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────┐
        │  1. Generate Unique Room Name            │
        │     Format: worklab-call-{id1}-{id2}    │
        │     Example: worklab-call-5-12          │
        └──────────────────┬───────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────────┐
        │  2. Room Name Privacy                    │
        │     ✓ Not exposed in UI                 │
        │     ✓ Only in message JSON              │
        │     ✓ Only sender & receiver know       │
        └──────────────────┬───────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────────┐
        │  3. Browser Permissions                  │
        │     ✓ Camera access request             │
        │     ✓ Microphone access request         │
        │     ✓ User must explicitly allow        │
        └──────────────────┬───────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────────┐
        │  4. Jitsi Meet Connection                │
        │     ✓ End-to-end encryption (default)   │
        │     ✓ Peer-to-peer when possible        │
        │     ✓ TURN servers for NAT traversal    │
        └──────────────────┬───────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────────┐
        │  5. WebRTC Security                      │
        │     ✓ DTLS-SRTP encryption              │
        │     ✓ No data retention on servers      │
        │     ✓ Direct browser-to-browser         │
        └──────────────────┬───────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────────┐
        │  6. Session Management                   │
        │     ✓ Room deleted when empty           │
        │     ✓ No persistent room storage        │
        │     ✓ Can rejoin via saved invitation   │
        └──────────────────────────────────────────┘
```

## 📈 Performance Considerations

```
┌─────────────────────────────────────────────────────────────────┐
│                  PERFORMANCE OPTIMIZATIONS                       │
└─────────────────────────────────────────────────────────────────┘

Component Rendering:
├─ MessagingInterface: Memoized conversations
├─ VideoCallInvitation: Only renders for video_call messages
└─ VideoCallModal: Lazy loaded, only when showVideoCall = true

Network:
├─ WebSocket: Centrifugo for real-time invitations (< 100ms)
├─ API Calls: Single POST request for invitation
└─ WebRTC: Peer-to-peer video (lowest latency)

Video Quality:
├─ Adaptive bitrate based on bandwidth
├─ Falls back to lower quality on slow connections
└─ Screen sharing uses separate stream

Memory:
├─ Jitsi iframe cleaned up on modal close
├─ WebRTC connections properly disposed
└─ No video buffering in memory
```

---

## 🎯 Key Takeaways

1. **Simple Integration**: One button click starts a video call
2. **Real-time**: Invitations appear instantly via WebSocket
3. **Persistent**: Call invitations saved as messages
4. **Private**: Unique room names per conversation
5. **Secure**: End-to-end encryption, peer-to-peer when possible
6. **Free**: Uses Jitsi's free infrastructure (or self-host)
7. **Responsive**: Works on desktop and mobile

---

This diagram shows how all the pieces fit together to create a seamless video calling experience in WorkLab!
