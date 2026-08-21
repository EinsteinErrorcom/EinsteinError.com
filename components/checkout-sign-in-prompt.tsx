'use client';

import { GoogleLoginButton } from '@/components/google-login-button';
import { CHECKOUT_PATH } from '@/lib/trial-gate';

type CheckoutSignInPromptProps = {
  googleClientId?: string | null;
};

export function CheckoutSignInPrompt({ googleClientId }: CheckoutSignInPromptProps) {
  return (
    <div className="payment-checkout__sign-in-prompt">
      You MUST be Signed-In to Google
      <br />
      in order to use{'\u00A0'.repeat(3)}
      <span style={{ color: '#D0AB47' }}>MAX-LIT</span>
      <div className="payment-checkout__sign-in-link">
        <GoogleLoginButton
        googleClientId={googleClientId}
        redirectPath={CHECKOUT_PATH}
        variant="link"
        linkLabel={`SIGN-IN${'\u00A0'.repeat(4)}to${'\u00A0'}Google${'\u00A0'.repeat(4)}HERE`}
      />
      </div>
    </div>
  );
}
