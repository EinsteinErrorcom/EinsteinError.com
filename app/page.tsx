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

  if (session) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("trial_start_at, is_subscribed")
      .eq("id", session.user.id)
      .single();

    const isTrialActive = profile && !profile.is_subscribed && 
      (new Date().getTime() - new Date(profile.trial_start_at).getTime() < 7200000);

    if (error || (!profile?.is_subscribed && !isTrialActive)) {
      redirect("https://www.EinsteinGravity.com/stripe-payment");
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
      
      {/* Dynamic Truth Counter Layout Block */}
      <div style={{ backgroundColor: '#000000', color: '#ffffff', padding: '24px', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", textAlign: 'center', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.1rem', fontWeight: 500 }}># of people who have<br/>now learned the TRUTH&nbsp; =&nbsp; </span>
        
        <div style={{ border: '2px solid #ffffff', borderRadius: '50px', padding: '6px 20px', display: 'inline-block', backgroundColor: '#000000' }}>
          <span id="truth-counter-digits" style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '1px' }}>5,731,137</span>
        </div>
      </div>

      {/* Turbopack Safe Script Execution */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            async function fetchAndUpdateCounter() {
              try {
                const response = await fetch('/api/view?slug=home');
                const data = await response.json();
                
                if (data && typeof data.count === 'number') {
                  const element = document.getElementById('truth-counter-digits');
                  if (element) {
                    element.textContent = data.count.toLocaleString();
                  }
                }
              } catch (err) {
                console.error('Could not fetch live view count', err);
              }
            }

            fetchAndUpdateCounter();
          `
        }}
      />
      
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
        Simply &nbsp; ask &nbsp; Max-Lit<br/>ANY &nbsp; Physics &nbsp; question<br/>and &nbsp; it &nbsp; will &nbsp; give &nbsp; you<br/><span style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#00FFFF', fontSize: '30px' }}>" PERFECT "<br/>Physics &nbsp; Truth &nbsp; !</span>
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
        And if you place this<br/>Computer&nbsp; Image&nbsp; ( below )<br/>onto your own Website<br/>or any website for example;<br/>( Netlify, Github, Cloudflare )<br/>you can start earning...
      </div>
    </main>
  );
}
