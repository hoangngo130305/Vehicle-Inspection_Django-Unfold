import { Search, AlertCircle, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

export default function PenaltiesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const penalties = [
    {
      id: 1,
      category: 'Vượt đèn đỏ',
      icon: '🚦',
      violations: [
        { code: '6.1a', description: 'Không chấp hành hiệu lệnh đèn đỏ', fine: '4.000.000 - 6.000.000đ', points: 2 },
        { code: '6.1b', description: 'Vượt đèn đỏ tại giao lộ có tín hiệu', fine: '6.000.000 - 8.000.000đ', points: 2 },
      ],
    },
    {
      id: 2,
      category: 'Vượt tốc độ',
      icon: '⚡',
      violations: [
        { code: '7.1a', description: 'Vượt từ 05km/h đến dưới 10km/h', fine: '800.000 - 1.000.000đ', points: 0 },
        { code: '7.1b', description: 'Vượt từ 10km/h đến dưới 20km/h', fine: '1.200.000 - 1.400.000đ', points: 1 },
        { code: '7.1c', description: 'Vượt từ 20km/h đến dưới 35km/h', fine: '3.000.000 - 5.000.000đ', points: 2 },
        { code: '7.1d', description: 'Vượt từ 35km/h trở lên', fine: '6.000.000 - 8.000.000đ', points: 4 },
      ],
    },
    {
      id: 3,
      category: 'Nồng độ cồn',
      icon: '🍺',
      violations: [
        { code: '8.1a', description: 'Từ 0 đến dưới 50mg/100ml máu', fine: '6.000.000 - 8.000.000đ', points: 0 },
        { code: '8.1b', description: 'Từ 50mg đến dưới 80mg/100ml máu', fine: '16.000.000 - 18.000.000đ', points: 0 },
        { code: '8.1c', description: 'Từ 80mg/100ml máu trở lên', fine: '30.000.000 - 40.000.000đ', points: 0 },
      ],
    },
    {
      id: 4,
      category: 'Không đội mũ bảo hiểm',
      icon: '🪖',
      violations: [
        { code: '9.1', description: 'Không đội mũ bảo hiểm khi đi xe máy', fine: '400.000 - 600.000đ', points: 0 },
      ],
    },
    {
      id: 5,
      category: 'Dừng đỗ sai quy định',
      icon: '🅿️',
      violations: [
        { code: '10.1a', description: 'Dừng xe, đỗ xe trên đường không phép', fine: '800.000 - 1.000.000đ', points: 0 },
        { code: '10.1b', description: 'Dừng xe, đỗ xe trên vỉa hè', fine: '400.000 - 600.000đ', points: 0 },
      ],
    },
  ];

  const filteredPenalties = penalties.map(category => ({
    ...category,
    violations: category.violations.filter(
      v =>
        v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.category.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.violations.length > 0);

  return (
    <div className="bg-gray-50 flex flex-col pb-20 min-h-screen">
      {/* Header - Fixed with rounded bottom & decorative circles */}
      <div className="bg-white px-5 pt-10 pb-6 rounded-b-[2rem] shadow-md border-b border-gray-100 relative overflow-hidden sticky top-0 z-40">
        {/* Decorative Circle Patterns */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-6 right-8 w-24 h-24 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute top-10 right-24 w-16 h-16 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute bottom-2 left-6 w-28 h-28 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute bottom-4 left-28 w-10 h-10 border border-gray-900 rounded-full"></div>
        </div>
        
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div>
            <h1 className="text-gray-900 font-bold text-xl tracking-tight mb-1">Mức Phạt Giao Thông</h1>
            <p className="text-gray-500 text-xs">Nghị định 100/2019/NĐ-CP</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative z-10">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm vi phạm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border-0 focus:ring-2 focus:ring-blue-300 bg-white/95 text-sm placeholder:text-gray-400 shadow-sm"
          />
        </div>
      </div>

      {/* Notice */}
      <div className="px-4 pt-5 pb-3">
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-900 leading-relaxed">
            Mức phạt áp dụng theo <span className="font-semibold">Nghị định 100/2019/NĐ-CP</span> và các văn bản sửa đổi, bổ sung.
          </p>
        </div>
      </div>

      {/* Penalties List */}
      <div className="px-4 pb-4">
        {filteredPenalties.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
            <ShieldAlert size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Không tìm thấy vi phạm phù hợp</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPenalties.map((category) => (
              <div key={category.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-blue-50/50 px-4 py-2.5 border-b border-blue-100/50 flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  <h3 className="font-semibold text-gray-900 text-sm">{category.category}</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {category.violations.map((violation, idx) => (
                    <div key={idx} className="p-3.5">
                      <div className="flex items-start gap-2.5 mb-2.5">
                        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0">
                          {violation.code}
                        </span>
                        <p className="text-gray-700 text-sm flex-1 leading-relaxed">{violation.description}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs text-gray-400 font-medium">Phạt</span>
                          <span className="text-red-600 font-semibold text-sm">{violation.fine}</span>
                        </div>
                        {violation.points > 0 && (
                          <div className="flex items-center gap-1.5 bg-red-50 px-2 py-0.5 rounded">
                            <span className="text-xs text-red-700 font-semibold">
                              Trừ {violation.points} điểm
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}