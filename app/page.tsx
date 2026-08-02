import { GoogleLoginButton } from "@/components/google-login-button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const AUTH_CALLBACK_ERROR = "Google sign-in could not be completed. Please try again.";

type HomeProps = {
  searchParams: Promise<{ auth?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const authError = params.auth === "error" ? AUTH_CALLBACK_ERROR : undefined;

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // If a session exists, check trial status
  if (session) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("trial_start_at, is_subscribed")
      .eq("id", session.user.id)
      .single();

    // Only force redirect if:
    // 1. Profile exists (no redirect if user is brand new and row isn't created yet)
    // 2. User is not subscribed
    // 3. The 2-hour (7,200,000ms) trial window is definitely over
    if (profile && !profile.is_subscribed) {
      const isTrialActive = (new Date().getTime() - new Date(profile.trial_start_at).getTime() < 7200000);
      
      if (!isTrialActive) {
        redirect("https://www.EinsteinGravity.com/stripe-payment");
      }
    }
  }

  return (
    <main className="page-wrapper">
      <img src="/TITLE2.png" alt="Einstein Error Title Banner" width={700} height={150} />
      <br/><br/><br/><br/><br/><br/><br/>
      <span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFF00', fontSize: '25px' }}>
        Our Ai Engine is currently under Construction, give us 1 week.<br/><br/><br/>**&nbsp; Contact&nbsp; Us&nbsp; **
      </span>
      <br/>
      
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', fontSize: '20px' }}>
        <span style={{ color: '#00FFFF' }}>WhatsApp</span><br/>
        <span style={{ color: '#FFFF00' }}>+17802707009</span>
        <br/><br/>
        <span style={{ color: '#00FFFF' }}>Email</span><br/>
        <span style={{ color: '#FFFF00' }}>wild.book0719@fastmail.com</span>
      </div>
      
      <br/><br/>
      <div className="spacer" style={{ height: '20px' }}></div>
      
      <h1 id="counter-display" style={{ color: '#FFFFFF', fontWeight: 'bold', fontStyle: 'italic', fontSize: '20px', textShadow: '2px 2px 4px #000000' }}>
        # of people who now know the TRUTH - 5,731,137
      </h1>
      
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        This &nbsp; is &nbsp; the &nbsp; " <strong>NEW</strong> "<br/><br/>-- &nbsp; <strong>MONUMENTAL</strong> &nbsp; --<br/><br/><strong>Ai (+)</strong>&nbsp;&nbsp;&nbsp; " MAX - LIT "
      </div>
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        <strong>NO !</strong><br/>NOT&nbsp; <span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFFFF', fontSize: '30px' }}>Standard</span>&nbsp; Ai
      </div>
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        This&nbsp; is<br/>The &nbsp; World's &nbsp; FIRST<br/>" <strong>PERFECT</strong> "<br/>Physics &nbsp; Engine.<br/><br/>
        <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFF00', fontSize: '20px' }}>( Developed&nbsp; by&nbsp; Einstein Error . com )</div>
      </div>
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        The &nbsp;&nbsp; World's<br/>Most &nbsp; Powerful<br/>and&nbsp;&nbsp;&nbsp; Accurate<br/>" P U R E "<br/><strong>mAZ</strong>&nbsp;&nbsp; 12-Bit<br/>PHYSICS&nbsp; Processor&nbsp; !
      </div>
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        Constructed &nbsp; via&nbsp; the<br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFF00', fontSize: '30px' }}>Unification&nbsp; of<br/>137&nbsp; Physics&nbsp; Constants</span>
      </div>
      <br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFFFF', fontSize: '30px' }}>Pure&nbsp; FACT !</span>
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        Simply &nbsp; ask &nbsp; Max-Lit<br/>ANY &nbsp; Physics &nbsp; question<br/>and &nbsp; it &nbsp; will &nbsp; give &nbsp; you<br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>" PERFECT "<br/>PHYSICS &nbsp; TRUTH &nbsp; !</span>
      </div>
      <div className="spacer" style={{ height: '30px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        ( Not&nbsp; today's&nbsp; sad<br/>" Contaminated "<br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFFFF', fontSize: '30px' }}>Standard</span>&nbsp; Physics )
      </div>
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
        This<br/>P U R I T Y<br/>is&nbsp; NOT&nbsp; available<br/>with&nbsp; any&nbsp; other&nbsp; Processor<br/>worldwide&nbsp;&nbsp; because<br/>" ONLY&nbsp;&nbsp; We "<br/>have&nbsp; Unified&nbsp; 137<br/>Physics&nbsp; Constants.
      </div>
      <div className="spacer" style={{ height: '70px' }}></div>
      <span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FF0000', fontSize: '30px' }}>Note :</span><br/>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>
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

      <div id="auth-section" style={{ background: '#161b22', padding: '30px', borderRadius: '12px', margin: '40px auto', maxWidth: '800px', border: '6px solid #C5A059', textAlign: 'center' }}>
        <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>TRY&nbsp;&nbsp; " MAX-LIT "&nbsp;&nbsp; FREE&nbsp; !</div>
        <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '25px', marginTop: '15px', marginBottom: '20px' }}>To access your&nbsp; 2 - Hour&nbsp; FREE&nbsp; trial<br/>Sign-in with your Google account.</div>
        <GoogleLoginButton initialError={authError} />
      </div> 
        
      <span style={{ fontWeight: 'bold', color: '#FFFFFF' }}>&#8679;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8679;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8679;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8679;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8679;</span>
      <br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FFFFFF', fontSize: '35px' }}>Click&nbsp; the</span><br/>
      <span style={{ fontWeight: 'bold', color: '#FFFFFF' }}>" <span style={{ color: '#00FFFF' }}>Continue with Google</span> "</span>
      <br/><span style={{ fontWeight: 'bold', color: '#FFFFFF' }}>Link ( above )</span>
      <div className="spacer" style={{ height: '70px' }}></div>
      <div style={{ width: '75%', height: '6px', backgroundColor: '#C5A059', margin: '20px auto' }}></div>
      <div className="spacer" style={{ height: '100px' }}></div>
      <div style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>YES&nbsp; !<br/><br/>This&nbsp; Website<br/><br/>has&nbsp; the&nbsp; absolute<br/><br/>answer&nbsp; to&nbsp; Einstein's<br/><br/>Monumental&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FF0000', fontSize: '30px' }}>ERROR&nbsp; !</span></div>
      <div className="spacer" style={{ height: '100px' }}></div>
      <img src="/TWISTED.png" width={500} height={700} alt="Twisted" />
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <a href="/page2" style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '25px', textDecoration: 'none' }}>See&nbsp; the&nbsp; enormous&nbsp; PROOF<br/><br/>Click&nbsp; the&nbsp; Next&nbsp; Page &rarr;<br/><br/>Einstein Error . com</a>
        <div className="spacer" style={{ height: '50px' }}></div>
        <span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#FF0000', fontSize: '25px' }}>END&nbsp; of&nbsp; PAGE 1</span>
        <div className="spacer" style={{ height: '100px' }}></div>
      </div>
    </main>
  );
}