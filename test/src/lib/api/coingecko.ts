// src/lib/api/coingecko.ts
import { CryptoAsset, CryptoDetailAsset, SearchCoin } from '@/types/crypto';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export async function getTopCryptoMarkets(
    page = 1,
    perPage = 10,
    sortBy = 'market_cap',
    sortOrder = 'desc'
): Promise<CryptoAsset[]> {
    // مطابقة معاملات الترتيب مع تنسيق CoinGecko API
    let orderParam = `${sortBy}_${sortOrder}`;

    try {
        const response = await fetch(
            `${BASE_URL}/coins/markets?vs_currency=usd&order=${orderParam}&per_page=${perPage}&page=${page}&sparkline=true`,
            {
                next: { revalidate: 60 },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch crypto markets: ${response.statusText}`);
        }

        const data: CryptoAsset[] = await response.json();
        if (sortBy === 'price_change') {
            data.sort((a, b) => {
                const valA = a.price_change_percentage_24h ?? 0;
                const valB = b.price_change_percentage_24h ?? 0;
                return sortOrder === 'desc' ? valB - valA : valA - valB;
            });
        }
        return data;
    } catch (error) {
        console.error('Error fetching crypto markets:', error);
        throw error;
    }
}

export async function getCryptoDetails(id: string): Promise<CryptoDetailAsset | null> {
    try {
        const response = await fetch(`${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`Failed to fetch details for asset: ${id}`);
        }

        const data = await response.json();

        // إعادة تنسيق البيانات لتتطابق مع الـ Interface المطلوبة
        return {
            id: data.id,
            symbol: data.symbol,
            name: data.name,
            image: data.image?.large || '',
            current_price: data.market_data?.current_price?.usd || 0,
            market_cap: data.market_data?.market_cap?.usd || 0,
            market_cap_rank: data.market_cap_rank || 0,
            total_volume: data.market_data?.total_volume?.usd || 0,
            high_24h: data.market_data?.high_24h?.usd || null,
            low_24h: data.market_data?.low_24h?.usd || null,
            price_change_percentage_24h: data.market_data?.price_change_percentage_24h || null,
            circulating_supply: data.market_data?.circulating_supply || null,
            description: {
                en: data.description?.en || 'No description available.',
            },
            sparkline_in_7d: data.market_data?.sparkline_7d || { price: [] },
        };
    } catch (error) {
        console.error(`Error fetching crypto details for ${id}:`, error);
        return null;
    }
}


export interface SearchResult {
    assets: CryptoAsset[];
    totalPages: number;
}

export async function searchCryptoMarkets(
    query: string,
    page = 1,
    perPage = 10,
    sortBy = 'market_cap',
    sortOrder = 'desc'
): Promise<SearchResult> {
    const q = query.trim();
    if (!q) return { assets: [], totalPages: 1 };

    let orderParam = sortBy === 'total_volume' ? `volume_${sortOrder}` : `${sortBy}_${sortOrder}`;

    try {
        // 1) البحث بالاسم أو الرمز
        const searchRes = await fetch(
            `${BASE_URL}/search?query=${encodeURIComponent(q)}`,
            { next: { revalidate: 60 } }
        );
        if (!searchRes.ok) {
            throw new Error(`Search failed: ${searchRes.statusText}`);
        }

        const { coins }: { coins: SearchCoin[] } = await searchRes.json();
        if (!coins.length) return { assets: [], totalPages: 1 };

        const totalPages = Math.ceil(coins.length / perPage);
        const startIndex = (page - 1) * perPage;
        const paginatedCoins = coins.slice(startIndex, startIndex + perPage);

        if (!paginatedCoins.length) return { assets: [], totalPages };

        const ids = paginatedCoins.map((c) => c.id).join(',');

        // 2) جلب بيانات السوق مع تطبيق نفس معايير الترتيب
        const marketsRes = await fetch(
            `${BASE_URL}/coins/markets?vs_currency=usd&ids=${ids}&order=${orderParam}&sparkline=true`,
            { next: { revalidate: 60 } }
        );
        if (!marketsRes.ok) {
            throw new Error(`Failed to fetch markets: ${marketsRes.statusText}`);
        }

        const assets: CryptoAsset[] = await marketsRes.json();
        return { assets, totalPages };
    } catch (error) {
        console.error('Error searching crypto markets:', error);
        throw error;
    }
}