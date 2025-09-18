import { SendEmailProps } from '@/domains';

import { supabase } from './supabase';

export async function sendEmail({ to, subject, html, from }: SendEmailProps) {
  const res = await supabase.functions.invoke('resend-email', {
    method: 'POST',
    body: JSON.stringify({
      to,
      subject,
      html,
      from,
    }),
  });
  return res.data;
}

export async function sendAccountDeletionEmail(to: string, username?: string) {
  const res = await sendEmail({
    to,
    subject: 'Your CHAAMO Account Has Been Closed',
    html: `
            <h2>Hi ${username ?? 'There'},</h2>

            <p>We’re sorry to see you go and hope to welcome you back in the future.</p>
            <p>Your CHAAMO account has now been closed as requested. Once your account is
            fully deleted, all your listings and associated data will be permanently removed
            in accordance with our privacy policy.</p>
            <p>If this was a mistake or you’ve changed your mind, please contact us as soon as
            possible, we may be able to help restore your account if action is taken within
            14 days.</p>
            <p>Thank you for being part of the CHAAMO community.</p>
            <h5>The CHAAMO Team</h5>
            <a href="https://chaamo.com/contact-us/">Contact Support</a>
        `,
  });
  return res;
}
