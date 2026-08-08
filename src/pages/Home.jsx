import { useState, useRef } from 'react';
import Silk from '../components/Silk.jsx';
import { SPLITFORMS_ENDPOINT, SPLITFORMS_ACCESS_KEY } from '../config.js';

const initialForm = {
  name: '',
  school: '',
  grade: '',
  phone: '',
  email: '',
  experience: '',
};

export default function Home() {
  const [form, setForm] = useState(initialForm);
  const [resumeFile, setResumeFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | submitting | done | error
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFile = (file) => {
    if (file) setResumeFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const data = new FormData();
      data.append('access_key', SPLITFORMS_ACCESS_KEY);
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (resumeFile) data.append('resume', resumeFile);

      const res = await fetch(SPLITFORMS_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      const result = await res.json().catch(() => ({}));

      if (res.ok && result.success) {
        setStatus('done');
        setForm(initialForm);
        setResumeFile(null);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      {/* ───── HERO ───── */}
      <section className="hero" id="home">
        <div className="hero-bg">
          <Silk color="#2a1800" speed={8} scale={1.4} noiseIntensity={1.8} rotation={0.15} />
        </div>
        <div className="hero-overlay" />

        {/* Navbar */}
        <nav className="hero-nav">
          <div className="hero-nav-logo">
            <img
              src="/varsity-sports/emblem.jpg"
              alt="Varsity Sports"
              className="nav-logo-img"
              style={{ mixBlendMode: 'multiply', background: 'transparent' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <span className="nav-brand">Varsity Sports</span>
          </div>
          <div className="hero-nav-right">
            <span className="nav-tag">Volunteer Recruitment</span>
            <a href="#apply" className="btn btn-sm">Apply Now</a>
          </div>
        </nav>

        {/* Two-column editorial body */}
        <div className="hero-body">
          {/* Left */}
          <div className="hero-text">
            <p className="hero-eyebrow">Varsity Sports Presents</p>
            <h1 className="hero-headline">
              The Biggest<br />
              <em>Basketball</em><br />
              Season.
            </h1>
            <p className="hero-sub">
              We're recruiting dedicated season-long Varsity Members.
              Earn a first-tier college app activity, recommendation letters, and a certificate.
            </p>
            <div className="hero-ctas">
              <a href="#apply" className="btn btn-primary">Apply Now →</a>
              <a href="#about" className="btn btn-ghost">Learn More →</a>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <span className="stat-num">01</span>
                <span className="stat-label">Season-Long</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-num">∞</span>
                <span className="stat-label">Opportunities</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-num">100%</span>
                <span className="stat-label">Exclusive</span>
              </div>
            </div>
          </div>

          {/* Right — emblem crest */}
          <div className="hero-visual">
            <div className="hero-crest-glow" />
            <div className="hero-crest-wrap">
              <img
                src="/varsity-sports/emblem.jpg"
                alt="Varsity Sports crest"
                className="hero-crest-img"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <span>Scroll to enter</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ───── ABOUT STRIP ───── */}
      <section id="about" className="about-strip">
        <div className="about-inner">
          <p className="about-eyebrow">Why Varsity Sports?</p>
          <div className="about-grid">
            <div className="about-card">
              <span className="about-icon">🏆</span>
              <h3>College App Edge</h3>
              <p>A first-tier, verifiable extracurricular that stands out on any application.</p>
            </div>
            <div className="about-card">
              <span className="about-icon">📜</span>
              <h3>Recommendation Letters</h3>
              <p>Earn a personalised letter from our leadership team at season end.</p>
            </div>
            <div className="about-card">
              <span className="about-icon">🎓</span>
              <h3>Official Certificate</h3>
              <p>A verified Varsity Sports Volunteer certificate issued after the season.</p>
            </div>
            <div className="about-card">
              <span className="about-icon">🤝</span>
              <h3>Real Experience</h3>
              <p>Work inside the biggest basketball season in India — hands-on, season-long.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── APPLICATION FORM ───── */}
      <section id="apply" className="apply-section">
        <div className="apply-inner">
          {/* Left: headline */}
          <div className="apply-headline-col">
            <p className="apply-eyebrow">Join the Team</p>
            <h2 className="apply-headline">Apply as a<br /><em>Varsity Volunteer</em></h2>
            <p className="apply-desc">
              Fill in your details — it only takes a couple of minutes. We review every application personally.
            </p>
            <div className="apply-perks">
              <div className="perk-item">✓ No experience required</div>
              <div className="perk-item">✓ Full season support</div>
              <div className="perk-item">✓ Certificate + letter</div>
            </div>
          </div>

          {/* Right: form */}
          <div className="apply-form-col">
            {status === 'done' ? (
              <div className="thankyou-card">
                <div className="thankyou-icon">✓</div>
                <h3>We got it!</h3>
                <p>Thanks for applying — we'll review your details and get back to you soon.</p>
                <button className="btn btn-ghost" onClick={() => setStatus('idle')} style={{marginTop:'1rem'}}>
                  Apply Again
                </button>
              </div>
            ) : (
              <form
                className="apply-form"
                method="POST"
                action={SPLITFORMS_ENDPOINT}
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="access_key" value={SPLITFORMS_ACCESS_KEY} />
                <input type="checkbox" name="botcheck" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                <div className="form-row">
                  <div className="field">
                    <label htmlFor="name">Full Name</label>
                    <input id="name" name="name" type="text" required placeholder="Your full name" value={form.name} onChange={update('name')} />
                  </div>
                  <div className="field">
                    <label htmlFor="school">School</label>
                    <input id="school" name="school" type="text" required placeholder="School / College name" value={form.school} onChange={update('school')} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="field">
                    <label htmlFor="grade">Grade / Year</label>
                    <input id="grade" name="grade" type="text" required placeholder="e.g. 11th grade" value={form.grade} onChange={update('grade')} />
                  </div>
                  <div className="field">
                    <label htmlFor="phone">Phone No.</label>
                    <input id="phone" name="phone" type="tel" required placeholder="+91 98765 43210" value={form.phone} onChange={update('phone')} />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="email">Email Address</label>
                  <input id="email" name="email" type="email" required placeholder="you@email.com" value={form.email} onChange={update('email')} />
                </div>

                {/* Custom file upload */}
                <div className="field">
                  <label>Resume / CV</label>
                  <div
                    className={`file-upload-zone ${dragOver ? 'drag-over' : ''} ${resumeFile ? 'has-file' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      id="resume"
                      name="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      required
                      style={{ display: 'none' }}
                      onChange={(e) => handleFile(e.target.files?.[0])}
                    />
                    {resumeFile ? (
                      <>
                        <div className="file-upload-icon file-upload-icon--done">✓</div>
                        <p className="file-upload-name">{resumeFile.name}</p>
                        <p className="file-upload-hint">Click to replace</p>
                      </>
                    ) : (
                      <>
                        <div className="file-upload-icon">↑</div>
                        <p className="file-upload-label">Drag &amp; drop your resume here</p>
                        <p className="file-upload-hint">or click to browse — PDF, DOC, DOCX</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="experience">Past Experience in Organizing</label>
                  <textarea
                    id="experience"
                    name="experience"
                    required
                    value={form.experience}
                    onChange={update('experience')}
                    placeholder="Tell us about any events, clubs, or sports teams you've helped organize..."
                  />
                </div>

                {status === 'error' && (
                  <p className="error-text">Something went wrong — please try again.</p>
                )}

                <div className="submit-row">
                  <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
                    {status === 'submitting' ? 'Submitting…' : 'Submit Application →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <img
              src="/varsity-sports/emblem.jpg"
              alt="Varsity Sports"
              className="footer-logo"
              style={{ mixBlendMode: 'multiply' }}
            />
            <div>
              <p className="footer-brand-name">Varsity Sports</p>
              <p className="footer-brand-sub">Changing Sports in India</p>
            </div>
          </div>
          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#apply">Apply</a>
          </div>
          <div className="footer-contact">
            <p className="footer-contact-label">Reach Us</p>
            <a href="mailto:meghanadh.pamidi@gmail.com">meghanadh.pamidi@gmail.com</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Varsity Sports. All rights reserved.</p>
          <p className="powered-by">
            Powered by{' '}
            <a href="https://telugu.social" target="_blank" rel="noopener noreferrer">
              telugu.social
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
