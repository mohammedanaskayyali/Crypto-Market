// src/app/loading.tsx
export default function Loading() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 animate-pulse">
            <div className="max-w-7xl mx-auto">
                {/* Header Section Placeholder */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <div className="h-8 w-72 bg-slate-800 rounded-lg mb-2"></div>
                        <div className="h-4 w-96 bg-slate-900 rounded-md"></div>
                    </div>
                    <div className="h-10 w-32 bg-slate-900 border border-slate-800 rounded-xl"></div>
                </div>

                {/* Live Ticker Widget Placeholder */}
                <div className="mb-8 h-20 bg-slate-900 border border-slate-800 rounded-xl"></div>

                {/* Search Bar & Sort Controls Bar Placeholder */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div className="h-10 w-full md:w-80 bg-slate-900 border border-slate-800 rounded-xl"></div>
                    <div className="h-10 w-full md:w-48 bg-slate-900 border border-slate-800 rounded-xl"></div>
                </div>

                {/* Market Table Section Placeholder */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-900/50">
                                    <th className="p-4"><div className="h-4 w-4 bg-slate-800 rounded"></div></th>
                                    <th className="p-4"><div className="h-4 w-24 bg-slate-800 rounded"></div></th>
                                    <th className="p-4"><div className="h-4 w-16 bg-slate-800 rounded"></div></th>
                                    <th className="p-4"><div className="h-4 w-12 bg-slate-800 rounded"></div></th>
                                    <th className="p-4"><div className="h-4 w-28 bg-slate-800 rounded"></div></th>
                                    <th className="p-4"><div className="h-4 w-16 bg-slate-800 rounded"></div></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {/* إنشاء 10 صفوف وهمية مطابقة تماماً لشكل الجدول الحقيقي */}
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <tr key={i} className="opacity-75">
                                        <td className="p-4"><div className="h-4 w-6 bg-slate-800/60 rounded"></div></td>
                                        <td className="p-4 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-800"></div>
                                            <div className="space-y-1.5">
                                                <div className="h-4 w-28 bg-slate-800 rounded"></div>
                                                <div className="h-3 w-12 bg-slate-800/50 rounded"></div>
                                            </div>
                                        </td>
                                        <td className="p-4"><div className="h-4 w-20 bg-slate-800 rounded"></div></td>
                                        <td className="p-4"><div className="h-4 w-16 bg-slate-800 rounded"></div></td>
                                        <td className="p-4"><div className="h-4 w-28 bg-slate-800 rounded"></div></td>
                                        <td className="p-4"><div className="h-8 w-16 bg-slate-800 rounded-lg"></div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls Placeholder */}
                    <div className="flex justify-between items-center p-4 border-t border-slate-800 bg-slate-900/50">
                        <div className="h-4 w-20 bg-slate-800/60 rounded"></div>
                        <div className="flex gap-2">
                            <div className="h-8 w-20 bg-slate-800 rounded-lg"></div>
                            <div className="h-8 w-20 bg-slate-800 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}