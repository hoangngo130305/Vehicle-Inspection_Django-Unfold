import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Upload, Camera, FileText, Check, CheckCircle, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useStaffOrders } from '@/app/contexts/StaffOrdersContext';

type DocumentType = 'registration' | 'insurance' | 'receipt' | 'inspection_cert' | 'inspection_sticker' | 'other';

interface DocumentItem {
  type: DocumentType;
  label: string;
  icon: string;
  required: boolean;
  files: string[];
}

export default function DocumentUploadScreen() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { getOrderById } = useStaffOrders();
  const order = getOrderById(orderId || '');

  const [documents, setDocuments] = useState<DocumentItem[]>([
    { type: 'registration', label: 'Giấy đăng ký xe', icon: '📄', required: true, files: [] },
    { type: 'insurance', label: 'Bảo hiểm xe', icon: '🛡️', required: true, files: [] },
    { type: 'receipt', label: 'Biên lai phí đăng kiểm', icon: '🧾', required: true, files: [] },
    { type: 'inspection_cert', label: 'Giấy chứng nhận đăng kiểm', icon: '📋', required: true, files: [] },
    { type: 'inspection_sticker', label: 'Tem đăng kiểm', icon: '🏷️', required: true, files: [] },
    { type: 'other', label: 'Tài liệu khác', icon: '📁', required: false, files: [] },
  ]);

  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
        <div className="text-center">
          <AlertTriangle size={64} className="text-red-500 mx-auto mb-4" />
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

  const handleFileUpload = (docType: DocumentType, method: 'camera' | 'gallery') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    if (method === 'camera') {
      input.capture = 'environment';
    }
    
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      
      if (files.length === 0) return;

      // Process files
      const readers = files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve(event.target?.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then(results => {
        setDocuments(prev => 
          prev.map(doc => 
            doc.type === docType 
              ? { ...doc, files: [...doc.files, ...results] }
              : doc
          )
        );
        toast.success(`Đã thêm ${files.length} ảnh cho ${documents.find(d => d.type === docType)?.label}!`);
      });
    };
    
    input.click();
  };

  const handleRemoveFile = (docType: DocumentType, fileIndex: number) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.type === docType
          ? { ...doc, files: doc.files.filter((_, index) => index !== fileIndex) }
          : doc
      )
    );
    toast.success('Đã xóa ảnh!');
  };

  const handleSubmit = () => {
    // Validate required documents
    const missingDocs = documents.filter(doc => doc.required && doc.files.length === 0);
    
    if (missingDocs.length > 0) {
      toast.error(`Vui lòng upload: ${missingDocs.map(d => d.label).join(', ')}`);
      return;
    }

    setIsSubmitting(true);
    toast.success('Upload chứng từ thành công!');
    setTimeout(() => {
      navigate(`/staff/order/${orderId}`);
    }, 1000);
  };

  const totalFiles = documents.reduce((sum, doc) => sum + doc.files.length, 0);
  const requiredDocs = documents.filter(d => d.required);
  const completedRequiredDocs = requiredDocs.filter(d => d.files.length > 0);
  const progressPercent = Math.round((completedRequiredDocs.length / requiredDocs.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white px-5 pt-12 pb-6 rounded-b-[2rem] shadow-md border-b border-gray-100 relative overflow-hidden">
        {/* Decorative Circle Patterns */}
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute top-6 right-8 w-24 h-24 border-2 border-blue-600 rounded-full"></div>
          <div className="absolute top-10 right-24 w-16 h-16 border-2 border-green-600 rounded-full"></div>
          <div className="absolute bottom-2 left-6 w-28 h-28 border-2 border-blue-600 rounded-full"></div>
          <div className="absolute bottom-4 left-28 w-10 h-10 border border-green-600 rounded-full"></div>
        </div>

        <div className="relative z-10">
          <button
            onClick={() => navigate(`/staff/order/${orderId}`)}
            className="flex items-center gap-2 text-gray-600 mb-4 -ml-1 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            <span className="text-sm font-semibold">Quay lại</span>
          </button>
          <div>
            <h1 className="text-gray-900 text-xl font-bold mb-1 tracking-tight">Upload chứng từ</h1>
            <p className="text-gray-500 text-sm">{order.vehicle} • {order.customer}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4 space-y-4">
        {/* Progress Indicator */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-900 font-bold text-sm">Tiến độ upload</span>
            <span className="text-blue-600 font-bold text-sm">{progressPercent}%</span>
          </div>
          <div className="w-full bg-white rounded-full h-2 overflow-hidden mb-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-700">
              {completedRequiredDocs.length}/{requiredDocs.length} tài liệu bắt buộc
            </span>
            <span className="text-blue-700">
              {totalFiles} ảnh
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
          <div className="flex gap-3">
            <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 mb-1 text-sm">Lưu ý khi chụp ảnh</h3>
              <ul className="text-amber-800 text-xs space-y-1">
                <li>• Chụp rõ nét, đầy đủ thông tin</li>
                <li>• Đảm bảo đủ ánh sáng</li>
                <li>• Không bị mờ, nhòe</li>
                <li>• Có thể upload nhiều ảnh cho mỗi loại</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Document Upload Sections */}
        {documents.map((doc) => (
          <div key={doc.type} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <span className="text-xl">{doc.icon}</span>
                {doc.label}
                {doc.required && <span className="text-red-500 text-sm">*</span>}
              </h3>
              {doc.files.length > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                  <CheckCircle size={14} className="text-green-600" />
                  <span className="text-green-700 font-bold text-xs">{doc.files.length}</span>
                </div>
              )}
            </div>

            {/* Upload Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => handleFileUpload(doc.type, 'camera')}
                className="flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm"
              >
                <Camera size={16} />
                Chụp ảnh
              </button>
              <button
                onClick={() => handleFileUpload(doc.type, 'gallery')}
                className="flex items-center justify-center gap-2 py-2.5 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors text-sm"
              >
                <ImageIcon size={16} />
                Thư viện
              </button>
            </div>

            {/* Uploaded Files */}
            {doc.files.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {doc.files.map((file, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-green-300 group">
                    <img
                      src={file}
                      alt={`${doc.label} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleRemoveFile(doc.type, index)}
                        className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                      >
                        <span className="text-white font-bold text-lg">×</span>
                      </button>
                    </div>
                    <div className="absolute top-1 right-1 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {doc.files.length === 0 && (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FileText size={20} className="text-gray-400" />
                </div>
                <p className="text-gray-600 text-sm font-medium">Chưa có ảnh</p>
                <p className="text-gray-500 text-xs">Nhấn nút bên trên để upload</p>
              </div>
            )}
          </div>
        ))}

        {/* Notes */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FileText size={18} className="text-gray-600" />
            Ghi chú
          </h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Thông tin bổ sung về các chứng từ..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || progressPercent < 100}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
            isSubmitting || progressPercent < 100
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-600/20'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Đang xử lý...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Upload size={20} />
              Hoàn tất upload ({totalFiles} ảnh)
            </span>
          )}
        </button>

        {progressPercent < 100 && (
          <p className="text-center text-sm text-gray-500">
            Vui lòng upload đầy đủ {requiredDocs.length} tài liệu bắt buộc
          </p>
        )}
      </div>
    </div>
  );
}