import React, { useEffect, useState } from 'react';
import { getExtensions } from '../../mock/mockApi';
import { StatusBadge } from '../../components/StatusBadge';
import type { Extension } from '../../types';

const ExtensionManagementPage: React.FC = () => {
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [toast, setToast] = useState('');

  useEffect(() => { getExtensions().then(setExtensions); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const countBadge = (count: number) => {
    const colors = ['', 'bg-blue-50 text-blue-600 border-blue-100', 'bg-amber-50 text-amber-600 border-amber-100', 'bg-red-50 text-red-600 border-red-100'];
    return colors[Math.min(count, 3)] || colors[3];
  };

  return (
    <div className="space-y-8">
      {toast && <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 text-sm font-bold">{toast}</div>}

      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Quản lý Gia hạn</h1>
        <p className="text-gray-500 mt-2 max-w-2xl leading-relaxed">Danh sách các yêu cầu gia hạn đề tài nghiên cứu đang chờ xử lý sau khi có sự phê duyệt từ Ban Giám đốc.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-8">
        {[['Tổng yêu cầu', extensions.length, 'text-primary'], ['Chờ phê duyệt', extensions.filter(e => e.boardStatus === 'dang_cho').length, 'text-amber-500'], ['Đã xử lý', extensions.filter(e => e.boardStatus !== 'dang_cho').length, 'text-emerald-500']].map(([label, val, cls]) => (
          <div key={label as string} className="bg-white p-8 rounded-2xl shadow-card border border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
            <div className={`text-4xl font-extrabold mt-3 tracking-tight ${cls}`}>{val}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Yêu cầu Đang chờ</h2>
          <span className="px-4 py-1.5 rounded-full text-[10px] font-bold bg-blue-50 text-primary border border-blue-100 uppercase">Cần hành động</span>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50/50">
            <tr>
              {['Mã Đề Tài', 'Lý Do Gia Hạn', 'Giải Trình', 'Hạn Đề Xuất', 'Trạng thái BGH', 'Thao Tác'].map(h => (
                <th key={h} className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {extensions.map(ext => (
              <tr key={ext.id} className={`hover:bg-gray-50/50 transition-colors ${ext.boardStatus === 'dang_cho' ? 'bg-gray-50/20' : ''}`}>
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-mono font-bold text-primary text-sm">{ext.projectCode}</span>
                    <span className={`inline-flex w-fit px-2 py-0.5 rounded text-[9px] font-bold border ${countBadge(ext.extensionCount)}`}>
                      GIA HẠN LẦN {ext.extensionCount}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">{ext.projectOwner}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm text-gray-600 max-w-[280px]">{ext.reason}</td>
                <td className="px-8 py-6">
                  <button className={`text-[11px] font-bold uppercase tracking-tight ${ext.boardStatus === 'dang_cho' ? 'text-gray-300 cursor-not-allowed' : 'text-primary hover:text-primary-dark'}`} disabled={ext.boardStatus === 'dang_cho'}>
                    Xem file
                  </button>
                </td>
                <td className="px-8 py-6">
                  <div className="text-sm font-bold text-gray-900">{ext.proposedDate}</div>
                  <div className="text-[11px] text-gray-400 mt-1">Gia hạn +{ext.extensionDays} ngày</div>
                </td>
                <td className="px-8 py-6"><StatusBadge status={ext.boardStatus} /></td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      disabled={ext.boardStatus === 'dang_cho'}
                      onClick={() => showToast(`Đã trình BGH yêu cầu gia hạn cho ${ext.projectCode}`)}
                      className={`px-5 py-2 rounded-xl text-xs font-bold transition-colors ${ext.boardStatus === 'dang_cho' ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-card'}`}
                    >TRÌNH BGH</button>
                    <button
                      disabled={ext.boardStatus === 'dang_cho'}
                      className={`px-5 py-2 rounded-xl text-xs font-bold transition-colors border ${ext.boardStatus === 'dang_cho' ? 'bg-gray-100 text-gray-300 cursor-not-allowed border-gray-200' : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-100'}`}
                    >TỪ CHỐI</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hiển thị 1 - {extensions.length} / {extensions.length} yêu cầu</span>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50">Trước</button>
            <button className="w-9 h-9 flex items-center justify-center bg-primary text-white rounded-xl text-xs font-bold shadow-card">1</button>
            <button className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtensionManagementPage;
