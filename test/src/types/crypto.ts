// types/crypto.ts

export interface CryptoAsset {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    total_volume: number;
    high_24h: number | null;
    low_24h: number | null;
    price_change_percentage_24h: number | null;
    circulating_supply: number | null;
    sparkline_in_7d?: {
        price: number[];
    };
}

export interface CryptoDetailAsset extends CryptoAsset {
    description?: {
        en: string;
    };
    genesis_date?: string | null;
    links?: {
        homepage?: string[];
    };
}

export interface SearchCoin {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number | null;
    thumb: string;
}

export type SortField = 'market_cap' | 'current_price' | 'price_change_percentage_24h' | 'total_volume';
export type SortOrder = 'asc' | 'desc';