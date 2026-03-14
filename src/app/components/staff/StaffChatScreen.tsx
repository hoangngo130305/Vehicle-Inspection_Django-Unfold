import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Send, Image as ImageIcon, Camera, Paperclip, Phone, Video } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useStaffOrders } from '@/app/contexts/StaffOrdersContext';

interface Message {
  id: string;
  sender: 'staff' | 'customer';
  text?: string;
  image?: string;
  timestamp: Date;
}

export default function StaffChatScreen() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { getOrderById } = useStaffOrders();
  const order = getOrderById(orderId || '');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'customer',
      text: 'Xin chào, tôi có thể đến sớm hơn 15 phút được không?',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      sender: 'staff',
      text: 'Chào anh, dạ được ạ. Anh đến sớm cũng không sao ạ!',
      timestamp: new Date(Date.now() - 3500000),
    },
    {
      id: '3',
      sender: 'customer',
      text: 'Cảm ơn bạn!',
      timestamp: new Date(Date.now() - 3400000),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy đơn hàng</h2>
          <button
            onClick={() => navigate('/staff/orders')}
            className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'staff',
      text: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    toast.success('Đã gửi tin nhắn');

    // Simulate customer typing after 2 seconds
    setTimeout(() => {
      setIsTyping(true);
    }, 2000);

    // Simulate customer response after 4 seconds
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        'Cảm ơn bạn!',
        'Được ạ, tôi hiểu rồi.',
        'OK, tôi sẽ đến đúng giờ.',
        'Cảm ơn thông tin!',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'customer',
        text: randomResponse,
        timestamp: new Date(),
      }]);
    }, 4000);
  };

  const handleImageUpload = (method: 'camera' | 'gallery') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if (method === 'camera') {
      input.capture = 'environment';
    }
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newMessage: Message = {
            id: Date.now().toString(),
            sender: 'staff',
            image: event.target?.result as string,
            timestamp: new Date(),
          };
          setMessages([...messages, newMessage]);
          toast.success('Đã gửi ảnh');
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  const handleCall = () => {
    window.location.href = `tel:${order.phone}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white px-5 pt-12 pb-4 rounded-b-[2rem] shadow-md border-b border-gray-100 relative overflow-hidden">
        {/* Decorative Circle Patterns */}
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute top-6 right-8 w-24 h-24 border-2 border-blue-600 rounded-full"></div>
          <div className="absolute top-10 right-24 w-16 h-16 border-2 border-green-600 rounded-full"></div>
          <div className="absolute bottom-2 left-6 w-28 h-28 border-2 border-blue-600 rounded-full"></div>
          <div className="absolute bottom-4 left-28 w-10 h-10 border border-green-600 rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => navigate(`/staff/order/${orderId}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <div className="flex-1 ml-3">
              <h1 className="text-gray-900 font-bold">Chat</h1>
              <p className="text-gray-500 text-xs">{order.customer} • {order.vehicle}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCall}
                className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors shadow-md"
              >
                <Phone size={18} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-48 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'staff' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] ${message.sender === 'staff' ? 'order-2' : 'order-1'}`}>
              {message.image ? (
                <div className={`rounded-2xl overflow-hidden shadow-md ${
                  message.sender === 'staff' ? 'bg-blue-600' : 'bg-white'
                }`}>
                  <img
                    src={message.image}
                    alt="Sent image"
                    className="w-full h-auto"
                  />
                </div>
              ) : (
                <div
                  className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                    message.sender === 'staff'
                      ? 'bg-green-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              )}
              <p className={`text-xs text-gray-500 mt-1 ${
                message.sender === 'staff' ? 'text-right' : 'text-left'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies - Fixed */}
      <div className="fixed bottom-[152px] left-0 right-0 z-40 px-5 py-2 bg-white max-w-md mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            'Tôi đang trên đường đến',
            'Xe đã sẵn sàng',
            'Vui lòng chờ thêm 5 phút',
            'Cảm ơn bạn!',
          ].map((text, index) => (
            <button
              key={index}
              onClick={() => {
                setInputText(text);
              }}
              className="px-4 py-1.5 bg-gray-50 border border-gray-300 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-100 transition-colors whitespace-nowrap flex-shrink-0"
            >
              {text}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area - Fixed */}
      <div className="fixed bottom-16 left-0 right-0 z-50 bg-white px-5 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] max-w-md mx-auto">
        <div className="flex items-end gap-2">
          {/* Attachment Buttons */}
          <div className="flex gap-1 mb-2">
            <button
              onClick={() => handleImageUpload('camera')}
              className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center hover:bg-green-100 transition-colors border border-green-200"
            >
              <Camera size={18} className="text-green-600" />
            </button>
            <button
              onClick={() => handleImageUpload('gallery')}
              className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors border border-blue-200"
            >
              <ImageIcon size={18} className="text-blue-600" />
            </button>
          </div>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Nhập tin nhắn..."
              className="w-full px-4 py-2.5 pr-12 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm resize-none bg-gray-50 focus:bg-white transition-colors"
              rows={1}
              style={{ maxHeight: '100px' }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all mb-1 ${
              inputText.trim()
                ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/30 hover:scale-105 active:scale-95'
                : 'bg-gray-200 cursor-not-allowed'
            }`}
          >
            <Send size={20} className={inputText.trim() ? 'text-white' : 'text-gray-400'} />
          </button>
        </div>
      </div>
    </div>
  );
}