'use client';
import { useEffect, useRef, useState } from 'react';

const LINKEDIN = 'https://www.linkedin.com/in/amara-firdous-6b602b237/';
const GITHUB = 'https://github.com/Amara863';
const PROJECTS = {
  resume: 'https://github.com/Amara863/ai-resume-builder',
  aadhaar: 'https://github.com/Amara863/Aadhar_verification_system',
  recruitment: 'https://github.com/Amara863/Recruitment-Portal',
  library: 'https://github.com/Amara863/Library-Management-System',
};

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [typed, setTyped] = useState('');
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [formMsg, setFormMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [sending, setSending] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const roles = ['Full Stack Developer', 'Generative AI Enthusiast', 'Computer Science Student', 'Problem Solver', 'Open to Opportunities'];
    let ri = 0, ci = 0, del = false;
    let timer: ReturnType<typeof setTimeout>;
    function typeIt() {
      const c = roles[ri];
      if (del) { ci--; setTyped(c.slice(0, ci)); if (ci < 0) { del = false; ri = (ri + 1) % roles.length; timer = setTimeout(typeIt, 400); return; } }
      else { ci++; setTyped(c.slice(0, ci)); if (ci === c.length) { del = true; timer = setTimeout(typeIt, 2200); return; } }
      timer = setTimeout(typeIt, del ? 35 : 75);
    }
    timer = setTimeout(typeIt, 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const COLS = ['rgba(0,229,195,', 'rgba(124,58,237,', 'rgba(236,72,153,'];
    let W = 0, H = 0;
    let pts: { x: number; y: number; vx: number; vy: number; r: number; a: number; color: string }[] = [];
    let mo = { x: -999, y: -999 };
    let animId: number;
    function resize() {
      W = (canvas as HTMLCanvasElement).width = window.innerWidth; H = (canvas as HTMLCanvasElement).height = window.innerHeight;
      const n = Math.floor((W * H) / 14000);
      pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, r: Math.random() * 1.4 + .4, a: Math.random() * .45 + .08, color: COLS[Math.floor(Math.random() * COLS.length)] }));
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]; p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = p.color + p.a + ')'; ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.strokeStyle = p.color + (0.06 * (1 - d / 90)) + ')'; ctx.lineWidth = .5; ctx.stroke(); }
        }
        const mdx = p.x - mo.x, mdy = p.y - mo.y, md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 160) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mo.x, mo.y); ctx.strokeStyle = p.color + (0.18 * (1 - md / 160)) + ')'; ctx.lineWidth = .7; ctx.stroke(); }
      }
      animId = requestAnimationFrame(draw);
    }
    resize(); window.addEventListener('resize', resize); window.addEventListener('mousemove', e => { mo.x = e.clientX; mo.y = e.clientY; }); draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }), { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const h = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h);
  }, []);

  async function handleContact(e: React.FormEvent) {
    e.preventDefault(); setSending(true); setFormMsg(null);
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formState) });
      const data = await res.json();
      if (data.success) { setFormMsg({ text: '✓ ' + data.message, type: 'success' }); setFormState({ name: '', email: '', message: '' }); }
      else setFormMsg({ text: '✕ ' + data.message, type: 'error' });
    } catch { setFormMsg({ text: '✕ Network error. Please try again.', type: 'error' }); }
    setSending(false);
  }

  return (
    <>
      <style>{`
        :root{--bg:#05070f;--bg2:#080c18;--surface:#0e1525;--accent:#00e5c3;--accent2:#7c3aed;--text:#e8edf5;--text2:#8b9ab5;--text3:#3d4f6b;--border:rgba(0,229,195,0.14);--border2:rgba(255,255,255,0.06);--glow:0 0 40px rgba(0,229,195,0.18);--font-d:'Syne',sans-serif;--font-m:'DM Mono',monospace;--font-b:'Outfit',sans-serif;--radius:14px;--ease:cubic-bezier(0.16,1,0.3,1);}
        *{box-sizing:border-box;margin:0;padding:0;}html{scroll-behavior:smooth;}
        body{background:var(--bg);color:var(--text);font-family:var(--font-b);font-size:16px;line-height:1.7;overflow-x:hidden;}
        a{color:inherit;text-decoration:none;}h1,h2,h3{font-family:var(--font-d);font-weight:700;line-height:1.1;}
        .mono{font-family:var(--font-m);font-size:0.78rem;letter-spacing:0.08em;}.container{max-width:1100px;margin:0 auto;padding:0 2rem;}
        section{padding:110px 0;position:relative;}
        .reveal{opacity:0;transform:translateY(28px);transition:opacity 0.75s var(--ease),transform 0.75s var(--ease);}.reveal.visible{opacity:1;transform:translateY(0);}
        .section-header{display:flex;align-items:baseline;gap:1.2rem;margin-bottom:4rem;}.section-num{color:var(--accent);font-size:0.75rem;}
        .section-header h2{font-size:clamp(2rem,4vw,3rem);background:linear-gradient(135deg,var(--text) 40%,var(--text2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        #navbar{position:fixed;top:0;left:0;right:0;z-index:1000;padding:1.1rem 3rem;display:flex;align-items:center;justify-content:space-between;backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);background:rgba(5,7,15,0.75);border-bottom:1px solid transparent;transition:all 0.4s var(--ease);}
        #navbar.scrolled{border-bottom-color:var(--border2);padding:0.75rem 3rem;}.nav-logo{font-family:var(--font-d);font-size:1.4rem;font-weight:800;}.dot{color:var(--accent);}
        .nav-links{display:flex;list-style:none;gap:2.5rem;}.nav-links a{font-size:0.85rem;color:var(--text2);letter-spacing:0.05em;transition:color 0.25s;position:relative;}
        .nav-links a::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:1px;background:var(--accent);transition:width 0.3s;}.nav-links a:hover{color:var(--accent);}.nav-links a:hover::after{width:100%;}
        #hero{min-height:100vh;display:flex;align-items:center;padding:0;position:relative;overflow:hidden;}
        #bgCanvas{position:absolute;inset:0;width:100%;height:100%;z-index:0;}
        .aurora-wrap{position:absolute;inset:0;z-index:1;overflow:hidden;pointer-events:none;}
        .aurora{position:absolute;border-radius:50%;filter:blur(80px);opacity:0.18;animation:auroraDrift 12s ease-in-out infinite alternate;}
        .aurora.a1{width:600px;height:600px;background:radial-gradient(circle,#7c3aed,transparent 70%);top:-100px;left:-100px;animation-duration:14s;}
        .aurora.a2{width:500px;height:500px;background:radial-gradient(circle,#00e5c3,transparent 70%);top:20%;right:-80px;animation-duration:10s;animation-delay:-4s;}
        .aurora.a3{width:400px;height:400px;background:radial-gradient(circle,#ec4899,transparent 70%);bottom:-80px;left:40%;animation-duration:16s;animation-delay:-8s;}
        @keyframes auroraDrift{0%{transform:translate(0,0) scale(1);opacity:0.15;}50%{transform:translate(40px,30px) scale(1.08);opacity:0.22;}100%{transform:translate(-20px,20px) scale(0.95);opacity:0.18;}}
        .hero-grid-lines{position:absolute;inset:0;z-index:1;pointer-events:none;background-image:linear-gradient(rgba(0,229,195,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,195,0.035) 1px,transparent 1px);background-size:55px 55px;mask-image:radial-gradient(ellipse at center,black 20%,transparent 75%);}
        .hero-content{position:relative;z-index:3;max-width:1100px;margin:0 auto;padding:0 2rem;padding-top:90px;display:flex;align-items:center;justify-content:space-between;gap:4rem;width:100%;}
        .hero-left{display:flex;align-items:flex-start;gap:2.5rem;flex:1;}.hero-text{flex:1;}
        .hero-name{font-size:clamp(3rem,7vw,6.5rem);font-weight:800;line-height:0.95;margin-bottom:1.2rem;}
        .solid-text{background:linear-gradient(135deg,#fff 0%,var(--accent) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .outline-text{-webkit-text-stroke:2px var(--text3);color:transparent;transition:-webkit-text-stroke-color 0.4s;}.outline-text:hover{-webkit-text-stroke-color:var(--accent);}
        .hero-role{font-size:1.05rem;color:var(--text2);margin-bottom:2rem;min-height:1.8rem;}
        .cursor-blink{color:var(--accent);animation:blink 1s step-end infinite;}@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        .hero-cta{display:flex;gap:0.8rem;flex-wrap:wrap;margin-bottom:2rem;}
        .btn-primary{padding:0.75rem 1.8rem;background:linear-gradient(135deg,var(--accent),#00bfa8);color:var(--bg);border-radius:8px;font-weight:600;font-size:0.88rem;transition:all 0.3s;border:2px solid transparent;display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-family:var(--font-b);}
        .btn-primary:hover{background:transparent;border-color:var(--accent);color:var(--accent);box-shadow:0 0 28px rgba(0,229,195,0.3);}
        .btn-primary.full{width:100%;justify-content:center;}
        .btn-ghost{padding:0.75rem 1.8rem;border:1.5px solid var(--border2);color:var(--text2);border-radius:8px;font-size:0.88rem;transition:all 0.3s;display:inline-flex;align-items:center;}.btn-ghost:hover{border-color:var(--accent);color:var(--accent);}
        .btn-resume{padding:0.75rem 1.4rem;border:1.5px solid rgba(124,58,237,0.4);color:#a78bfa;border-radius:8px;font-size:0.88rem;transition:all 0.3s;display:inline-flex;align-items:center;gap:6px;background:rgba(124,58,237,0.06);}.btn-resume:hover{background:rgba(124,58,237,0.15);border-color:var(--accent2);color:#c4b5fd;}
        .hero-socials{display:flex;gap:0.8rem;}.hero-socials a{width:38px;height:38px;border:1px solid var(--border2);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--text2);font-size:0.8rem;transition:all 0.3s;}.hero-socials a:hover{border-color:var(--accent);color:var(--accent);transform:translateY(-3px);}
        .hero-right{flex-shrink:0;width:275px;}
        .hero-card{background:rgba(14,21,37,0.75);border:1px solid rgba(255,255,255,0.08);border-radius:var(--radius);padding:1.5rem;backdrop-filter:blur(20px);}
        .hc-row{display:flex;justify-content:space-between;align-items:center;padding:0.55rem 0;border-bottom:1px solid rgba(255,255,255,0.04);}.hc-label{font-size:0.7rem;color:var(--text3);font-family:var(--font-m);letter-spacing:0.06em;}.hc-val{font-size:0.82rem;color:var(--text);}
        .hc-divider{height:1px;background:var(--border2);margin:1rem 0;}.hc-stats{display:flex;justify-content:space-between;}.hcs{text-align:center;}
        .hcs-n{display:block;font-family:var(--font-d);font-size:1.6rem;font-weight:800;color:var(--accent);line-height:1;}.hcs-l{font-size:0.62rem;color:var(--text3);letter-spacing:0.08em;text-transform:uppercase;}
        .hero-scroll{position:absolute;bottom:2.5rem;left:50%;transform:translateX(-50%);z-index:3;display:flex;flex-direction:column;align-items:center;gap:0.4rem;color:var(--text3);font-size:0.62rem;letter-spacing:0.15em;}
        .scroll-line{width:1px;height:44px;background:linear-gradient(to bottom,var(--accent),transparent);animation:scrollAnim 2s ease-in-out infinite;}@keyframes scrollAnim{0%,100%{opacity:1}50%{opacity:0.2}}
        #about{background:var(--bg2);}
        .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:start;}
        .about-text .lead{font-size:1.1rem;color:var(--text);line-height:1.8;margin-bottom:1rem;}.about-text p{color:var(--text2);}
        .edu-card{padding:1.1rem 1.4rem;border:1px solid var(--border2);border-radius:var(--radius);margin-bottom:0.9rem;background:var(--surface);border-left:3px solid var(--accent);transition:all 0.3s;}.edu-card:hover{transform:translateX(4px);}
        .edu-year{color:var(--accent);font-size:0.68rem;margin-bottom:0.3rem;}.edu-title{font-family:var(--font-d);font-weight:600;font-size:0.93rem;color:var(--text);}.edu-place{font-size:0.8rem;color:var(--text2);margin-top:0.2rem;}
        #skills{background:var(--bg);}
        .skills-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.2rem;margin-bottom:3rem;}
        .skill-group{background:var(--surface);border:1px solid var(--border2);border-radius:var(--radius);padding:1.8rem 1.4rem;transition:all 0.3s;}.skill-group:hover{border-color:var(--border);transform:translateY(-4px);box-shadow:0 20px 60px rgba(0,0,0,0.3);}
        .skill-icon{font-size:1.4rem;color:var(--accent);margin-bottom:0.8rem;}.skill-group h3{font-size:0.9rem;margin-bottom:0.9rem;color:var(--text);}
        .skill-tags{display:flex;flex-wrap:wrap;gap:0.4rem;}.skill-tags span{padding:0.22rem 0.65rem;border-radius:100px;background:rgba(0,229,195,0.05);border:1px solid var(--border);font-size:0.7rem;color:var(--text2);font-family:var(--font-m);transition:all 0.2s;}.skill-tags span:hover{background:rgba(0,229,195,0.12);color:var(--accent);}
        .tech-marquee{overflow:hidden;mask-image:linear-gradient(90deg,transparent,black 10%,black 90%,transparent);border-top:1px solid var(--border2);border-bottom:1px solid var(--border2);padding:0.8rem 0;}
        .marquee-track{display:flex;gap:1.8rem;white-space:nowrap;animation:marquee 22s linear infinite;font-family:var(--font-m);font-size:0.78rem;color:var(--text3);}.marquee-track .sep{color:var(--accent);}
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        #experience{background:var(--bg2);}
        .timeline{padding-left:2rem;position:relative;}.timeline::before{content:'';position:absolute;left:0;top:0;bottom:0;width:1px;background:linear-gradient(to bottom,var(--accent),transparent);}
        .timeline-item{display:flex;margin-bottom:2.5rem;position:relative;}.tl-dot{position:absolute;left:-2.35rem;top:0.7rem;width:10px;height:10px;background:var(--accent);border-radius:50%;box-shadow:0 0 14px var(--accent);}
        .tl-card{background:var(--surface);border:1px solid var(--border2);border-radius:var(--radius);padding:1.8rem;width:100%;transition:all 0.3s;}.tl-card:hover{border-color:var(--border);transform:translateX(4px);}
        .tl-meta{display:flex;align-items:center;gap:0.8rem;margin-bottom:0.6rem;}.tl-date{color:var(--text3);}.tl-badge{padding:0.12rem 0.65rem;border-radius:100px;background:rgba(0,229,195,0.08);border:1px solid var(--border);font-size:0.67rem;color:var(--accent);font-family:var(--font-m);}
        .tl-role{font-size:1.08rem;font-weight:700;color:var(--text);margin-bottom:0.2rem;}.tl-company{font-size:0.8rem;color:var(--accent);font-family:var(--font-m);margin-bottom:0.9rem;}
        .tl-points{list-style:none;display:flex;flex-direction:column;gap:0.5rem;}.tl-points li{font-size:0.88rem;color:var(--text2);padding-left:1.2rem;position:relative;line-height:1.65;}.tl-points li::before{content:'→';position:absolute;left:0;color:var(--accent);font-size:0.72rem;top:3px;}
        #projects{background:var(--bg);}
        .projects-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.2rem;}
        .project-card{background:var(--surface);border:1px solid var(--border2);border-radius:var(--radius);padding:1.8rem;position:relative;overflow:hidden;transition:all 0.35s;cursor:pointer;}
        .project-card.featured{border-color:rgba(0,229,195,0.2);}.project-card:hover{border-color:var(--border);transform:translateY(-6px);box-shadow:0 30px 80px rgba(0,0,0,0.4);}
        .project-glow{position:absolute;top:-60px;right:-60px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(0,229,195,0.07) 0%,transparent 70%);opacity:0;transition:opacity 0.4s;pointer-events:none;}.project-card:hover .project-glow{opacity:1;}
        .project-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:0.8rem;}.project-num{color:var(--text3);}
        .proj-link{width:30px;height:30px;border:1px solid var(--border2);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:0.8rem;color:var(--text2);transition:all 0.3s;}.proj-link:hover{border-color:var(--accent);color:var(--accent);transform:rotate(-45deg);}
        .project-featured-label{display:inline-block;font-size:0.63rem;font-family:var(--font-m);color:var(--accent);border:1px solid var(--border);padding:0.18rem 0.55rem;border-radius:100px;margin-bottom:0.5rem;background:rgba(0,229,195,0.05);}
        .project-card h3{font-size:1.05rem;margin-bottom:0.6rem;color:var(--text);}.project-card p{font-size:0.86rem;color:var(--text2);line-height:1.7;margin-bottom:1rem;}
        .project-stack{display:flex;flex-wrap:wrap;gap:0.35rem;margin-bottom:0.8rem;}.project-stack span{font-size:0.66rem;font-family:var(--font-m);color:var(--accent);background:rgba(0,229,195,0.05);border:1px solid var(--border);padding:0.18rem 0.55rem;border-radius:4px;}
        .project-date{color:var(--text3);font-size:0.68rem;}
        #certifications{background:var(--bg2);}
        .cert-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.2rem;}
        .cert-card{background:var(--surface);border:1px solid var(--border2);border-radius:var(--radius);padding:2.2rem 1.8rem;transition:all 0.3s;position:relative;cursor:pointer;}.cert-card:hover{border-color:var(--accent);transform:translateY(-4px);box-shadow:0 15px 50px rgba(0,229,195,0.2);}
        .cert-icon{font-size:1.4rem;color:var(--accent);margin-bottom:0.9rem;}.cert-card h3{font-size:1rem;margin-bottom:0.5rem;color:var(--text);}.cert-card p{font-size:0.84rem;color:var(--text2);line-height:1.7;margin-bottom:0.9rem;}
        .cert-badge{display:inline-block;padding:0.18rem 0.65rem;background:rgba(0,229,195,0.07);border:1px solid var(--border);color:var(--accent);font-size:0.68rem;font-family:var(--font-m);border-radius:100px;}
        .resume-download-card{display:flex;align-items:center;gap:1.2rem;padding:1.4rem 1.5rem;border:1.5px solid rgba(124,58,237,0.3);border-radius:var(--radius);background:linear-gradient(135deg,rgba(124,58,237,0.07),rgba(0,229,195,0.03));transition:all 0.35s;color:var(--text);margin-top:1.5rem;}.resume-download-card:hover{border-color:var(--accent2);box-shadow:0 0 40px rgba(124,58,237,0.2);transform:translateY(-3px);}
        .rdc-icon{width:48px;height:48px;flex-shrink:0;background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.3);border-radius:12px;display:flex;align-items:center;justify-content:center;color:#a78bfa;}
        .rdc-text{flex:1;}.rdc-title{font-size:0.95rem;font-weight:600;color:var(--text);}.rdc-sub{color:var(--text3);font-size:0.7rem;margin-top:2px;}.rdc-arrow{font-size:1.3rem;color:var(--accent2);}
        #contact{background:var(--bg2);}
        .contact-wrap{display:grid;grid-template-columns:1fr 1.2fr;gap:5rem;align-items:start;}
        .contact-lead{font-size:1.05rem;color:var(--text);line-height:1.8;margin-bottom:2rem;}
        .contact-links{display:flex;flex-direction:column;gap:0.8rem;margin-bottom:2rem;}
        .contact-item{display:flex;align-items:center;gap:1rem;padding:0.8rem 1.1rem;border:1px solid var(--border2);border-radius:var(--radius);color:var(--text2);font-size:0.87rem;transition:all 0.3s;}.contact-item:hover{border-color:var(--border);color:var(--accent);transform:translateX(4px);}
        .contact-icon{width:30px;height:30px;background:rgba(0,229,195,0.07);border:1px solid var(--border);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:0.72rem;color:var(--accent);font-family:var(--font-m);flex-shrink:0;}
        .contact-form{display:flex;flex-direction:column;gap:1.1rem;}
        .form-group{display:flex;flex-direction:column;gap:0.35rem;}.form-group label{font-size:0.72rem;color:var(--text3);font-family:var(--font-m);letter-spacing:0.08em;text-transform:uppercase;}
        .form-group input,.form-group textarea{background:var(--surface);border:1px solid var(--border2);border-radius:var(--radius);padding:0.8rem 1rem;color:var(--text);font-family:var(--font-b);font-size:0.88rem;outline:none;transition:border-color 0.3s;resize:vertical;}
        .form-group input:focus,.form-group textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,229,195,0.07);}
        .form-group input::placeholder,.form-group textarea::placeholder{color:var(--text3);}
        .form-msg-box{padding:0.75rem 1rem;border-radius:8px;font-size:0.82rem;font-family:var(--font-m);text-align:center;}
        .form-msg-box.success{background:rgba(0,229,195,0.07);border:1px solid var(--border);color:var(--accent);}
        .form-msg-box.error{background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.25);color:#fca5a5;}
        footer{background:var(--bg2);border-top:1px solid var(--border2);padding:2.2rem 0;}
        .footer-inner{display:flex;align-items:center;justify-content:space-between;}.footer-logo{font-family:var(--font-d);font-weight:800;font-size:1.2rem;}.footer-copy{color:var(--text3);font-size:0.68rem;}.back-to-top{font-family:var(--font-m);font-size:0.72rem;color:var(--text3);transition:color 0.25s;}.back-to-top:hover{color:var(--accent);}
        @media(max-width:960px){.nav-links{display:none;}.hero-content{flex-direction:column;gap:2.5rem;padding-top:110px;}.hero-left{flex-direction:column;align-items:center;text-align:center;}.hero-right{width:100%;}.hero-cta,.hero-socials{justify-content:center;}.about-grid,.contact-wrap{grid-template-columns:1fr;gap:3rem;}.skills-grid{grid-template-columns:repeat(2,1fr);}.projects-grid,.cert-grid{grid-template-columns:1fr;}#navbar{padding:1rem 1.5rem;}}
        @media(max-width:600px){section{padding:80px 0;}.container{padding:0 1.2rem;}.skills-grid{grid-template-columns:1fr;}.footer-inner{flex-direction:column;gap:0.8rem;text-align:center;}.hero-name{font-size:clamp(2.8rem,14vw,4.5rem);}}
      `}</style>

      <nav id="navbar" className={navScrolled ? 'scrolled' : ''}>
        <div className="nav-logo">AF<span className="dot">.</span></div>
        <ul className="nav-links">
          {['about','skills','experience','projects','contact'].map(s=>(
            <li key={s}><a href={`#${s}`}>{s.charAt(0).toUpperCase()+s.slice(1)}</a></li>
          ))}
        </ul>
      </nav>

      <section id="hero">
        <canvas ref={canvasRef} id="bgCanvas"/>
        <div className="aurora-wrap"><div className="aurora a1"/><div className="aurora a2"/><div className="aurora a3"/></div>
        <div className="hero-grid-lines"/>
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-text">
              <h1 className="hero-name reveal"><span className="solid-text">Amara</span><br/><span className="outline-text">Firdous</span></h1>
              <p className="hero-role reveal"><span>{typed}</span><span className="cursor-blink">|</span></p>
              <div className="hero-cta reveal">
                <a href="#projects" className="btn-primary">View Work</a>
                <a href="#contact" className="btn-ghost">Get In Touch</a>
                <a href="/api/resume" className="btn-resume">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Resume
                </a>
              </div>
              <div className="hero-socials reveal">
                <a href="mailto:amara262006@gmail.com">✉</a>
                <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">in</a>
                <a href={GITHUB} target="_blank" rel="noopener noreferrer">⌥</a>
              </div>
            </div>
          </div>
          <div className="hero-right reveal">
            <div className="hero-card">
              <div className="hc-row"><span className="hc-label">Role</span><span className="hc-val">CS Student</span></div>
              <div className="hc-row"><span className="hc-label">University</span><span className="hc-val">IGDTUW</span></div>
              <div className="hc-row"><span className="hc-label">Location</span><span className="hc-val">New Delhi, India</span></div>
              <div className="hc-divider"/>
              <div className="hc-stats">
                <div className="hcs"><span className="hcs-n">3+</span><span className="hcs-l">Internships</span></div>
                <div className="hcs"><span className="hcs-n">5+</span><span className="hcs-l">Projects</span></div>
                <div className="hcs"><span className="hcs-n">2+</span><span className="hcs-l">Yrs Coding</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll"><span className="mono">scroll</span><div className="scroll-line"/></div>
      </section>

      <section id="about">
        <div className="container">
          <div className="section-header reveal"><span className="section-num mono">01</span><h2>About Me</h2></div>
          <div className="about-grid">
            <div className="about-text reveal">
              <p className="lead">CS Engineering student at <strong>IGDTUW</strong> with a strong interest in building clean and impactful software. I enjoy developing AI-powered tools and full-stack web applications.</p>
              <p>Currently pursuing my B.Tech in Computer Science, with hands-on internship experience in Generative AI, software engineering, and web development. Skilled in Python, Java, and modern web technologies.</p>
            </div>
            <div className="about-edu reveal">
              <h3 style={{fontFamily:'var(--font-m)',fontSize:'0.72rem',color:'var(--text2)',letterSpacing:'0.12em',textTransform:'uppercase' as const,marginBottom:'1.2rem',fontWeight:400}}>Education</h3>
              {[{year:'2024 – 2027',title:'B.Tech — Computer Science & Engineering',place:'Indira Gandhi Delhi Technical University for Women'},{year:'2021 – 2024',title:'Diploma in Computer Engineering',place:'Jamia Millia Islamia'},{year:'2020 – 2021',title:'Secondary Education',place:'Dini International School'}].map(e=>(
                <div className="edu-card" key={e.year}><div className="edu-year mono">{e.year}</div><div className="edu-title">{e.title}</div><div className="edu-place">{e.place}</div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="skills">
        <div className="container">
          <div className="section-header reveal"><span className="section-num mono">02</span><h2>Skills</h2></div>
          <div className="skills-grid">
            {[{icon:'⟨/⟩',title:'Programming Languages',tags:['Python','Java','C++','C']},{icon:'◈',title:'Web Technologies',tags:['HTML','CSS','Bootstrap','JavaScript','SQL','PHP']},{icon:'⊞',title:'CS Fundamentals',tags:['DSA','DBMS','OS','OOPs']},{icon:'◎',title:'Soft Skills',tags:['Communication','Team Collaboration','Problem-Solving']}].map(g=>(
              <div className="skill-group reveal" key={g.title}><div className="skill-icon">{g.icon}</div><h3>{g.title}</h3><div className="skill-tags">{g.tags.map(t=><span key={t}>{t}</span>)}</div></div>
            ))}
          </div>
          <div className="tech-marquee"><div className="marquee-track">
            {['Python','·','Java','·','C++','·','JavaScript','·','PHP','·','MySQL','·','HTML5','·','CSS3','·','Bootstrap','·','Streamlit','·','Gemini API','·','Git','·','FPDF','·','Python','·','Java','·','C++','·','JavaScript','·','PHP','·','MySQL','·','HTML5','·','CSS3','·','Bootstrap','·','Streamlit','·','Gemini API','·','Git','·','FPDF','·'].map((t,i)=>(
              <span key={i} className={t==='·'?'sep':''}>{t}</span>
            ))}
          </div></div>
        </div>
      </section>

      <section id="experience">
        <div className="container">
          <div className="section-header reveal"><span className="section-num mono">03</span><h2>Experience</h2></div>
          <div className="timeline">
            {[{date:'Jun – Jul 2025',badge:'AI / GenAI',role:'Generative AI & Prompt Engineering Intern',company:'IGDTUW',points:['Engineered an AI-powered Resume Builder using Streamlit and Gemini API to generate ATS-optimized resumes — handling backend logic, prompt engineering, API integration & fallback mechanisms.','Integrated customizable templates, font & color controls, live preview, LinkedIn/GitHub imports, and PDF/TXT export using FPDF.']},{date:'Jun – Jul 2024',badge:'SWE',role:'Software Engineering Intern',company:'Indraprastha Institute of Information Sciences',points:['Designed and structured a Library Management System to manage book inventories, user records, and issue-return workflows.','Optimized backend logic and database operations for data consistency, storage efficiency, and retrieval performance.']},{date:'Jun – Jul 2023',badge:'Frontend',role:'Web Developer Intern',company:'JMI / FTK-CIT W',points:['Crafted responsive frontend interfaces using HTML, CSS & Bootstrap with cross-browser compatibility.','Built dropdown menus and mobile-friendly layouts optimized for multiple devices.']}].map(item=>(
              <div className="timeline-item reveal" key={item.role}><div className="tl-dot"/>
                <div className="tl-card">
                  <div className="tl-meta"><span className="tl-date mono">{item.date}</span><span className="tl-badge">{item.badge}</span></div>
                  <h3 className="tl-role">{item.role}</h3><div className="tl-company">{item.company}</div>
                  <ul className="tl-points">{item.points.map(p=><li key={p}>{p}</li>)}</ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects">
        <div className="container">
          <div className="section-header reveal"><span className="section-num mono">04</span><h2>Projects</h2></div>
          <div className="projects-grid">
            {[{num:'01',link:PROJECTS.resume,featured:true,title:'AI-Powered Resume Builder',desc:'ATS-optimized resume generator using Streamlit & Gemini API with live preview, customizable templates, and PDF/TXT export.',stack:['Python','Streamlit','Gemini API','FPDF'],date:'2025'},{num:'02',link:PROJECTS.aadhaar,featured:false,title:'Aadhaar Data Verification System',desc:'Secure portal with OTP-based authentication, responsive UI, verification logs, and real-time status display.',stack:['HTML','CSS','JavaScript','PHP','MySQL'],date:'Jan – Mar 2026'},{num:'03',link:PROJECTS.recruitment,featured:false,title:'Online Recruitment Management System',desc:'Database-driven system with job postings, candidate data management, and role-based admin access.',stack:['HTML','CSS','JavaScript','PHP'],date:'Jan – Apr 2024'},{num:'04',link:PROJECTS.library,featured:false,title:'Library Management System',desc:'Efficient inventory and user management system with optimized database operations.',stack:['Java','MySQL','JDBC'],date:'2024'}].map(p=>(
              <div className={`project-card reveal${p.featured?' featured':''}`} key={p.num}>
                <div className="project-glow"/>
                <div className="project-top"><span className="project-num mono">{p.num}</span><a href={p.link} className="proj-link" target="_blank" rel="noopener noreferrer">↗</a></div>
                {p.featured&&<span className="project-featured-label">Featured</span>}
                <h3>{p.title}</h3><p>{p.desc}</p>
                <div className="project-stack">{p.stack.map(s=><span key={s}>{s}</span>)}</div>
                <div className="project-date mono">{p.date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="certifications">
        <div className="container">
          <div className="section-header reveal"><span className="section-num mono">05</span><h2>Certifications</h2></div>
          <div className="cert-grid">
            <a href="https://drive.google.com/file/d/1CCNW5laogkGwG2VwZY9PIOVGVIiCJcFD/view?usp=sharing" target="_blank" rel="noopener noreferrer" style={{textDecoration:'none',color:'inherit'}}>
              <div className="cert-card reveal"><div className="cert-icon">◈</div><h3>Fundamentals of Java Full Stack</h3><p>Core Java, JDBC, Servlets, JSP, MySQL, HTML, CSS, Bootstrap for full-stack development.</p><div className="cert-badge">Full Stack</div><div style={{position:'absolute',bottom:'1.2rem',right:'1.2rem',fontSize:'1.3rem',color:'var(--accent)'}}>↗</div></div>
            </a>
            <a href="https://drive.google.com/file/d/1_0Zbd4Y8_Tw2HfpTUAh8ReAUJ14BZOfj/view?usp=sharing" target="_blank" rel="noopener noreferrer" style={{textDecoration:'none',color:'inherit'}}>
              <div className="cert-card reveal"><div className="cert-icon">◎</div><h3>Foundation Course on Generative AI</h3><p>Generative AI fundamentals, prompt engineering, AI ethics, and enterprise applications using Microsoft technologies.</p><div className="cert-badge">AI / ML</div><div style={{position:'absolute',bottom:'1.2rem',right:'1.2rem',fontSize:'1.3rem',color:'var(--accent)'}}>↗</div></div>
            </a>
          </div>
          <a href="/api/resume" className="resume-download-card">
            <div className="rdc-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg></div>
            <div className="rdc-text"><div className="rdc-title">Download My Resume</div><div className="rdc-sub mono">amara_firdous_resume.pdf</div></div>
            <div className="rdc-arrow">↓</div>
          </a>
        </div>
      </section>

      <section id="contact">
        <div className="container">
          <div className="section-header reveal"><span className="section-num mono">06</span><h2>Let&apos;s Connect</h2></div>
          <div className="contact-wrap reveal">
            <div className="contact-left">
              <p className="contact-lead">Open to internships, collaborations, and exciting projects. Let&apos;s build something together.</p>
              <div className="contact-links">
                <a href="mailto:amara262006@gmail.com" className="contact-item"><span className="contact-icon">✉</span><span>amara262006@gmail.com</span></a>
                <a href="tel:+916202545085" className="contact-item"><span className="contact-icon">☏</span><span>+91 6202545085</span></a>
                <a href={LINKEDIN} className="contact-item" target="_blank" rel="noopener noreferrer"><span className="contact-icon">in</span><span>LinkedIn</span></a>
                <a href={GITHUB} className="contact-item" target="_blank" rel="noopener noreferrer"><span className="contact-icon">⌥</span><span>GitHub</span></a>
              </div>
            </div>
            <div className="contact-right">
              <form className="contact-form" onSubmit={handleContact}>
                <div className="form-group"><label>Name</label><input type="text" placeholder="Your name" value={formState.name} onChange={e=>setFormState({...formState,name:e.target.value})} required/></div>
                <div className="form-group"><label>Email</label><input type="email" placeholder="your@email.com" value={formState.email} onChange={e=>setFormState({...formState,email:e.target.value})} required/></div>
                <div className="form-group"><label>Message</label><textarea rows={4} placeholder="Write your message here..." value={formState.message} onChange={e=>setFormState({...formState,message:e.target.value})} required/></div>
                <button type="submit" className="btn-primary full" disabled={sending}>{sending?'Sending...':'Send Message ↗'}</button>
                {formMsg&&<div className={`form-msg-box ${formMsg.type}`}>{formMsg.text}</div>}
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="footer-inner">
            <div className="footer-logo">AF<span className="dot">.</span></div>
            <p className="mono footer-copy">Designed & Built by Amara Firdous © {new Date().getFullYear()}</p>
            <a href="#hero" className="back-to-top">↑ Top</a>
          </div>
        </div>
      </footer>
    </>
  );
}
