// src/app/market/[id]/page.tsx
import { getCryptoDetails } from '@/lib/api/coingecko';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { SparklineChart } from '@/components/market/SparkLineChart'; // استيراد الرسم البياني
import { BackButton } from '@/components/ui/BackButton';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const asset = await getCryptoDetails(id);

    if (!asset) {
        return {
            title: 'Asset Not Found | Crypto Intelligence',
            description: 'The requested crypto asset could not be found.',
        };
    }

    return {
        title: `${asset.name} (${asset.symbol.toUpperCase()}) Price, Statistics & Analysis`,
        description: `Track live market statistics, 7-day trend, and market cap for ${asset.name}.`,
        openGraph: {
            title: `${asset.name} Price Today`,
            description: `Current price: $${asset.current_price.toLocaleString()} with a 24h change of ${asset.price_change_percentage_24h?.toFixed(2)}%.`,
            images: [asset.image],
        },
    };
}

export default async function AssetDetailPage({ params }: PageProps) {
    const { id } = await params;
    const asset = await getCryptoDetails(id);

    if (!asset) {
        notFound();
    }

    const isPositive = (asset.price_change_percentage_24h ?? 0) >= 0;

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <BackButton />

                {/* Header Section */}
                <MotionWrapper delay={0.1}>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center gap-4">
                            <Image src={asset.image} alt={asset.name} width={64} height={64} className="rounded-full" />
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl md:text-3xl font-bold">{asset.name}</h1>
                                    <span className="text-slate-400 uppercase bg-slate-800 px-2.5 py-1 rounded-md text-xs font-semibold">
                                        {asset.symbol}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm mt-1">Market Rank: #{asset.market_cap_rank}</p>
                            </div>
                        </div>

                        <div className="text-left md:text-right">
                            <div className="text-3xl font-extrabold">${asset.current_price.toLocaleString()}</div>
                            <div className={`text-sm font-semibold mt-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {isPositive ? '+' : ''}{asset.price_change_percentage_24h?.toFixed(2)}% (24h)
                            </div>
                        </div>
                    </div>
                </MotionWrapper>

                {/* Statistics Grid */}
                <MotionWrapper delay={0.2}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                            <div className="text-slate-400 text-sm mb-1">Market Cap</div>
                            <div className="text-lg font-bold">${asset.market_cap.toLocaleString()}</div>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                            <div className="text-slate-400 text-sm mb-1">24h Volume</div>
                            <div className="text-lg font-bold">${asset.total_volume.toLocaleString()}</div>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                            <div className="text-slate-400 text-sm mb-1">Circulating Supply</div>
                            <div className="text-lg font-bold">{asset.circulating_supply?.toLocaleString() ?? 'N/A'}</div>
                        </div>
                    </div>
                </MotionWrapper>

                {/* Historical Trend Chart Section (Lightweight Chart) */}
                <MotionWrapper delay={0.25}>
                    <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-xl mb-8 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">7-Day Price Trend</h2>
                        <SparklineChart
                            prices={asset.sparkline_in_7d?.price}
                            currentPrice={asset.current_price}
                            priceChange24h={asset.price_change_percentage_24h}
                            isPositive={isPositive}
                        />
                    </div>
                </MotionWrapper>

                {/* Description Section */}
                <MotionWrapper delay={0.3}>
                    <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-xl mb-8">
                        <h2 className="text-xl font-bold mb-4">About {asset.name}</h2>
                        <div
                            className="text-slate-300 text-sm leading-relaxed prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: asset.description?.en || 'No description available.' }}
                        />
                    </div>
                </MotionWrapper>

                {/* Source Attribution Section */}
                <MotionWrapper delay={0.35}>
                    <div className="text-center text-xs text-slate-500 py-4 border-t border-slate-800/80">
                        Data provided by <span className="text-slate-400 font-medium">CoinGecko Public API</span>. Real-time market analytics and trend monitoring.
                    </div>
                </MotionWrapper>
            </div>
        </main>
    );
}