import { ArrowLeft, Phone, Mail, MessageCircle, HelpCircle, ChevronRight } from 'lucide-react';

interface SupportScreenProps {
  onBack: () => void;
}

export default function SupportScreen({ onBack }: SupportScreenProps) {
  const faqs = [
    {
      id: '1',
      question: 'Làm thế nào để đặt lịch đăng kiểm?',
      answer: 'Chọn tab Đặt lịch, sau đó chọn trung tâm, ngày giờ và nhập thông tin xe.',
    },
    {
      id: '2',
      question: 'Tôi có thể hủy lịch đã đặt không?',
      answer: 'Có, bạn có thể hủy hoặc dời lịch trong phần Lịch sử đặt lịch.',
    },
    {
      id: '3',
      question: 'Phí đăng kiểm là bao nhiêu?',
      answer: 'Phí đăng kiểm khác nhau tùy loại xe. Liên hệ trung tâm để biết chi tiết.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Modern Header với Decorative Patterns */}
      <div className="bg-white px-5 pt-10 pb-6 rounded-b-[2rem] shadow-md border-b border-gray-100 relative overflow-hidden sticky top-0 z-40">
        {/* Decorative Circle Patterns */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-6 right-8 w-24 h-24 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute top-10 right-24 w-16 h-16 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute bottom-2 left-6 w-28 h-28 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute bottom-4 left-28 w-10 h-10 border border-gray-900 rounded-full"></div>
        </div>
        
        <div className="relative z-10">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 mb-3 -ml-1 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            <span className="text-sm font-semibold">Quay lại</span>
          </button>
          <h1 className="text-gray-900 font-bold text-xl tracking-tight mb-1">Hỗ trợ</h1>
          <p className="text-gray-500 text-xs">Chúng tôi sẵn sàng giúp bạn</p>
        </div>
      </div>

      <div className="p-5">
        {/* Contact Methods */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <h2 className="text-gray-900 font-semibold text-sm mb-3">Liên hệ với chúng tôi</h2>
          
          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Phone className="text-blue-600" size={20} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-gray-900 font-semibold text-sm">Hotline</p>
              <p className="text-gray-500 text-xs">1900 1234</p>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </button>

          <div className="h-px bg-gray-100 my-2"></div>

          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="text-green-600" size={20} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-gray-900 font-semibold text-sm">Chat trực tuyến</p>
              <p className="text-gray-500 text-xs">Trả lời ngay lập tức</p>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </button>

          <div className="h-px bg-gray-100 my-2"></div>

          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Mail className="text-purple-600" size={20} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-gray-900 font-semibold text-sm">Email</p>
              <p className="text-gray-500 text-xs">support@dangkiem.vn</p>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </button>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-gray-900 font-semibold text-sm mb-3">Câu hỏi thường gặp</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={faq.id}>
                {index > 0 && <div className="h-px bg-gray-100 my-3"></div>}
                <button className="w-full text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <HelpCircle className="text-gray-600" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-semibold text-sm mb-1">{faq.question}</p>
                      <p className="text-gray-600 text-xs">{faq.answer}</p>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}