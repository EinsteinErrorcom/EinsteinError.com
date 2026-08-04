import { GoogleLoginButton } from "@/components/google-login-button";
import { CheckoutBannerLink } from "@/components/checkout-banner-link";
import { ScrollToAuthSection } from "@/components/scroll-to-auth-section";
import { SiteTourStartLink } from "@/components/site-tour-bar";
import { TruthCounter } from "@/components/truth-counter";
import { createClient } from "@/lib/supabase/server";
import { getGoogleClientId } from "@/lib/site-url";
import { isProfileTrialActive } from "@/lib/trial";
import { CHAT_PATH, SIGN_IN_SECTION_ID } from "@/lib/trial-gate";
import { redirect } from "next/navigation";

type HomeProps = {
  searchParams: Promise<{
    auth?: string;
    reason?: string;
    dev_reset?: string;
    code?: string;
    error?: string;
    error_description?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  // Supabase sometimes returns OAuth params to Site URL (/) instead of /auth/callback
  if (params.code || params.error) {
    const callbackParams = new URLSearchParams();
    if (params.code) callbackParams.set('code', params.code);
    if (params.error) callbackParams.set('error', params.error);
    if (params.error_description) {
      callbackParams.set('error_description', params.error_description);
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
            background: "#161b22",
            padding: "30px",
            borderRadius: "12px",
            margin: "40px auto",
            maxWidth: "1040px",
            border: "6px solid #C5A059",
            textAlign: "center",
          }}
        >
          <GoogleLoginButton
            googleClientId={googleClientId}
            initialError={authError}
          />
        </div>
      </main>
    );
  }

  const googleClientId = await getGoogleClientId();

  const devResetMessage = params.dev_reset
    ? decodeURIComponent((params.reason ?? "Trial reset requires sign-in first.").replace(/\+/g, " "))
    : null;

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("trial_start_at, is_subscribed")
      .eq("id", session.user.id)
      .single();

    if (profile && isProfileTrialActive(profile)) {
      redirect(CHAT_PATH);
    }
  }

  return (
    <main className="page-wrapper">
      <ScrollToAuthSection />
      <p style={{ margin: '16px auto 0', maxWidth: '1040px' }}>
        <SiteTourStartLink />
      </p>
      <img src="/TITLE2.png" alt="Einstein Error Title Banner" width={700} height={150} />
      <CheckoutBannerLink />
      <span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFF00', fontSize: '25px', display: 'block', marginTop: '16px' }}>
        **&nbsp; Contact&nbsp; Us&nbsp; **
      </span>
      
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', fontSize: '20px', marginTop: '12px' }}>
        <span style={{ color: '#00FFFF' }}>WhatsApp</span><br/>
        <span style={{ color: '#FFFF00' }}>+17802707009</span>
        <br/><br/>
        <span style={{ color: '#00FFFF' }}>Email</span><br/>
        <span style={{ color: '#FFFF00' }}>wild.book0719@fastmail.com</span>
      </div>
      
      <br/><br/>
      <div className="spacer" style={{ height: '20px' }}></div>
      
      <TruthCounter />
      
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        The Discovery of<br/>
        Albert&nbsp;&nbsp;Einstein&apos;s<br/>
        Historic&nbsp; <span style={{ color: '#FF0000' }}>ERROR</span><br/>
        has now enabled us<br/>
        to build the &quot; <strong>NEW</strong> &quot;<br/><br/>
        -- &nbsp; <strong>MONUMENTAL</strong> &nbsp; --<br/><br/><strong>Ai (</strong><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFFFF', fontSize: '30px' }}>+</span><strong>)</strong>&nbsp;&nbsp;&nbsp; &quot; MAX - LIT &quot;
      </div>
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        This&nbsp; is<br/>the &nbsp; World's &nbsp; first<br/>" <strong>PERFECT</strong> "<br/>Physics &nbsp; Engine.<br/><br/>
        <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFF00', fontSize: '20px' }}>( Developed&nbsp; by&nbsp; Einstein Error . com )</div>
        <br/><br/>
        <strong>NO !</strong><br/>NOT&nbsp; <span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFFFF', fontSize: '30px' }}>Standard</span>&nbsp; Ai<br/>
        <span style={{ fontSize: '25px' }}>( Not&nbsp; Even&nbsp; Close )</span>
      </div>
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        <span style={{ color: '#FFFF00' }}>MAX-LIT</span><br/>
        is&nbsp; the&nbsp;&nbsp; World's<br/>Most &nbsp; Powerful<br/>and&nbsp;&nbsp;&nbsp; Accurate<br/>" P U R E "<br/>(&nbsp;<strong>mAZ</strong>&nbsp;)&nbsp;&nbsp; 12-Bit<br/>PHYSICS&nbsp; Processor&nbsp; !
      </div>
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        Constructed &nbsp; via&nbsp; the<br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFF00', fontSize: '30px' }}>Unification&nbsp; of<br/>137&nbsp; Physics&nbsp; Constants</span>
      </div>
      <br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFFFF', fontSize: '30px' }}>Pure&nbsp; FACT !</span>
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        Simply &nbsp; ask &nbsp; Max-Lit<br/>ANY &nbsp; Physics &nbsp; question<br/>and &nbsp; it &nbsp; will &nbsp; give &nbsp; you<br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>&quot; PERFECT &quot;<br/>Physics&nbsp;&nbsp;Truth&nbsp;!</span>
      </div>
      <div className="spacer" style={{ height: '30px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        ( Not&nbsp; today's&nbsp; sad<br/>" Contaminated "<br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFFFF', fontSize: '30px' }}>Standard</span>&nbsp; Physics )
      </div>
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        This<br/>P U R I T Y<br/>is&nbsp; NOT&nbsp; available<br/>with&nbsp; any&nbsp; other&nbsp; Processor<br/>worldwide&nbsp;&nbsp; because<br/>" ONLY&nbsp; we "<br/>have&nbsp; Unified&nbsp; 137<br/>Physics&nbsp; Constants.
      </div>
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        <span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FF0000', fontSize: '30px' }}>Note :</span><br/>
        If you access&nbsp; MAX-LIT<br/>be sure to read these<br/>" INSTRUCTIONS "<br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FF0000', fontSize: '30px' }}>Very&nbsp; Important&nbsp; !</span><br/><br/>
        <img src="/INSTRUCTMAX.png" width={500} height={700} alt="Instructions" />
        <div className="spacer" style={{ height: '70px' }}></div>
        Discover&nbsp; Pure&nbsp; Physics&nbsp; Now&nbsp; !
      </div>
      <div className="spacer" style={{ height: '90px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        And if you place this<br/>Computer&nbsp; Image&nbsp; ( below )<br/>onto your own Website<br/>or any website for example;<br/>( Netlify, Github, Cloudflare )<br/>you can start earning<br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFFFF', fontSize: '35px' }}>$&nbsp; Money&nbsp; $</span><br/>by simply placing a small<br/>snippet onto your Website<br/>that displays this<br/><br/>
        <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#C5A059', fontSize: '35px' }}>* Monumental *<br/>Discovery&nbsp; !</div>
        <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#C5A059', fontSize: '20px' }}>( Contact Us on WhatsApp )<br/>( +17802707009 )</div><br/><br/>
        <br/><img src="/MAX-LIT.png" alt="Max-Lit Engine" width={500} height={400} />
      </div>

      <div id={SIGN_IN_SECTION_ID} data-tour-block="true" style={{ background: '#161b22', padding: '30px', borderRadius: '12px', margin: '40px auto', maxWidth: '1040px', border: '6px solid #C5A059', textAlign: 'center' }}>
        {devResetMessage && (
          <div style={{ color: '#FFFF00', fontSize: '18px', marginBottom: '20px', lineHeight: 1.5 }}>
            <strong>Dev reset:</strong> {devResetMessage}
            <br />
            <a href="/dev/reset" style={{ color: '#C5A059', textDecoration: 'underline' }}>
              Open /dev/reset instructions
            </a>
          </div>
        )}
        <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>TRY&nbsp;&nbsp; " MAX-LIT "&nbsp;&nbsp; FREE&nbsp; !</div>
        <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '25px', marginTop: '15px', marginBottom: '20px' }}>To access your&nbsp; 2 - Hour&nbsp; FREE&nbsp; trial<br/>Sign-in with your Google account.</div>
        <GoogleLoginButton googleClientId={googleClientId} key="home-login" />
      </div>
      <span style={{ fontWeight: 'bold', color: '#FFFFFF', display: 'block', lineHeight: 1.1 }}>
        &#8679;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8679;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8679;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8679;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8679;<br /><span style={{ fontSize: '25px', fontStyle: 'italic' }}>Click the Google Log-in above.</span>
      </span>
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ width: '75%', height: '6px', backgroundColor: '#C5A059', margin: '20px auto' }}></div>
      <div className="spacer" style={{ height: '100px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>YES&nbsp; !<br/><br/>This&nbsp; Website<br/><br/>has&nbsp; the&nbsp; absolute<br/><br/>answer&nbsp; to&nbsp; Einstein's<br/><br/>Monumental&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FF0000', fontSize: '30px' }}>ERROR&nbsp; !</span></div>
      <div className="spacer" style={{ height: '100px' }}></div>
      <img src="/TWISTED.png" width={500} height={700} alt="Twisted" />
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <a href="/page2" style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '25px', textDecoration: 'none' }}>See&nbsp; the&nbsp; enormous&nbsp; PROOF<br/><br/>Click&nbsp; the&nbsp; <span style={{ color: '#FFFFFF' }}>Next&nbsp; Page</span> &rarr;<br/><br/>Einstein Error . com</a>
        <div className="spacer" style={{ height: '50px' }}></div>
        <span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FF0000', fontSize: '25px' }}>END&nbsp; of&nbsp; PAGE 1</span>
        <div className="spacer" style={{ height: '100px' }}></div>
      </div>
    </main>
  );
}
