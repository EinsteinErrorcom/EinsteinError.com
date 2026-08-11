import { PageEndFooter } from "@/components/page-end-footer";
import { GoogleLoginButton } from "@/components/google-login-button";
import { CheckoutBannerLink } from "@/components/checkout-banner-link";
import { ScrollToAuthSection } from "@/components/scroll-to-auth-section";
import { PurchasesLink } from "@/components/purchases-link";
import { SiteTourStartLink } from "@/components/site-tour-bar";
import { TruthCounter } from "@/components/truth-counter";
import { getGoogleClientId } from "@/lib/site-url";
import { CHECKOUT_SESSION_QUERY, CHAT_PATH, SIGN_IN_SECTION_ID } from "@/lib/trial-gate";
import { redirect } from "next/navigation";

type HomeProps = {
  searchParams: Promise<{
    auth?: string;
    reason?: string;
    dev_reset?: string;
    code?: string;
    error?: string;
    error_description?: string;
    checkout_session_id?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const checkoutSessionId = params.checkout_session_id?.trim() || null;

  // Supabase sometimes returns OAuth params to Site URL (/) instead of /auth/callback
  if (params.code || params.error) {
    const callbackParams = new URLSearchParams();
    if (params.code) callbackParams.set('code', params.code);
    if (params.error) callbackParams.set('error', params.error);
    if (params.error_description) {
      callbackParams.set('error_description', params.error_description);
    }
    if (checkoutSessionId) {
      callbackParams.set(CHECKOUT_SESSION_QUERY, checkoutSessionId);
    }
    callbackParams.set('next', CHAT_PATH);
    redirect(`/auth/callback?${callbackParams.toString()}`);
  }

  if (params.auth === "error") {
    const googleClientId = await getGoogleClientId();
    const rawReason = params.reason
      ? decodeURIComponent(params.reason.replace(/\+/g, " "))
      : "Sign-in failed. Please try again.";

    const authError = rawReason.includes("Unable to exchange external code")
      ? "Supabase Client Secret is wrong. Google Cloud → Credentials → your Web client → reset Client Secret → paste the new secret into Supabase → Authentication → Providers → Google → Save. Then try again."
      : rawReason;

    return (
      <main className="page-wrapper">
        <ScrollToAuthSection />
        <div
          id={SIGN_IN_SECTION_ID}
          data-tour-block="true"
          style={{
            margin: "40px auto",
            maxWidth: "1040px",
            textAlign: "center",
          }}
        >
          <GoogleLoginButton
            googleClientId={googleClientId}
            initialError={authError}
            checkoutSessionId={checkoutSessionId}
          />
        </div>
      </main>
    );
  }

  const googleClientId = await getGoogleClientId();

  const devResetMessage = params.dev_reset
    ? decodeURIComponent((params.reason ?? "Trial reset requires sign-in first.").replace(/\+/g, " "))
    : null;

  return (
    <main className="page-wrapper">
      <ScrollToAuthSection />
      <p style={{ margin: '16px auto 0', maxWidth: '1040px' }}>
        <SiteTourStartLink />
        {'\u00A0'.repeat(12)}
        <PurchasesLink />
      </p>
      <img src="/TITLE2.png" alt="Einstein Error Title Banner" width={700} height={150} />
      <CheckoutBannerLink />
      <span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFF00', fontSize: '25px', display: 'block', marginTop: '16px' }}>
        Contact&nbsp;&nbsp;Us
      </span>
      
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', fontSize: '20px', marginTop: '12px' }}>
        <span style={{ color: '#00FFFF' }}>WhatsApp</span><br/>
        <span style={{ color: '#C5A059' }}>+17802707009</span>
        <br/><br/>
        <span style={{ color: '#00FFFF' }}>Email</span><br/>
        <span style={{ color: '#C5A059' }}>wild.book0719@fastmail.com</span>
      </div>
      
      <br/><br/>
      <div className="spacer" style={{ height: '20px' }}></div>
      
      <TruthCounter />
      
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        The Discovery of<br/>
        Albert&nbsp;&nbsp;Einstein&apos;s<br/>
        &nbsp;&quot; Enormous &quot;&nbsp;<br/>
        Historic&nbsp;&nbsp;&nbsp; <span style={{ color: '#FF0000' }}>ERROR</span><br/>
        has now enabled the<br/>
        production of<br/>
        the&nbsp;&nbsp;&nbsp;&quot; <strong>NEW</strong> &quot;<br/><br/>
        -- &nbsp; <strong>MONUMENTAL</strong> &nbsp; --<br/><br/><strong>Ai (</strong><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFFFF', fontSize: '30px' }}>+</span><strong>)</strong>&nbsp;&nbsp;&nbsp; &quot; <span style={{ color: '#C5A059' }}>MAX - LIT</span>&nbsp;&quot;<br/><span style={{ color: '#FFFFFF' }}>SUPERComputer</span><br/><br/>
      </div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        This&nbsp; is<br/>the &nbsp; World's &nbsp; first<br/>" <strong>PERFECT</strong> "<br/>Physics &nbsp; Engine.<br/><br/>
        <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#C5A059', fontSize: '20px' }}>Developed&nbsp; by<br/>Einstein Error . com</div>
        <br/><br/>
        <strong style={{ whiteSpace: 'pre-wrap', tabSize: 8 }}>And{'\t'}<span style={{ color: '#FF0000' }}>NO !</span>{'\t'} it {'\u00A0'} is</strong><br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FF0000', fontSize: '30px' }}>NOT</span>&nbsp; <span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFFFF', fontSize: '30px' }}>Standard</span>&nbsp; Ai<br/>
        <span style={{ fontSize: '25px' }}>( Not&nbsp; Even&nbsp; Close )<br/><br/>MAX-LIT surpasses Standard Ai<br/>in the same way that<br/>the Computer<br/>surpasses the Abacus !</span>
      </div>
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        <span style={{ color: '#C5A059' }}>MAX-LIT</span><br/>
        is&nbsp; the&nbsp;&nbsp; World's<br/>Most &nbsp; Powerful<br/>and&nbsp;&nbsp;&nbsp; Accurate<br/>" P U R E "<br/>(&nbsp;<strong>mAZ</strong>&nbsp;)&nbsp;&nbsp; 12-Bit<br/>PHYSICS&nbsp; Processor&nbsp; !
      </div>
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        Constructed &nbsp; via&nbsp; the<br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFF00', fontSize: '30px' }}>Unification&nbsp; of<br/>137&nbsp; Physics&nbsp; Constants</span>
      </div>
      <br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFFFF', fontSize: '30px' }}>Pure&nbsp; FACT !</span>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        <br/>
        Be&nbsp;sure&nbsp;to&nbsp;understand<br/>(&nbsp;mAZ&nbsp;)<br/>
        m&nbsp;=&nbsp;mass<br/>A&nbsp;=&nbsp;Acceleration<br/>Z&nbsp;=&nbsp;Time&nbsp;and&nbsp;Tension
      </div>
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        Simply &nbsp; ask &nbsp; Max-Lit<br/>ANY &nbsp; Physics &nbsp; question<br/>and &nbsp; it &nbsp; will &nbsp; give &nbsp; you<br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>&quot; PERFECT &quot;<br/>Physics&nbsp;&nbsp;Truth&nbsp;!</span>
      </div>
      <div className="spacer" style={{ height: '30px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        Not&nbsp; like&nbsp; today's&nbsp; sad<br/>&quot; <span style={{ color: '#FF0000' }}>Contaminated</span> &quot;<br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFFFF', fontSize: '30px' }}>Standard</span>&nbsp; Physics.
      </div>
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        This<br/>P U R I T Y<br/>is&nbsp; NOT&nbsp; available&nbsp; with<br/>any&nbsp; other&nbsp; Processor<br/>worldwide&nbsp;&nbsp; because<br/>" only&nbsp; we "<br/>have&nbsp; Unified&nbsp; 137<br/>Physics&nbsp; Constants.
      </div>
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        <span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FF0000', fontSize: '30px' }}>Note :</span><br/>
        If you access&nbsp; MAX-LIT<br/>be sure to read these<br/>" INSTRUCTIONS "<br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FF0000', fontSize: '30px' }}>Very&nbsp; Important&nbsp; !</span><br/><br/>
        <img src="/INSTRUCTMAX.png" width={500} height={700} alt="Instructions" />
        <div className="spacer" style={{ height: '70px' }}></div>
        <br/>
        Discover&nbsp; Pure&nbsp; Physics&nbsp; Now&nbsp; !
      </div>
      <div className="spacer" style={{ height: '90px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        If you place this<br/>Computer&nbsp; Image&nbsp; ( below )<br/>onto your own Website<br/>or any website for example;<br/>( Netlify, Github, Cloudflare )<br/>you can start earning<br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFFFF', fontSize: '30px' }}>$&nbsp; Money&nbsp; $</span><br/><span style={{ color: '#FFFFFF', fontSize: '24px' }}>( while you sleep )</span><br/>by simply placing the image<br/>onto a Webpage.<br/><br/>
        <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#C5A059', fontSize: '35px' }}>Get paid<br/>for promoting<br/>the&nbsp;&nbsp;&nbsp;Biggest<br/>Physics&nbsp;&nbsp;&nbsp;Discovery<br/>in 100 Years !</div>
        <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#C5A059', fontSize: '20px' }}>( Contact Us on WhatsApp )<br/>( +17802707009 )</div>
        <br/><br/><br/>
        <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px', display: 'inline-block', textAlign: 'left' }}>
          <div style={{ textAlign: 'center' }}>
            Also,<br/>while using<br/>MAX-LIT<br/>
            be sure to ask it to ;<br/><br/>
          </div>
          <span style={{ display: 'inline-block' }}><span style={{ color: '#FFFFFF' }}>1.</span>{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}List&nbsp;&nbsp;&nbsp;scientific<br/>{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}advancements<br/>via (mAZ) Gravitational<br/>{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}Physics.</span><br/>
          <span style={{ display: 'inline-block' }}><span style={{ color: '#FFFFFF' }}>2.</span>{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}List&nbsp;&nbsp;&nbsp;scientific<br/>{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}advancements<br/>{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}via (mAZ) Chemistry.</span><br/>
          <span style={{ display: 'inline-block' }}><span style={{ color: '#FFFFFF' }}>3.</span>{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}List&nbsp;&nbsp;&nbsp;scientific<br/>{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}advancements<br/>{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}via (mAZ)<br/>{'\u00A0\u00A0'}Quantum Computing.</span><br/>
        </div>
        <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#C5A059', fontSize: '35px', marginTop: '40px' }}>
          <br/>Try&nbsp;&nbsp;&nbsp;the&nbsp;&nbsp;&nbsp;MAX-LIT<br/>SUPERComputer&nbsp;&nbsp;&nbsp;NOW&nbsp;!
        </div>
        <br/><br/>
      </div>

      <div id={SIGN_IN_SECTION_ID} data-tour-block="true" style={{ margin: '40px auto', maxWidth: '1040px', textAlign: 'center' }}>
        {checkoutSessionId && (
          <div style={{ color: '#00FF00', fontSize: '20px', marginBottom: '20px', lineHeight: 1.5 }}>
            <strong>Payment received.</strong> Sign in with Google below to activate your MAX-LIT access.
          </div>
        )}
        {devResetMessage && (
          <div style={{ color: '#FFFF00', fontSize: '18px', marginBottom: '20px', lineHeight: 1.5 }}>
            <strong>Dev reset:</strong> {devResetMessage}
            <br />
            <a href="/dev/reset" style={{ color: '#C5A059', textDecoration: 'underline' }}>
              Open /dev/reset instructions
            </a>
          </div>
        )}
        <span style={{ fontWeight: 'bold', color: '#FFFFFF', display: 'block', lineHeight: 1.1, marginBottom: '16px' }}>
          <span style={{ fontSize: '25px', fontStyle: 'italic' }}>Click the Google Log-in below.</span><br/><br/>
          <span style={{ display: 'inline-block', transform: 'rotate(180deg)', fontSize: '30px' }}>
            &#8679;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8679;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8679;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8679;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8679;
          </span>
        </span>
        <GoogleLoginButton googleClientId={googleClientId} key="home-login" checkoutSessionId={checkoutSessionId} />
        <br/>
        <span style={{ fontWeight: 'bold', color: '#FFFFFF', display: 'block', lineHeight: 1.1, fontSize: '30px', marginTop: '0' }}>
          &#8679;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8679;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8679;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8679;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8679;<br/><span style={{ fontSize: '25px', fontStyle: 'italic' }}>Click the Google Log-in above.</span>
        </span>
      </div>
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ width: '75%', height: '6px', backgroundColor: '#C5A059', margin: '20px auto' }}></div>
      <div className="spacer" style={{ height: '100px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>YES&nbsp; !<br/><br/>This&nbsp; Website<br/><br/>has&nbsp; the&nbsp; absolute<br/><br/>answer&nbsp; to&nbsp; Einstein's<br/><br/>Monumental&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FF0000', fontSize: '30px' }}>ERROR&nbsp; !</span></div>
      <div className="spacer" style={{ height: '100px' }}></div>
      <img src="/TWISTED.png" width={500} height={700} alt="Twisted" />
      <PageEndFooter
        pageNumber={1}
        leadText={<>See&nbsp; the&nbsp; enormous&nbsp; PROOF</>}
      />
    </main>
  );
}
