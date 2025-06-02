import { Button, Html } from '@react-email/components';

export default function UserVerification() {
  return (
    <Html lang="en">
      <Button
        href="https://example.com"
        style={{ background: '#000', color: '#fff', padding: '12px 20px' }}>
        Click me
      </Button>
    </Html>
  );
}
