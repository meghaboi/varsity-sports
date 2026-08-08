import { useState } from 'react';
import Silk from '../components/Silk.jsx';
import Basketball from '../components/Basketball.jsx';
import { SPLITFORMS_ENDPOINT, SPLITFORMS_ACCESS_KEY } from '../config.js';
import logoImg from '../assets/logo.jpeg';

const initialForm = {
  name: '',
  school: '',
  grade: '',
  phone: '',
  email: '',
  resume_link: '',
  experience: '',
};

const universities = [
  { name: 'Stanford University', domain: 'stanford.edu', short: 'Stanford' },
  { name: 'University of California, Berkeley', domain: 'berkeley.edu', short: 'UC Berkeley' },
  { name: 'University of California, Los Angeles', domain: 'ucla.edu', short: 'UCLA' },
  { name: 'University of Southern California', domain: 'usc.edu', short: 'USC' },
  { name: 'University of California, San Diego', domain: 'ucsd.edu', short: 'UC San Diego' },
  { name: 'University of British Columbia', domain: 'ubc.ca', short: 'UBC' },
  { name: 'New York University', domain: 'nyu.edu', short: 'NYU' },
  { name: 'Purdue University', domain: 'purdue.edu', short: 'Purdue' },
  { name: 'University of Bath', domain: 'bath.ac.uk', short: 'Bath' },
  { name: 'Indiana University Bloomington', domain: 'iu.edu', short: 'Indiana' },
];

const pressStories = [
  {
    source: 'The Hans India',
    date: '02 Aug 2025',
    title: 'Hyderabad Black Hawks to launch school volleyball league with Varsity Sports',
    copy: 'A five-week competition bringing professional league standards, school spirit, and a new stage to young athletes across Hyderabad.',
    href: 'https://www.thehansindia.com/sports/hyderabad-black-hawks-to-launch-school-volleyball-league-with-varsity-sports-993281',
  },
  {
    source: 'Telangana Today',
    date: '17 Aug 2025',
    title: 'Hyderabad Varsity Volleyball League qualifiers set for league stage',
    copy: 'More than 50 IB and CBSE school teams entered the competition, representing a student community of over 85,000.',
    href: 'https://telanganatoday.com/hyderabad-varsity-volleyball-league-qualifiers-set-for-league-stage',
  },
  {
    source: 'The New Indian Express',
    date: '09 Jul 2024',
    title: 'Varsity Sports is revolutionising high school athletics in Hyderabad',
    copy: 'A look at how student-led sports programming is building professional competition and stronger school communities.',
    href: 'https://www.newindianexpress.com/cities/hyderabad/2024/Jul/09/varsity-sports-revolutionising-high-school-athletics-in-hyderabad',
  },
];

const Arrow = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 6l4 4-4 4" /></svg>
);

export default function Home() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const scrollToSection = (id) => (event) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('submitting');
    try {
      const response = await fetch(SPLITFORMS_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(event.currentTarget),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error('Submission failed');
      setStatus('done');
      setForm(initialForm);
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <header className="hero" id="home">
        <div className="hero-bg"><Silk color="#251701" speed={7} scale={1.25} noiseIntensity={1.35} rotation={0.1} /></div>
        <div className="hero-overlay" />
        <nav className="site-nav" aria-label="Main navigation">
          <a className="brand" href="#home" onClick={scrollToSection('home')}>
            <img src={logoImg} alt="" />
            <span>Varsity Sports</span>
          </a>
          <div className="nav-links">
            <a href="#about" onClick={scrollToSection('about')}>About</a>
            <a href="#outcomes" onClick={scrollToSection('outcomes')}>Outcomes</a>
            <a href="#press" onClick={scrollToSection('press')}>Press</a>
          </div>
          <a href="#apply" onClick={scrollToSection('apply')} className="btn btn-primary btn-small">Join now <Arrow /></a>
        </nav>

        <div className="hero-body">
          <div className="hero-copy">
            <p className="eyebrow">Hyderabad's student sports community</p>
            <h1>Build the season.<br /><em>Shape your future.</em></h1>
            <p className="hero-lede">Join the team creating India's most ambitious school sports experiences. Lead real events, build lasting skills, and become part of a community that opens doors.</p>
            <div className="hero-actions">
              <a href="#apply" onClick={scrollToSection('apply')} className="btn btn-primary">Join Varsity <Arrow /></a>
              <a href="#about" onClick={scrollToSection('about')} className="text-link">Explore the experience <Arrow /></a>
            </div>
            <dl className="hero-stats">
              <div><dt>50+</dt><dd>School teams</dd></div>
              <div><dt>85K+</dt><dd>Students represented</dd></div>
              <div><dt>3</dt><dd>Countries reached</dd></div>
            </dl>
          </div>
          <div className="hero-art"><Basketball /></div>
        </div>
        <a className="scroll-cue" href="#about" onClick={scrollToSection('about')} aria-label="Scroll to learn more"><span>Scroll</span><i /></a>
      </header>

      <main>
        <section className="about-section" id="about">
          <div className="section-shell">
            <div className="section-intro">
              <p className="eyebrow">More than a position</p>
              <h2>Own a piece of the game.</h2>
              <p>Varsity members work at the centre of live school sport. You will take on meaningful responsibility, learn from a driven team, and build proof of what you can do.</p>
            </div>
            <div className="benefit-grid">
              <article><span>01</span><h3>Lead real events</h3><p>Work across operations, media, partnerships, and the matchday experience.</p></article>
              <article><span>02</span><h3>Build your profile</h3><p>Turn your contribution into a credible, verifiable activity for university applications.</p></article>
              <article><span>03</span><h3>Earn recognition</h3><p>Complete the season with an official certificate and a personalised recommendation.</p></article>
              <article><span>04</span><h3>Find your people</h3><p>Join ambitious students who care about sport, leadership, and creating something bigger.</p></article>
            </div>
          </div>
        </section>

        <section className="outcomes-section" id="outcomes">
          <div className="section-shell">
            <div className="outcomes-heading">
              <div>
                <p className="eyebrow">Member outcomes</p>
                <h2>Universities our Varsity members have been accepted into</h2>
              </div>
              <div className="outcomes-copy">
                <p className="country-line">United States <span>•</span> United Kingdom <span>•</span> Canada</p>
                <p>Our Varsity members have earned admission to some of the most prestigious universities across the United States, United Kingdom, and Canada.</p>
              </div>
            </div>
            <div className="university-grid">
              {universities.map((university) => (
                <article className="university-card" key={university.name} title={university.name}>
                  <div className="university-logo">
                    <img
                      src={`https://www.google.com/s2/favicons?domain_url=https://${university.domain}&sz=128`}
                      alt={`${university.name} logo`}
                      loading="lazy"
                    />
                  </div>
                  <h3>{university.short}</h3>
                  <p>{university.name}</p>
                </article>
              ))}
            </div>
            <div className="outcomes-cta">
              <p>Join Varsity. Become a member. Shape your future.</p>
              <a href="#apply" onClick={scrollToSection('apply')} className="btn btn-light">Start your application <Arrow /></a>
            </div>
          </div>
        </section>

        <section className="press-section" id="press">
          <div className="section-shell">
            <div className="press-heading">
              <div><p className="eyebrow">In the press</p><h2>The movement is making headlines.</h2></div>
              <p>Varsity Sports is putting school athletes under the lights and changing how Hyderabad experiences youth sport.</p>
            </div>
            <div className="press-grid">
              {pressStories.map((story, index) => (
                <a className={`press-card ${index === 0 ? 'featured' : ''}`} href={story.href} target="_blank" rel="noreferrer" key={story.href}>
                  <div className="press-meta"><span>{story.source}</span><time>{story.date}</time></div>
                  <h3>{story.title}</h3>
                  <p>{story.copy}</p>
                  <span className="card-link">Read the story <Arrow /></span>
                </a>
              ))}
              <a className="video-card" href="https://www.youtube.com/watch?v=NuQ1UyCKOJI" target="_blank" rel="noreferrer">
                <img src="https://img.youtube.com/vi/NuQ1UyCKOJI/maxresdefault.jpg" alt="Varsity Sports event highlights" loading="lazy" />
                <span className="play-button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l9 6-9 6z" /></svg></span>
                <div><p>Watch Varsity</p><h3>See the energy for yourself</h3></div>
              </a>
            </div>
          </div>
        </section>

        <section className="apply-section" id="apply">
          <div className="section-shell apply-layout">
            <div className="apply-copy">
              <p className="eyebrow">Membership applications</p>
              <h2>Become a<br /><em>Varsity member.</em></h2>
              <p>Tell us who you are and what you want to bring to the season. Every application is reviewed by our team.</p>
              <ul><li>No prior event experience required</li><li>Full season support and mentorship</li><li>Certificate and recommendation letter</li></ul>
              <a className="instagram-link" href="https://www.instagram.com/varsitysports.hyd/?hl=en" target="_blank" rel="noreferrer">Follow @varsitysports.hyd <Arrow /></a>
            </div>
            <div className="form-wrap">
              {status === 'done' ? (
                <div className="success-card"><span>✓</span><p className="eyebrow">Application received</p><h3>Welcome to the next play.</h3><p>Thank you for applying. Our team will review your details and get back to you soon.</p><button className="text-link" onClick={() => setStatus('idle')}>Submit another application <Arrow /></button></div>
              ) : (
                <form className="apply-form" method="POST" action={SPLITFORMS_ENDPOINT} encType="multipart/form-data" onSubmit={handleSubmit}>
                  <input type="hidden" name="access_key" value={SPLITFORMS_ACCESS_KEY} />
                  <input type="checkbox" name="botcheck" className="botcheck" tabIndex={-1} autoComplete="off" />
                  <div className="form-row">
                    <label><span>Full name</span><input name="name" required placeholder="Your full name" value={form.name} onChange={update('name')} /></label>
                    <label><span>School or college</span><input name="school" required placeholder="Institution name" value={form.school} onChange={update('school')} /></label>
                  </div>
                  <div className="form-row">
                    <label><span>Grade or year</span><input name="grade" required placeholder="For example, Grade 11" value={form.grade} onChange={update('grade')} /></label>
                    <label><span>Phone number</span><input name="phone" type="tel" required placeholder="+91 98765 43210" value={form.phone} onChange={update('phone')} /></label>
                  </div>
                  <label><span>Email address</span><input name="email" type="email" required placeholder="you@example.com" value={form.email} onChange={update('email')} /></label>
                  <label><span>Resume or portfolio link</span><input name="resume_link" type="url" required placeholder="A public Drive, portfolio, or profile link" value={form.resume_link} onChange={update('resume_link')} /></label>
                  <label><span>What would you bring to Varsity?</span><textarea name="experience" required placeholder="Tell us about your interests, skills, projects, clubs, or sports experience." value={form.experience} onChange={update('experience')} /></label>
                  {status === 'error' && <p className="form-error">We could not send your application. Please check your connection and try again.</p>}
                  <button type="submit" className="btn btn-primary submit-button" disabled={status === 'submitting'}>{status === 'submitting' ? 'Sending application...' : <>Submit application <Arrow /></>}</button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-shell footer-row">
          <a className="brand" href="#home" onClick={scrollToSection('home')}><img src={logoImg} alt="" /><span>Varsity Sports</span></a>
          <p>Changing sports in India.</p>
          <div><a href="#outcomes" onClick={scrollToSection('outcomes')}>Member outcomes</a><a href="#press" onClick={scrollToSection('press')}>Press</a><a href="#apply" onClick={scrollToSection('apply')}>Become a member</a></div>
        </div>
        <div className="section-shell footer-bottom"><p>© 2026 Varsity Sports. All rights reserved.</p><p>Hyderabad, India</p></div>
      </footer>
    </>
  );
}
