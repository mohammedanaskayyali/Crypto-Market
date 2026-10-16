// src/app/page.tsx
import { getTopCryptoMarkets, searchCryptoMarkets } from '@/lib/api/coingecko';
import Link from 'next/link';
import { LiveTickerWidget } from '@/components/live/LiveTickerWidget';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { CryptoRow } from '@/components/market/CryptoRaw';
import { MarketSearchInput } from '@/components/market/MarketSearchInput';
import { MarketSortControls } from '@/components/market/MarketSortControls';
import { revalidatePath } from 'next/cache';
import { CryptoAsset } from '@/types/crypto';
import { RetryButton } from '@/components/market/RetryButton';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function MarketOverviewPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const searchQuery = resolvedSearchParams.search || '';
  const sortBy = resolvedSearchParams.sortBy || 'market_cap';
  const sortOrder = resolvedSearchParams.sortOrder || 'desc';
  const perPage = 10;

  let assets: CryptoAsset[] = []; let totalPages = 1;
  let hasError = false;

  // جلب البيانات مع دعم البحث، الترتيب، والباجينيشن مع التقاط أي خطأ في الـ APIs
  try {
    if (searchQuery.trim()) {
      const searchResult = await searchCryptoMarkets(searchQuery, currentPage, perPage, sortBy, sortOrder);
      assets = searchResult.assets;
      totalPages = searchResult.totalPages;
    } else {
      assets = await getTopCryptoMarkets(currentPage, perPage, sortBy, sortOrder);
      totalPages = assets.length === perPage ? currentPage + 1 : currentPage;
    }
  } catch (error) {
    hasError = true;
  }

  // دالة Server Action لتكرار المحاولة وإعادة جلب البيانات عند الفشل
  async function handleRetry() {
    'use server';
    revalidatePath('/');
  }

  // دالة مساعدة للحفاظ على جميع المعاملات عند التنقل بين الصفحات
  const getPageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder) params.set('sortOrder', sortOrder);
    params.set('page', targetPage.toString());
    return `/?${params.toString()}`;
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <MotionWrapper>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 sm:mb-2">Crypto Market Intelligence</h1>
              <p className="text-slate-400 text-xs sm:text-sm">Real-time market overview, trends, and asset analytics.</p>
            </div>
          </MotionWrapper>
          <MotionWrapper>
            <Link
              href="/watchlist"
              className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-indigo-400 font-medium rounded-xl text-sm transition-colors shadow-md w-full sm:w-auto text-center block"
            >
              ⭐ My Watchlist
            </Link>
          </MotionWrapper>
        </div>

        <MotionWrapper delay={0.1}>
          <div className="mb-8">
            <LiveTickerWidget symbol="btcusdt" coinName="Bitcoin" />
          </div>
        </MotionWrapper>

        {/* Search Bar & Sort Controls Bar */}
        <MotionWrapper delay={0.15}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <MarketSearchInput initialSearch={searchQuery} />
            <MarketSortControls />
          </div>
        </MotionWrapper>

        {/* Market Table Section */}
        <MotionWrapper delay={0.2}>
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-sm bg-slate-900/50">
                    <th className="p-4">#</th>
                    <th className="p-4">Coin</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">24h</th>
                    <th className="p-4">Market Cap</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {hasError ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <p className="text-rose-400 font-medium">Unable to fetch cryptocurrency data. Please try again.</p>
                          <form action={handleRetry}>
                            <RetryButton />
                          </form>
                        </div>
                      </td>
                    </tr>
                  ) : assets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No crypto assets found matching your search.
                      </td>
                    </tr>
                  ) : (
                    assets.map((asset) => <CryptoRow key={asset.id} asset={asset} />)
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {!hasError && (
              <div className="flex justify-between items-center p-4 border-t border-slate-800 bg-slate-900/50 text-sm text-slate-400">
                <div className="flex gap-2 items-center">
                  Page {currentPage} {searchQuery ? `of ${totalPages}` : ''}
                </div>
                <div className="flex gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={getPageHref(currentPage - 1)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Previous
                    </Link>
                  )}
                  {((searchQuery && currentPage < totalPages) || (!searchQuery && assets.length === perPage)) && (
                    <Link
                      href={getPageHref(currentPage + 1)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Next
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </MotionWrapper>
      </div>
    </main>
  );
}