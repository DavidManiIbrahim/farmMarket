-- Create enum for request status
CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');

-- Create requests table
CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) NOT NULL,
    buyer_id UUID REFERENCES users(id) NOT NULL,
    farmer_id UUID REFERENCES users(id) NOT NULL,
    quantity INT NOT NULL,
    status request_status DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX idx_requests_farmer_id ON requests(farmer_id);
CREATE INDEX idx_requests_buyer_id ON requests(buyer_id);

-- Add notification tracking
CREATE TABLE request_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
