'use client';

import { GoogleLoginButton } from '@/components/google-login-button';
import { CHECKOUT_PATH } from '@/lib/trial-gate';

type CheckoutSignInPromptProps = {
  googleClientId?: string | null;
};

export function CheckoutSignInPrompt({ googleClientId }: CheckoutSignInPromptProps) {
  return (
    <div className="payment-checkout__sign-in-prompt">
      You MUST be Signed-In to Google in order to use MAX-LIT
      <br />
      <GoogleLoginButton
        googleClientId={googleClientId}
        redirectPath={CHECKOUT_PATH}
        variant="link"
        linkLabel="SIGN-IN HERE"
      />
    </div>
  );
}
