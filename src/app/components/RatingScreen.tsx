import { ArrowLeft, Star, ThumbsUp, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';

interface RatingScreenProps {
  onBack: () => void;
  onSubmit: (rating: RatingData) => void;
  bookingData: {
    bookingCode: string;
    staffName: string;
    staffPhoto: string;
    center: string;
    licensePlate: string;
  };
}

interface RatingData {
  overallRating: number;
  criteriaRatings: {
    punctuality: number;
    professionalism: number;
    quality: number;
    communication: number;
  };
  comment: string;
  tags: string[];
}

const QUICK_TAGS = [
  '👍 Chuyên nghiệp',
  '⏰ Đúng giờ',
  '💯 Chất lượng tốt',
  '😊 Thái độ tốt',
  '🚀 Nhanh chóng',
  '💰 Giá hợp lý',
  '🎯 Đúng cam kết',
  '✨ Sạch sẽ',
];

export default function RatingScreen({ onBack, onSubmit, bookingData }: RatingScreenProps) {
  const [overallRating, setOverallRating] = useState(0);
  const [criteriaRatings, setCriteriaRatings] = useState({
    punctuality: 0,
    professionalism: 0,
    quality: 0,
    communication: 0,
  });
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleOverallRating = (rating: number) => {
    setOverallRating(rating);
  };

  const handleCriteriaRating = (criteria: keyof typeof criteriaRatings, rating: number) => {
    setCriteriaRatings(prev => ({ ...prev, [criteria]: rating }));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (overallRating === 0) {
      alert('Vui lòng đánh giá số sao tổng thể!');
      return;
    }

    const ratingData: RatingData = {
      overallRating,
      criteriaRatings,
      comment,
      tags: selectedTags,
    };

    onSubmit(ratingData);
  };

  const StarRating = ({ 
    rating, 
    onRate, 
    size = 32,
    hovered = 0,
    onHover = () => {},
    onHoverEnd = () => {}
  }: { 
    rating: number; 
    onRate: (r: number) => void;
    size?: number;
    hovered?: number;
    onHover?: (r: number) => void;
    onHoverEnd?: () => void;
  }) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRate(star)}
          onMouseEnter={() => onHover(star)}
          onMouseLeave={onHoverEnd}
          className="transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            size={size}
            fill={(hovered || rating) >= star ? '#fbbf24' : 'none'}
            className={(hovered || rating) >= star ? 'text-yellow-400' : 'text-gray-300'}
            strokeWidth={2}
          />
        </button>
      ))}
    </div>
  );

  const getRatingText = (rating: number) => {
    if (rating === 0) return '';
    if (rating === 1) return '😞 Rất tệ';
    if (rating === 2) return '😕 Tệ';
    if (rating === 3) return '😐 Trung bình';
    if (rating === 4) return '😊 Tốt';
    return '🤩 Tuyệt vời';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-10 pb-6 rounded-b-[2rem] shadow-md border-b border-gray-100 relative overflow-hidden sticky top-0 z-40">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-6 right-8 w-24 h-24 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute top-10 right-24 w-16 h-16 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute bottom-2 left-6 w-28 h-28 border-2 border-gray-900 rounded-full"></div>
        </div>
        
        <div className="relative z-10">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 mb-3 -ml-1 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            <span className="text-sm font-semibold">Quay lại</span>
          </button>
          <h1 className="text-gray-900 font-bold text-xl tracking-tight mb-1">Đánh giá dịch vụ</h1>
          <p className="text-gray-500 text-xs">Chia sẻ trải nghiệm của bạn</p>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-5">
        {/* Staff Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 shadow-lg shadow-blue-600/20 text-white">
          <div className="flex items-center gap-4 mb-3">
            <img
              src={bookingData.staffPhoto}
              alt={bookingData.staffName}
              className="w-16 h-16 rounded-full border-4 border-white/30 object-cover"
            />
            <div className="flex-1">
              <p className="font-bold text-base">{bookingData.staffName}</p>
              <p className="text-blue-100 text-xs">Nhân viên đăng kiểm</p>
            </div>
          </div>
          <div className="pt-3 border-t border-white/20">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-blue-100 mb-1">Mã đơn</p>
                <p className="font-bold">{bookingData.bookingCode}</p>
              </div>
              <div>
                <p className="text-blue-100 mb-1">Biển số</p>
                <p className="font-bold">{bookingData.licensePlate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Rating */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="text-yellow-600" size={28} strokeWidth={2.5} fill="#ca8a04" />
            </div>
            <h3 className="text-gray-900 font-bold text-base mb-1">Đánh giá tổng thể</h3>
            <p className="text-gray-500 text-xs">Bạn cảm thấy dịch vụ như thế nào?</p>
          </div>

          <div className="flex justify-center mb-3">
            <StarRating 
              rating={overallRating} 
              onRate={handleOverallRating}
              size={40}
              hovered={hoveredStar}
              onHover={setHoveredStar}
              onHoverEnd={() => setHoveredStar(0)}
            />
          </div>

          {overallRating > 0 && (
            <p className="text-center font-bold text-lg text-gray-900 animate-fade-in">
              {getRatingText(overallRating)}
            </p>
          )}
        </div>

        {/* Criteria Ratings */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <ThumbsUp className="text-purple-600" size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-sm">Đánh giá chi tiết</h3>
              <p className="text-gray-500 text-xs">Đánh giá theo từng tiêu chí</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 text-sm font-medium">⏰ Đúng giờ</span>
                <span className="text-gray-500 text-xs">{criteriaRatings.punctuality}/5</span>
              </div>
              <div className="flex gap-1.5">
                <StarRating 
                  rating={criteriaRatings.punctuality} 
                  onRate={(r) => handleCriteriaRating('punctuality', r)}
                  size={24}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 text-sm font-medium">👔 Chuyên nghiệp</span>
                <span className="text-gray-500 text-xs">{criteriaRatings.professionalism}/5</span>
              </div>
              <div className="flex gap-1.5">
                <StarRating 
                  rating={criteriaRatings.professionalism} 
                  onRate={(r) => handleCriteriaRating('professionalism', r)}
                  size={24}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 text-sm font-medium">💯 Chất lượng dịch vụ</span>
                <span className="text-gray-500 text-xs">{criteriaRatings.quality}/5</span>
              </div>
              <div className="flex gap-1.5">
                <StarRating 
                  rating={criteriaRatings.quality} 
                  onRate={(r) => handleCriteriaRating('quality', r)}
                  size={24}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 text-sm font-medium">💬 Giao tiếp</span>
                <span className="text-gray-500 text-xs">{criteriaRatings.communication}/5</span>
              </div>
              <div className="flex gap-1.5">
                <StarRating 
                  rating={criteriaRatings.communication} 
                  onRate={(r) => handleCriteriaRating('communication', r)}
                  size={24}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tags */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <ThumbsUp className="text-green-600" size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-sm">Điểm nổi bật</h3>
              <p className="text-gray-500 text-xs">Chọn những gì bạn thích</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="text-orange-600" size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-sm">Nhận xét chi tiết</h3>
              <p className="text-gray-500 text-xs">Chia sẻ thêm ý kiến của bạn</p>
            </div>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ví dụ: Nhân viên nhiệt tình, xe được kiểm tra kỹ lưỡng, dịch vụ nhanh chóng..."
            className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none resize-none text-sm"
          />
          <p className="text-gray-400 text-xs mt-2">{comment.length}/500 ký tự</p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={overallRating === 0}
          className={`w-full py-4 rounded-2xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 ${
            overallRating > 0
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 active:scale-95 shadow-blue-600/30'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Send size={20} strokeWidth={2.5} />
          Gửi đánh giá
        </button>

        <p className="text-gray-400 text-xs text-center">
          Đánh giá của bạn giúp chúng tôi cải thiện dịch vụ tốt hơn
        </p>
      </div>
    </div>
  );
}
