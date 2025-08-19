export interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}
