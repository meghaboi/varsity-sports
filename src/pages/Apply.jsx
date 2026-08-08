import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SPLITFORMS_ENDPOINT, SPLITFORMS_ACCESS_KEY } from '../config.js';

const initialForm = {
  name: '',
  school: '',
  grade: '',
  phone: '',
  email: '',
  experience: ''
};

export default function Apply() {
  const [form, setForm] = useState(initialForm);
  const [resumeFile, setResumeFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | submitting | done | error

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const data = new FormData();
      data.append('access_key', SPLITFORMS_ACCESS_KEY);
      data.append('name', form.name);
      data.append('school', form.school);
      data.append('grade', form.grade);
      data.append('phone', form.phone);
      data.append('email', form.email);
      data.append('experience', form.experience);
      if (resumeFile) data.append('resume', resumeFile);

      const res = await fetch(SPLITFORMS_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data
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
    <div className="apply-page">
      <div className="apply-header">
        <Link to="/" className="back-link">&larr; Back</Link>
        <h1>Volunteer Application</h1>
        <p>Fill in your details below — it only takes a couple of minutes.</p>
      </div>

      {status === 'done' && (
        <div className="thankyou-bar">
          Thanks, we got it! We've received your details and will get back to you soon.
        </div>
      )}

      {status !== 'done' && (
        <form className="apply-form" method="POST" action={SPLITFORMS_ENDPOINT} onSubmit={handleSubmit}>
          <input type="hidden" name="access_key" value={SPLITFORMS_ACCESS_KEY} />
          <input type="checkbox" name="botcheck" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" required value={form.name} onChange={update('name')} />
          </div>

          <div className="field">
            <label htmlFor="school">School</label>
            <input id="school" name="school" type="text" required value={form.school} onChange={update('school')} />
          </div>

          <div className="field">
            <label htmlFor="grade">Grade</label>
            <input id="grade" name="grade" type="text" required value={form.grade} onChange={update('grade')} />
          </div>

          <div className="field">
            <label htmlFor="resume">Resume / CV</label>
            <input
              id="resume"
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              required
              onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="field">
            <label htmlFor="phone">Phone No.</label>
            <input id="phone" name="phone" type="tel" required value={form.phone} onChange={update('phone')} />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required value={form.email} onChange={update('email')} />
          </div>

          <div className="field">
            <label htmlFor="experience">Past experience in organizing</label>
            <textarea
              id="experience"
              name="experience"
              required
              value={form.experience}
              onChange={update('experience')}
              placeholder="Tell us about any events, clubs, or teams you've helped organize"
            />
          </div>

          {status === 'error' && (
            <p className="error-text">Something went wrong sending your application — please try again.</p>
          )}

          <div className="submit-row">
            <button type="submit" className="btn" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Submitting…' : 'Submit Application'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

