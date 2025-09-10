import { Database } from './types_gen';

export type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';
export type PayoutStatus = 'pending' | 'approved' | 'denied' | 'completed';
export type EarningStatus = 'pending' | 'available' | 'withdrawn';

export interface Order extends Database['public']['Tables']['orders']['Row'] {
  buyer: {
    id: string;
    full_name: string;
    email: string;
  };
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
}

export interface Earning extends Database['public']['Tables']['earnings']['Row'] {
  order: Order;
}

export interface PayoutRequest extends Database['public']['Tables']['payout_requests']['Row'] {
  processed_by_user?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface EarningsSummary {
  total_earnings: number;
  available_balance: number;
  pending_balance: number;
}

export interface SalesAnalytics {
  product_id: string;
  product_name: string;
  total_quantity: number;
  total_sales: number;
}
