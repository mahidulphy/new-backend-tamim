import React from 'react';
import { Package, CheckCircle2, XCircle, FileSpreadsheet } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OrdersView: React.FC = () => {
  const { orders, updateOrderStatus, addToast } = useApp();

  const escapeCSV = (val: string | number) => {
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Order Number,Customer,Template,Price,Status,Date"].join(",") + "\n"
      + orders.map(o => [o.orderNumber, o.customerName, o.templateName, o.price, o.orderStatus, o.createdAt].map(escapeCSV).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "MemoryGift_Orders.csv");
    document.body.appendChild(link);
    link.click();
    addToast('Exported Orders', 'CSV file downloaded.', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Orders Management</h1>
          <p className="text-xs text-neutral-400">Track memory gift purchases, status updates, and revenue records.</p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-2 cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export Orders CSV
        </button>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 font-mono uppercase text-[10px] border-b border-neutral-800">
              <tr>
                <th className="p-4 pl-6">Order #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Template</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-neutral-800/30">
                  <td className="p-4 pl-6 font-mono font-bold text-white">{o.orderNumber}</td>
                  <td className="p-4">
                    <p className="font-semibold text-white">{o.customerName}</p>
                    <p className="text-[10px] text-neutral-400">{o.customerEmail}</p>
                  </td>
                  <td className="p-4 text-neutral-200">{o.templateName}</td>
                  <td className="p-4 font-mono font-bold text-white">${o.price.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                      o.orderStatus === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="p-4 text-neutral-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    {o.orderStatus !== 'COMPLETED' && (
                      <button
                        onClick={() => updateOrderStatus(o.id, 'COMPLETED')}
                        className="p-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900 text-emerald-400"
                        title="Mark Completed"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    {o.orderStatus !== 'CANCELLED' && (
                      <button
                        onClick={() => updateOrderStatus(o.id, 'CANCELLED')}
                        className="p-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900 text-rose-400"
                        title="Cancel Order"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
