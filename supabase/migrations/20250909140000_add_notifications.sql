-- Create notifications table
CREATE TYPE notification_type AS ENUM ('request', 'order', 'system');

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    related_id UUID,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notify_user function
CREATE OR REPLACE FUNCTION notify_user(p_user_id UUID, p_title TEXT, p_message TEXT)
RETURNS void AS $$
BEGIN
    PERFORM pg_notify(
        'notifications',
        json_build_object(
            'user_id', p_user_id,
            'title', p_title,
            'message', p_message
        )::text
    );
END;
$$ LANGUAGE plpgsql;
