import React, { useEffect, useState } from 'react';
import { getSettlements } from '../../mock/mockApi';
import { StatusBadge } from '../../components/StatusBadge';
import type { Settlement } from '../../types';

const SettlementTrackingPage: React.FC = () => {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [toast, setToast] = useState('');

  useEffect(() => { getSettlements().then(setSettlements); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const filtered = activeTab === 'all' ? settlements
    : activeTab === 'pending' ? settlements.filter(s => s.status === 'cho_bo_sung' || s.status === 'hoa_don_vat')
    : settlements.filter(s => s.status === 'da_xac_nhan');

  const tabs = [['all', 'Tất cả hồ sơ'], ['pending', 'Chờ thẩm định'], ['done', 'Hoàn tất']];
  const stats = [
    { label: 'Tổng kinh phí quản lý', value: '5.420.000.000 VNĐ', cls: 'text-slate-900', border: '' },
    { label: 'Đã giải ngân đợt 1', value: '2.150.000.000 VNĐ', cls: 'text-primary', border: 'border-l-4 border-l-primary' },
    { label: 'Hồ sơ trễ hạn', value: '03 ĐỀ TÀI', cls: 'text-orange-600', border: 'border-l-4 border-l-orange-500' },
    { label: 'Sai sót chứng từ', value: '08 VỤ VIỆC', cls: 'text-red-600', border: 'border-l-4 border-l-red-500' },
  ];

  return (
    <div className="space-y-8">
      {toast && <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 text-sm font-bold">{toast}</div>}

      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Quản lý Theo dõi Quyết toán</h1>
        <p className="text-slate-500 mt-1">Theo dõi tiến độ, thẩm định chứng từ và yêu cầu bổ sung hồ sơ.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-slate-100">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === key ? 'text-primary border-primary' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Filter */}
        <div className="col-span-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-card">
            <h4 className="text-base font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full" /> Bộ lọc hồ sơ
            </h4>
            <div className="space-y-3">
              <button className="w-full p-4 rounded-xl border-2 border-primary bg-primary/5 flex items-center gap-3 text-left hover:bg-primary/10 transition-all">
                <div className="w-5 h-5 rounded-md border-2 border-primary bg-primary flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <span className="text-xs font-bold text-primary">Lọc các hồ sơ đang thiếu Hóa đơn VAT</span>
              </button>
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Trạng thái minh chứng</p>
                {['Thiếu mẫu đề nghị tạm ứng', 'Bảng kê chi tiền mặt sai'].map(item => (
                  <div key={item} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <div className="w-4 h-4 rounded border border-slate-300" />
                    <span className="text-xs font-semibold text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="col-span-8">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-base font-bold">Danh sách hồ sơ cần xử lý</h4>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase bg-slate-50 rounded-lg hover:text-primary">Mặc định</button>
                <button className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase bg-slate-50 rounded-lg hover:text-primary">Xuất Excel</button>
              </div>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  {['Mã hồ sơ', 'Nội dung', 'Số tiền (VNĐ)', 'Trạng thái', 'Thao tác'].map(h => (
                    <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td className="px-6 py-5 text-xs font-bold text-primary">{s.code}</td>
                    <td className="px-6 py-5 text-xs font-bold text-slate-800">{s.content}</td>
                    <td className="px-6 py-5 text-xs font-bold text-slate-700">{s.amount.toLocaleString('vi-VN')}</td>
                    <td className="px-6 py-5"><StatusBadge status={s.status} /></td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-start gap-1">
                        {(s.status === 'cho_bo_sung' || s.status === 'hoa_don_vat') ? (
                          <button
                            onClick={() => showToast(`Đã gửi yêu cầu bổ sung cho hồ sơ ${s.code}`)}
                            className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase hover:bg-red-700"
                          >Yêu cầu bổ sung</button>
                        ) : (
                          <button
                            onClick={() => showToast(`Đã xác nhận hồ sơ ${s.code}!`)}
                            className="px-4 py-1.5 bg-primary text-white rounded-lg text-[10px] font-black uppercase hover:bg-primary-dark"
                          >Xác nhận</button>
                        )}
                        <button className="text-[10px] font-black text-slate-400 hover:text-primary uppercase">Chi tiết</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map(s => (
          <div key={s.label} className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-card ${s.border}`}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{s.label}</p>
            <p className={`text-xl font-black ${s.cls}`}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettlementTrackingPage;
