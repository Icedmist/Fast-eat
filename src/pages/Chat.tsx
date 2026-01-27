import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MoreVertical, Phone, Video, Mic, Image, Smile, Send, Check, CheckCheck, Clock, MessageCircle } from 'lucide-react';
import { restaurants } from '@/data/restaurants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Mock chat data
const chats = [
    { id: '1', chefId: '1', name: 'Chef Mario', lastMessage: 'Your order is ready for pickup!', time: '10:30 AM', unread: 2, online: true, avatar: restaurants[0]?.image },
    { id: '2', chefId: '2', name: 'Chef Takumi', lastMessage: 'I can make that spicy for you.', time: 'Yesterday', unread: 0, online: false, avatar: restaurants[1]?.image },
    { id: '3', chefId: '3', name: 'Chef Sarah', lastMessage: 'Thanks for ordering!', time: 'Mon', unread: 0, online: true, avatar: restaurants[2]?.image },
];

const mockMessages = [
    { id: 1, text: 'Hi, is this available?', sender: 'me', time: '10:00 AM', status: 'read' },
    { id: 2, text: 'Yes, absolutely! Freshly made today.', sender: 'them', time: '10:05 AM', status: 'read' },
    { id: 3, text: 'Great, I will add it to my order.', sender: 'me', time: '10:06 AM', status: 'read' },
    { id: 4, text: 'Using voice message...', isAudio: true, duration: '0:15', sender: 'them', time: '10:07 AM', status: 'read' },
    { id: 5, text: 'Perfect, looking forward to it!', sender: 'me', time: '10:08 AM', status: 'sent' },
];

const Chat = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeChatId, setActiveChatId] = useState<string | null>(id || null);
    const [messages, setMessages] = useState(mockMessages);
    const [newMessage, setNewMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (id) setActiveChatId(id);
    }, [id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, activeChatId]);

    const activeChat = chats.find(c => c.chefId === activeChatId) || chats[0];

    const handleSend = () => {
        if (!newMessage.trim()) return;
        setMessages([...messages, {
            id: messages.length + 1,
            text: newMessage,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
        }]);
        setNewMessage('');
    };

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row h-[100dvh]">
            {/* Chat List (Sidebar on Desktop, Full on Mobile if no active chat) */}
            <div className={`w-full md:w-80 bg-card border-r border-border flex flex-col ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-1 mb-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-xl font-bold font-serif">Messages</h1>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search chefs..." className="pl-9 bg-secondary/50 border-none" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChatId(chat.chefId)}
                            className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-secondary/50 transition-colors ${activeChatId === chat.chefId ? 'bg-secondary/50' : ''}`}
                        >
                            <div className="relative">
                                <img src={chat.avatar || '/placeholder.png'} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                                {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-0.5">
                                    <h3 className="font-semibold text-foreground truncate">{chat.name}</h3>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.time}</span>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                            </div>
                            {chat.unread > 0 && (
                                <div className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {chat.unread}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Interface */}
            <div className={`flex-1 flex flex-col bg-background ${!activeChatId ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
                {!activeChatId ? (
                    <div className="text-center text-muted-foreground p-8">
                        <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>Select a conversation to start chatting</p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="p-3 sm:p-4 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur-sm z-10">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Button variant="ghost" size="icon" onClick={() => setActiveChatId(null)} className="md:hidden h-8 w-8">
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                                <div className="relative shrink-0">
                                    <img src={activeChat.avatar} alt={activeChat.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="font-bold text-sm sm:text-base text-foreground truncate">{activeChat.name}</h2>
                                    <span className="text-[10px] sm:text-xs text-green-500 font-medium flex items-center gap-1">
                                        {activeChat.online ? 'Online' : 'Offline'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-0.5 sm:gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="w-4 h-4 text-muted-foreground" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8"><Video className="w-4 h-4 text-muted-foreground" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4 text-muted-foreground" /></Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50 texture-linen relative">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${msg.sender === 'me'
                                            ? 'bg-primary text-primary-foreground rounded-br-none'
                                            : 'bg-card text-card-foreground rounded-bl-none border border-border/50'
                                            }`}
                                    >
                                        {msg.isAudio ? (
                                            <div className="flex items-center gap-2 min-w-[150px]">
                                                <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                                    <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-current border-b-[5px] border-b-transparent ml-0.5" />
                                                </button>
                                                <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                                                    <div className="h-full w-1/3 bg-current rounded-full" />
                                                </div>
                                                <span className="text-xs font-mono opacity-80">{msg.duration}</span>
                                            </div>
                                        ) : (
                                            <p className="text-sm leading-relaxed">{msg.text}</p>
                                        )}
                                        <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                            <span>{msg.time}</span>
                                            {msg.sender === 'me' && (
                                                msg.status === 'read' ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 sm:p-4 bg-card border-t border-border">
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground h-9 w-9">
                                    <Image className="w-4 h-4 sm:w-5 sm:h-5" />
                                </Button>
                                <div className="flex-1 bg-secondary/50 rounded-full flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent focus-within:border-primary/30 transition-colors">
                                    <Input
                                        placeholder="Message..."
                                        className="border-none bg-transparent h-auto p-0 focus-visible:ring-0 placeholder:text-muted-foreground text-sm sm:text-base"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    />
                                    <Button variant="ghost" size="icon" className="h-5 w-5 sm:h-6 sm:w-6 ml-1 sm:ml-2 text-muted-foreground hover:text-foreground">
                                        <Smile className="w-4 h-4" />
                                    </Button>
                                </div>
                                {newMessage ? (
                                    <Button onClick={handleSend} size="icon" className="rounded-full w-9 h-9 sm:w-10 sm:h-10 shrink-0 bg-primary hover:bg-primary/90 text-white shadow-sm transition-transform active:scale-95">
                                        <Send className="w-4 h-4 ml-0.5" />
                                    </Button>
                                ) : (
                                    <Button
                                        size="icon"
                                        className={`rounded-full w-9 h-9 sm:w-10 sm:h-10 shrink-0 shadow-sm transition-all ${isRecording ? 'bg-red-500 hover:bg-red-600 text-white scale-110' : 'bg-card hover:bg-secondary text-foreground border border-border'}`}
                                        onMouseDown={() => setIsRecording(true)}
                                        onMouseUp={() => setIsRecording(false)}
                                        onTouchStart={() => setIsRecording(true)}
                                        onTouchEnd={() => setIsRecording(false)}
                                    >
                                        <Mic className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Chat;
