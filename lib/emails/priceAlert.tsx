import {
  Html, Head, Body, Container, Heading, Text, Button, Section, Hr,
} from '@react-email/components';

interface PriceAlertEmailProps {
  destination: string;
  alertType: 'flight' | 'hotel';
  currentPrice: number;
  targetPrice: number;
  currency: string;
  travelDate: string;
  bookingUrl: string;
}

export function PriceAlertEmail({
  destination,
  alertType,
  currentPrice,
  targetPrice,
  currency,
  travelDate,
  bookingUrl,
}: PriceAlertEmailProps) {
  const saving = targetPrice - currentPrice;
  const savingPct = Math.round((saving / targetPrice) * 100);

  return (
    <Html>
      <Head />
      <Body style={{ background: '#0A0F1E', fontFamily: 'sans-serif', margin: 0, padding: '40px 0' }}>
        <Container style={{ maxWidth: 480, margin: '0 auto', background: '#141929', borderRadius: 16, padding: 32, border: '1px solid rgba(255,255,255,0.08)' }}>
          <Heading style={{ color: '#F59E0B', fontSize: 24, marginTop: 0 }}>
            Price drop alert! ✈️
          </Heading>
          <Text style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.6 }}>
            The {alertType} price for <strong style={{ color: '#E2E8F0' }}>{destination}</strong> on{' '}
            <strong style={{ color: '#E2E8F0' }}>{travelDate}</strong> has dropped below your target.
          </Text>

          <Section style={{ background: '#0A0F1E', borderRadius: 12, padding: '16px 20px', margin: '20px 0' }}>
            <Text style={{ color: '#94A3B8', fontSize: 12, margin: 0 }}>Current price</Text>
            <Text style={{ color: '#22C55E', fontSize: 28, fontWeight: 'bold', margin: '4px 0' }}>
              {currency} {currentPrice.toLocaleString()}
            </Text>
            <Text style={{ color: '#94A3B8', fontSize: 12, margin: 0 }}>
              Your target: {currency} {targetPrice.toLocaleString()} · You save {savingPct}%
            </Text>
          </Section>

          <Hr style={{ borderColor: 'rgba(255,255,255,0.08)' }} />

          {/* TODO_SEND_EMAIL: call resend.emails.send() with this template when cron job detects price drop */}
          <Button href={bookingUrl}
            style={{
              background: '#F59E0B', color: '#000', fontWeight: 700, padding: '12px 24px',
              borderRadius: 10, textDecoration: 'none', display: 'block', textAlign: 'center', marginTop: 20,
            }}>
            Book now →
          </Button>

          <Text style={{ color: '#475569', fontSize: 11, textAlign: 'center', marginTop: 24 }}>
            Powered by Driftplan · Manage alerts at driftplan.app
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
