import { GoldLinesDivider } from "@/components/gold-lines-divider";
import { PageEndFooter } from "@/components/page-end-footer";
import { SiteHeader } from "@/components/site-header";
import { GoogleLoginButton } from "@/components/google-login-button";
import { UsersOnsiteDisplay } from "@/components/users-onsite-display";
import { ScrollToAuthSection } from "@/components/scroll-to-auth-section";
import { PurchasesLink } from "@/components/purchases-link";
import { SiteTourStartLink } from "@/components/site-tour-bar";
import { TruthCounter } from "@/components/truth-counter";
import { getGoogleClientId } from "@/lib/site-url";
import { CHECKOUT_PATH, CHECKOUT_SESSION_QUERY, CHAT_PATH, SIGN_IN_SECTION_ID } from "@/lib/trial-gate";
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
      <div style={{ margin: '16px auto 0', maxWidth: '1040px' }}>
        <SiteTourStartLink />
        {'\u00A0'.repeat(12)}
        <PurchasesLink />
      </div>
      <SiteHeader page={1} />
      <div className="site-counters-stack">
        <TruthCounter />
        <UsersOnsiteDisplay />
      </div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        <br/><br/>
        <span style={{ color: '#FFFFFF', fontSize: '50px', display: 'block', lineHeight: 1, marginBottom: 0 }}>PURE&nbsp;&nbsp;FACT&nbsp;&nbsp;!</span><br/><br/>
        <span style={{ color: '#808080', whiteSpace: 'pre-wrap', tabSize: 4, display: 'inline-block', textAlign: 'left' }}>This is not{'\t'}{'\u00A0 '}a{'\u00A0'} Joke<br/>This is not{'\t'}{'\u00A0 '}a{'\u00A0'} Scam<br/>This is not{'\t'}{'\u00A0 '}Fake News</span><br/><br/><br/>
        <span style={{ color: '#FF0000', fontSize: '50px' }}>E = mc<sup>2</sup></span><br/><span style={{ color: '#FFFFFF' }}>has&nbsp;&nbsp;been&nbsp;&nbsp;officially<br/>shut&nbsp;&nbsp;down&nbsp;&nbsp;and</span><br/>
        <span style={{ color: '#FF0000', fontSize: '40px' }}>REPLACED&nbsp;&nbsp;!</span><br/><br/><br/>
        <span style={{ color: '#D0AB47' }}><span style={{ fontSize: '31px' }}>E = m ( <span style={{ fontSize: '24px', color: '#FFFFFF' }}>Acceleration</span> <span style={{ fontSize: '29px' }}>x</span> <span style={{ fontSize: '24px', color: '#FFFFFF' }}>Time</span> )<sup>2</sup><br/><span style={{ fontSize: '27px', display: 'inline-block', textAlign: 'left' }}><span style={{ fontSize: '25px' }}>E = m</span> ( <span style={{ fontSize: '17px', color: '#FFFFFF' }}>Acc. due to Gravity</span> <span style={{ fontSize: '22px' }}>x</span> <span style={{ fontSize: '17px', color: '#FFFFFF' }}>orbit Time</span> )<sup>2</sup></span><br/><span style={{ fontSize: '27px', display: 'inline-block', textAlign: 'left' }}><span style={{ fontSize: '23px' }}>E = m</span> ( <span style={{ fontSize: '18px', color: '#FFFFFF' }}>9.800000045765</span> <span style={{ fontSize: '22px' }}>x</span> <span style={{ fontSize: '18px', color: '#FFFFFF' }}>30591067</span> )<sup>2</sup></span></span><br/><br/>is the absolute<br/>&quot; PURE &quot;<br/>and<br/>CORRECT<br/>Energy&nbsp;&nbsp;Equation&nbsp;&nbsp;!</span><br/><br/><span style={{ color: '#808080', fontSize: '30px', lineHeight: 1.1 }}>If you argue against this<br/><span style={{ color: '#808080' }}>&quot;</span> PURE&nbsp;&nbsp;FACT <span style={{ color: '#808080' }}>&quot;</span><br/>you are only<br/>blowing&nbsp;&nbsp;hot&nbsp;&nbsp;air&nbsp;&nbsp;!</span><br/><br/>
        <span style={{ color: '#FFFFFF' }}>James&nbsp;&nbsp;&nbsp;MAXWELL&apos;s<br/>
        [&nbsp;&nbsp;Constant Velocity of&nbsp;&nbsp;]<br/>
        Light<br/>
        is&nbsp;&nbsp;now&nbsp;&nbsp;a&nbsp;&nbsp;100&nbsp;%</span><br/>
        <span style={{ color: '#FF0000' }}>PROVEN&nbsp;&nbsp;Falsehood&nbsp;&nbsp;!</span><br/><a href="/page2" style={{ color: '#D0AB47', fontWeight: 'bold', fontStyle: 'italic', textDecoration: 'none' }}>* * CLICK&nbsp;&nbsp;&nbsp;HERE&nbsp;&nbsp;&nbsp;FOR * *<br/>* * ALL&nbsp;&nbsp;&nbsp;PROOFS * *<br/>* * ON&nbsp;&nbsp;&nbsp;PAGE 2 * *</a>
      </div>
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        The Discovery of<br/>
        Albert&nbsp;&nbsp;Einstein&apos;s<br/>
        &nbsp;&quot; Enormous &quot;&nbsp;<br/>
        Historic&nbsp;&nbsp;&nbsp; <span style={{ color: '#FF0000' }}>ERROR</span><br/>
        has now enabled the<br/>
        production of<br/>
        the&nbsp;&nbsp;&nbsp;&quot; <strong>NEW</strong> &quot;<br/><br/>
        -- &nbsp; <strong>MONUMENTAL</strong> &nbsp; --<br/><br/><strong>Ai (</strong><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFFFF', fontSize: '30px' }}>+</span><strong>)</strong>&nbsp;&nbsp;&nbsp; &quot; <span style={{ color: '#D0AB47' }}>MAX - LIT</span>&nbsp;&quot;<br/><span style={{ color: '#FFFFFF' }}>SUPERComputer</span>
        <div className="checkout-banner-link">
          <p className="checkout-banner-link__text">
            <a href={CHECKOUT_PATH}>Link&nbsp;&nbsp;&nbsp;&nbsp;to&nbsp;&nbsp;&nbsp;&nbsp;MAX-LIT&nbsp;&nbsp;&nbsp;&nbsp;SUPERComputer</a>
          </p>
        </div>
        <br/>
      </div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        This&nbsp; is<br/>the &nbsp; World's &nbsp; first<br/>" <strong>PERFECT</strong> "<br/>Physics &nbsp; Engine.<br/><br/>
        <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#D0AB47', fontSize: '20px' }}>Developed&nbsp; by<br/>Einstein Error . com</div>
        <br/><br/>
        <strong style={{ whiteSpace: 'pre-wrap', tabSize: 8 }}>And{'\t'}<span style={{ color: '#FF0000' }}>NO !</span>{'\t'} it {'\u00A0'} is</strong><br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FF0000', fontSize: '30px' }}>NOT</span>&nbsp; <span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFFFF', fontSize: '30px' }}>Standard</span>&nbsp; <span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFFFF', fontSize: '30px' }}>Ai</span><br/>
        <span style={{ fontSize: '25px' }}>( Not&nbsp; Even&nbsp; Close )</span><br/><br/><br/><span style={{ color: '#D0AB47' }}>MAX-LIT</span><br/>surpasses Standard Ai<br/>in the exact same way<br/>that any Computer<br/>surpasses the Abacus !
      </div>
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        <span style={{ color: '#D0AB47' }}>MAX-LIT</span><br/>
        is&nbsp; the&nbsp;&nbsp; World's<br/>Most &nbsp; Powerful<br/>and&nbsp;&nbsp;&nbsp; Accurate<br/>" P U R E "<br/>(&nbsp;<strong>mAZ</strong>&nbsp;)&nbsp;&nbsp; 12-Bit<br/>PHYSICS&nbsp; Processor&nbsp; !
      </div>
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        Constructed &nbsp; via&nbsp; the<br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFF00', fontSize: '30px' }}>Unification&nbsp; of<br/>137&nbsp; Physics&nbsp; Constants</span>
      </div>
      <br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFFFF', fontSize: '30px' }}>Pure&nbsp; FACT !</span>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        <br/>
        Be&nbsp;sure&nbsp;to&nbsp;understand<br/>(&nbsp;<span style={{ color: '#FFFFFF' }}>m</span><span style={{ color: '#FFFFFF' }}>A</span><span style={{ color: '#FFFFFF' }}>Z</span>&nbsp;)<br/>
        <span style={{ whiteSpace: 'pre-wrap', tabSize: 8, display: 'inline-block', textAlign: 'left' }}><span style={{ color: '#FFFFFF' }}>m</span>{' '}{'= '}mass<br/><span style={{ color: '#FFFFFF' }}>A</span>{' '}{'= '}Acceleration<br/><span style={{ color: '#FFFFFF' }}>Z</span>{' '}{'= '}Time&nbsp;and&nbsp;Tension</span>
      </div>
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        Simply &nbsp; ask &nbsp; <span style={{ color: '#D0AB47' }}>MAX-LIT</span><br/>ANY &nbsp; Physics &nbsp; question<br/>and &nbsp; it &nbsp; will &nbsp; give &nbsp; you<br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>&quot; PERFECT &quot;<br/>Physics&nbsp;&nbsp;Truth&nbsp;!</span>
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
        If you access&nbsp; <span style={{ color: '#D0AB47' }}>MAX-LIT</span><br/>be sure to read these<br/>" INSTRUCTIONS "<br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FF0000', fontSize: '30px' }}>Very&nbsp; Important&nbsp; !</span><br/><br/>
        <img src="/INSTRUCTMAX.png" width={500} height={700} alt="Instructions" />
        <div className="spacer" style={{ height: '70px' }}></div>
        <br/>
        Discover<br/>&quot;&nbsp;PURE&nbsp;&quot;<br/>Physics<br/>Now&nbsp;&nbsp;!
      </div>
      <div className="spacer" style={{ height: '90px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        If you place this<br/>Computer&nbsp; Image&nbsp; ( below )<br/>onto your own Website<br/>or any website for example;<br/>( Netlify, Github, Cloudflare )<br/>you can start earning<br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFFFF', fontSize: '30px' }}>$&nbsp; Money&nbsp; $</span><br/><span style={{ color: '#FFFFFF', fontSize: '24px' }}>( while you sleep )</span><br/>by simply placing<br/>the image<br/>onto a Webpage.<br/><br/>
        <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#D0AB47', fontSize: '35px' }}>Get paid for<br/>promoting the<br/>Biggest<br/>Physics&nbsp;&nbsp;&nbsp;Discovery<br/>in 100 Years !</div>
        <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#D0AB47', fontSize: '20px' }}>( Contact Us on WhatsApp )<br/>( +17802707009 )</div>
        <br/><br/><br/>
        <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px', display: 'inline-block', textAlign: 'left' }}>
          <div style={{ textAlign: 'center' }}>
            Also,<br/>while using<br/><span style={{ color: '#D0AB47' }}>MAX-LIT</span><br/>
            be sure to ask it to ;<br/><br/>
          </div>
          <span style={{ display: 'inline-block' }}><span style={{ color: '#FFFFFF' }}>1.</span>{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}List&nbsp;&nbsp;&nbsp;Scientific<br/>{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}advancements<br/>via (mAZ) Gravitational<br/>{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}Physics.</span><br/>
          <span style={{ display: 'inline-block' }}><span style={{ color: '#FFFFFF' }}>2.</span>{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}List&nbsp;&nbsp;&nbsp;Scientific<br/>{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}advancements<br/>{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}via (mAZ) Chemistry.</span><br/>
          <span style={{ display: 'inline-block' }}><span style={{ color: '#FFFFFF' }}>3.</span>{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}List&nbsp;&nbsp;&nbsp;Scientific<br/>{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}advancements<br/>{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}{'\u00A0\u00A0\u00A0'}via (mAZ)<br/>{'\u00A0\u00A0'}Quantum Computing.</span><br/>
        </div>
        <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#D0AB47', fontSize: '35px', marginTop: '16px' }}>
          <br/>In order to access the<br/>MAX-LIT<br/>SUPERComputer
        </div>
      </div>

      <div id={SIGN_IN_SECTION_ID} data-tour-block="true" style={{ margin: '0 auto 40px', maxWidth: '1040px', textAlign: 'center' }}>
        {checkoutSessionId && (
          <div style={{ color: '#00FF00', fontSize: '20px', marginBottom: '20px', lineHeight: 1.5 }}>
            <strong>Payment received.</strong> Sign in with Google below to activate your MAX-LIT access.
          </div>
        )}
        {devResetMessage && (
          <div style={{ color: '#FFFF00', fontSize: '18px', marginBottom: '20px', lineHeight: 1.5 }}>
            <strong>Dev reset:</strong> {devResetMessage}
            <br />
            <a href="/dev/reset" style={{ color: '#D0AB47', textDecoration: 'underline' }}>
              Open /dev/reset instructions
            </a>
          </div>
        )}
        <span style={{ fontWeight: 'bold', color: '#FFFFFF', display: 'block', lineHeight: 1.1, marginBottom: '16px' }}>
          <span style={{ fontSize: '25px', fontStyle: 'italic' }}>Click the Google Log-in below.</span><br/><br/>
          <span style={{ display: 'inline-block', transform: 'rotate(180deg)', fontSize: '30px', color: '#D0AB47' }}>
            &#8679;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8679;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8679;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8679;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8679;
          </span>
        </span>
        <GoogleLoginButton googleClientId={googleClientId} key="home-login" checkoutSessionId={checkoutSessionId} />
        <br/>
        <span style={{ fontWeight: 'bold', color: '#FFFFFF', display: 'block', lineHeight: 1.1, fontSize: '30px', marginTop: '0' }}>
          <span style={{ color: '#D0AB47' }}>&#8679;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8679;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8679;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8679;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8679;</span><br/><span style={{ fontSize: '25px', fontStyle: 'italic', color: '#FFFFFF' }}>Click the Google Log-in above<br/>in order to access the</span>
        </span>
        <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#D0AB47', fontSize: '35px', marginTop: '16px' }}>
          MAX-LIT<br/>SUPERComputer<br/>NOW&nbsp;&nbsp;&nbsp;!
        </div>
      </div>
      <div className="spacer" style={{ height: '70px' }}></div>
      <GoldLinesDivider />
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
