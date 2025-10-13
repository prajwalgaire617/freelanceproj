import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, Paperclip, X, FileText, Download, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import axiosInstance from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import centrifugoService from "@/services/centrifugo";

interface Message {
  id: number;
  sender: "me" | "them";
  text: string;
  time: string;
  files?: { name: string; type: string; url: string }[];
}

interface Conversation {
  id: number;
  name: string;
  img: string;
  messages: Message[];
}

export function MessagingInterface() {
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get("userId");
  const { user } = useAuth();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🚀 Connect to Centrifugo when component mounts
  useEffect(() => {
    if (user) {
      console.log('🚀 Initializing real-time chat for user:', user.id);
      fetchAllConversations();
      
      // Connect to Centrifugo WebSocket
      centrifugoService.connect(user.id.toString()).catch(err => {
        console.error("Failed to connect to Centrifugo:", err);
        toast.error("Failed to connect to real-time messaging");
      });
    }

    // Cleanup on unmount
    return () => {
      console.log('🔌 Disconnecting from Centrifugo');
      centrifugoService.disconnect();
    };
  }, [user]);

  // If userId is provided in URL, open that conversation
  useEffect(() => {
    if (targetUserId && user) {
      initiateConversationWithUser(parseInt(targetUserId));
    } else if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [targetUserId, conversations, user]);

  // 🔔 Subscribe to real-time messages when conversation is selected
  useEffect(() => {
    if (selectedConversationId && user) {
      console.log('🔔 Subscribing to real-time messages for conversation:', selectedConversationId);
      
      // Subscribe to this conversation
      centrifugoService.subscribeToConversation(
        user.id.toString(),
        selectedConversationId.toString(),
        (messageData) => {
          console.log('📨 Real-time message received:', messageData);
          
          // Add the message to the conversation
          const newMessage: Message = {
            id: messageData.id || Date.now(),
            sender: messageData.senderId === user.id ? "me" : "them",
            text: messageData.content,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          };

          setConversations(prev =>
            prev.map(c =>
              c.id === selectedConversationId ? { ...c, messages: [...c.messages, newMessage] } : c
            )
          );

          // Show notification if message is from other user
          if (messageData.senderId !== user.id) {
            toast.success("New message received");
          }
        }
      );

      // Cleanup: unsubscribe when conversation changes
      return () => {
        if (selectedConversationId && user) {
          centrifugoService.unsubscribeFromConversation(
            user.id.toString(),
            selectedConversationId.toString()
          );
        }
      };
    }
  }, [selectedConversationId, user]);

  const fetchAllConversations = async () => {
    try {
      setLoadingConversations(true);
      const token = localStorage.getItem("token");
      
      const response = await axiosInstance.get("/messages/conversations", {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("MessagingInterface: Fetched conversations:", response.data);

      const apiConversations = response.data.conversations || [];
      
      // Transform API conversations to UI format
      const formattedConversations: Conversation[] = apiConversations.map((conv: any) => ({
        id: conv.otherUser.id,
        name: `${conv.otherUser.firstName} ${conv.otherUser.lastName}`,
        img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.otherUser.firstName}`,
        messages: [] // Will be loaded when conversation is selected
      }));

      setConversations(formattedConversations);
      
      // If no conversation is selected and we have conversations, select the first one
      if (!selectedConversationId && formattedConversations.length > 0) {
        setSelectedConversationId(formattedConversations[0].id);
        fetchMessageHistory(formattedConversations[0].id);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
      toast.error("Failed to load conversations");
    } finally {
      setLoadingConversations(false);
    }
  };

  const initiateConversationWithUser = async (userId: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Fetch user details
      const userResponse = await axiosInstance.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const targetUser = userResponse.data.user || userResponse.data;
      
      // Check if conversation already exists
      const existingConv = conversations.find(c => c.id === userId);
      
      if (existingConv) {
        setSelectedConversationId(existingConv.id);
      } else {
        // Create new conversation
        const newConversation: Conversation = {
          id: userId,
          name: `${targetUser.firstName} ${targetUser.lastName}`,
          img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${targetUser.firstName}`,
          messages: []
        };
        
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversationId(userId);
        
        // Fetch message history
        fetchMessageHistory(userId);
      }
    } catch (err: any) {
      console.error("Error initiating conversation:", err);
      toast.error("Failed to start conversation");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessageHistory = async (userId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/messages/conversation/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.messages) {
        const formattedMessages: Message[] = response.data.messages.map((msg: any) => ({
          id: msg.id,
          sender: msg.senderId === user?.id ? "me" : "them",
          text: msg.content,
          time: new Date(msg.createdAt).toLocaleTimeString()
        }));
        
        setConversations(prev => prev.map(conv => 
          conv.id === userId ? { ...conv, messages: formattedMessages } : conv
        ));
        
        // Mark messages as read
        await axiosInstance.put(
          `/messages/mark-read`,
          { senderId: userId },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...newFiles]);
    e.target.value = ''; // Reset input to allow re-selecting same files
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // 📤 Send message via API (backend will broadcast via Centrifugo)
  const sendMessage = async () => {
    if (!message.trim() && attachments.length === 0) return;
    if (!selectedConversationId) return;

    try {
      const token = localStorage.getItem("token");
      
      console.log('📤 Sending message to user:', selectedConversationId);
      
      // Send message to backend - it will save to DB and broadcast via Centrifugo
      const response = await axiosInstance.post(
        '/messages',
        {
          receiverId: selectedConversationId,
          content: message
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('✅ Message sent successfully:', response.data);

      // Add message to UI immediately (optimistic update)
      const newMessage: Message = {
        id: response.data.message?.id || Date.now(),
        sender: "me",
        text: message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        files: attachments.length > 0
          ? attachments.map(file => ({
              name: file.name,
              type: file.type,
              url: URL.createObjectURL(file)
            }))
          : undefined,
      };

      setConversations(prev =>
        prev.map(c =>
          c.id === selectedConversationId ? { ...c, messages: [...c.messages, newMessage] } : c
        )
      );

      setMessage("");
      setAttachments([]);
      
      // Message will be broadcast to other user via Centrifugo automatically by backend
    } catch (err: any) {
      console.error("Error sending message:", err);
      toast.error(err.response?.data?.error || "Failed to send message");
    }
  };

  useEffect(() => {
    if (selectedConversation) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedConversation?.messages]);

  if (loading || loadingConversations) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">No conversations yet</p>
          <p className="text-sm text-muted-foreground">Send a message to start a conversation</p>
        </div>
      </div>
    );
  }

  if (!selectedConversation) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 h-screen p-4">
      {/* Conversations List */}
      <Card className="md:col-span-1 flex flex-col overflow-y-scroll">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1">
          <ScrollArea className="h-full">
            {conversations.map(conversation => {
              const lastMessage = conversation.messages[conversation.messages.length - 1];
              return (
                <div
                  key={conversation.id}
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-accent transition rounded-md ${
                    selectedConversationId === conversation.id ? "bg-accent" : ""
                  }`}
                  onClick={() => {
                    setSelectedConversationId(conversation.id);
                    if (conversation.messages.length === 0) {
                      fetchMessageHistory(conversation.id);
                    }
                  }}
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={conversation.img} />
                    <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{conversation.name}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {lastMessage?.text || (lastMessage?.files && `${lastMessage.files.length} file${lastMessage.files.length > 1 ? 's' : ''}`)}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">{lastMessage?.time}</span>
                </div>
              );
            })}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="md:col-span-2 flex flex-col overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={selectedConversation.img} />
              <AvatarFallback>{selectedConversation.name[0]}</AvatarFallback>
            </Avatar>
            <CardTitle>{selectedConversation.name}</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {selectedConversation.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[70%] rounded-lg p-3 relative ${
                    msg.sender === "me" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    {msg.files && msg.files.length > 0 && (
                      <div className="mb-2 space-y-2">
                        {msg.files.map((file, index) => (
                          <div key={index} className="flex flex-col gap-2">
                            {file.type.startsWith("image") ? (
                              <div className="relative">
                                <img src={file.url} alt={file.name} className="max-h-40 rounded-lg" />
                                <div className="flex items-center justify-between bg-muted rounded p-2 mt-1">
                                  <span className="truncate text-xs text-blue-500">{file.name}</span>
                                  <a
                                    href={file.url}
                                    download={file.name}
                                    className="ml-2 text-blue-500 text-sm flex items-center gap-1"
                                  >
                                    <Download className="w-4 h-4" />
                                    Download
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between bg-muted rounded p-2">
                                <FileText className="mr-2" />
                                <span className="truncate text-blue-500">{file.name}</span>
                                <a
                                  href={file.url}
                                  download={file.name}
                                  className="ml-2 text-blue-500 text-sm"
                                >
                                  Download
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-sm">{msg.text}</p>
                    <span className={`text-xs mt-1 block ${
                      msg.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}>{msg.time}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex gap-2 items-center flex-wrap">
              <label htmlFor="attachment" className="cursor-pointer">
                <Button asChild variant="outline" size="icon">
                  <span>
                    <Paperclip className="w-4 h-4" />
                  </span>
                </Button>
              </label>
              <input
                type="file"
                id="attachment"
                className="hidden"
                multiple
                onChange={handleFileChange}
              />
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted p-1 px-2 rounded">
                      <span className="text-xs truncate max-w-[150px]">{file.name}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeAttachment(index)}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
