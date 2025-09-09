import { supabase } from '@/integrations/supabase/client';

export const sendNotification = async ({
  userId,
  title,
  message,
  type,
  relatedId
}: {
  userId: string;
  title: string;
  message: string;
  type: 'request' | 'order' | 'system';
  relatedId?: string;
}) => {
  try {
    const { error } = await supabase.from('notifications').insert([
      {
        user_id: userId,
        title,
        message,
        type,
        related_id: relatedId,
        is_read: false
      }
    ]);

    if (error) throw error;

    // Trigger real-time notification
    await supabase.rpc('notify_user', {
      p_user_id: userId,
      p_title: title,
      p_message: message
    });

  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};
