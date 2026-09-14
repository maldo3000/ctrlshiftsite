import React, { FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, LoaderCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FluidBackground from '../../components/FluidBackground';

const INTEREST_OPTIONS = [
  'Events',
  'Community',
  'Content & social',
  'Design',
  'Photo & video',
  'Partnerships',
  'Operations',
  'Other'
];

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const inputClassName =
  'w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3.5 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-400 focus:bg-white/[0.09] focus:ring-2 focus:ring-purple-500/20';

function VolunteerPage() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Volunteer | CTRL+SHIFT';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      whatsapp: formData.get('whatsapp'),
      city: formData.get('city'),
      interests: formData.getAll('interests'),
      availability: formData.get('availability'),
      anythingElse: formData.get('anythingElse'),
      consent: formData.get('consent') === 'yes',
      website: formData.get('website')
    };

    if (payload.interests.length === 0) {
      setErrorMessage('Please choose at least one area where you would like to help.');
      setStatus('error');
      return;
    }

    try {
      const response = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || 'We could not send your form. Please try again.');
      }

      form.reset();
      setStatus('success');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'We could not send your form. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white selection:bg-white selection:text-black">
      <FluidBackground />

      <header className="relative z-20 border-b border-white/10">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <Link to="/" aria-label="CTRL+SHIFT home">
            <img src="/assets/images/logo-lockup.png" alt="CTRL + SHIFT" className="h-7 w-auto" />
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-zinc-300 transition hover:text-white"
          >
            <ArrowLeft size={16} /> Back to the site
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        <div className="container mx-auto grid min-h-[calc(100vh-5rem)] grid-cols-1 gap-12 px-6 py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(460px,0.7fr)] lg:gap-20 lg:py-20">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl lg:sticky lg:top-28 lg:self-start"
          >
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.28em] text-purple-300">
              Call for volunteers
            </p>
            <h1 className="font-bit text-[clamp(4.5rem,10vw,10rem)] font-bold uppercase leading-[0.72] tracking-[-0.035em]">
              Help us<br />
              build what&apos;s<br />
              next.
            </h1>
            <p className="mt-10 max-w-xl text-lg leading-relaxed text-zinc-300 md:text-xl">
              CTRL+SHIFT is powered by people who care about Toronto&apos;s creative and technology community.
              Tell us how you&apos;d like to get involved and we&apos;ll reach out when there&apos;s a good fit.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="self-start rounded-3xl border border-white/10 bg-black/50 p-6 shadow-2xl shadow-purple-950/20 backdrop-blur-xl md:p-9"
          >
            {status === 'success' ? (
              <div className="flex min-h-[520px] flex-col items-start justify-center">
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-full bg-purple-500 text-white">
                  <Check size={28} strokeWidth={2.5} />
                </div>
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-purple-300">You&apos;re in</p>
                <h2 className="font-syne text-4xl font-semibold tracking-tight md:text-5xl">Thanks for raising your hand.</h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-300">
                  We&apos;ve received your details. The CTRL+SHIFT team will be in touch when there&apos;s an opportunity that matches your interests.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-9 flex items-center gap-2 text-sm font-semibold text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white"
                >
                  Send another response <ArrowRight size={15} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-7">
                <div>
                  <h2 className="font-syne text-3xl font-semibold tracking-tight">Volunteer with CTRL+SHIFT</h2>
                  <p className="mt-2 text-sm text-zinc-400">Fields marked with * are required.</p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-zinc-200">
                    <span>Full name *</span>
                    <input className={inputClassName} type="text" name="fullName" autoComplete="name" required maxLength={100} />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-zinc-200">
                    <span>City</span>
                    <input className={inputClassName} type="text" name="city" autoComplete="address-level2" maxLength={100} />
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-zinc-200">
                    <span>Email *</span>
                    <input className={inputClassName} type="email" name="email" autoComplete="email" required maxLength={200} />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-zinc-200">
                    <span>WhatsApp number *</span>
                    <input
                      className={inputClassName}
                      type="tel"
                      name="whatsapp"
                      autoComplete="tel"
                      required
                      maxLength={40}
                      placeholder="Include country code"
                    />
                  </label>
                </div>

                <fieldset>
                  <legend className="mb-3 text-sm font-medium text-zinc-200">What would you like to help with? *</legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {INTEREST_OPTIONS.map((interest) => (
                      <label key={interest} className="group relative cursor-pointer">
                        <input
                          type="checkbox"
                          name="interests"
                          value={interest}
                          className="peer sr-only"
                        />
                        <span className="flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-center text-sm text-zinc-300 transition group-hover:border-white/30 peer-checked:border-purple-400 peer-checked:bg-purple-500/20 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-purple-400">
                          {interest}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <label className="block space-y-2 text-sm font-medium text-zinc-200">
                  <span>Availability *</span>
                  <select className={inputClassName} name="availability" required defaultValue="">
                    <option value="" disabled className="bg-zinc-950">Select one</option>
                    <option value="A few hours per month" className="bg-zinc-950">A few hours per month</option>
                    <option value="A few hours per week" className="bg-zinc-950">A few hours per week</option>
                    <option value="Event days only" className="bg-zinc-950">Event days only</option>
                    <option value="It depends" className="bg-zinc-950">It depends</option>
                  </select>
                </label>

                <label className="block space-y-2 text-sm font-medium text-zinc-200">
                  <span>Anything else you want to share?</span>
                  <textarea className={`${inputClassName} min-h-28 resize-y`} name="anythingElse" maxLength={1500} />
                </label>

                <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-zinc-300">
                  <input
                    type="checkbox"
                    name="consent"
                    value="yes"
                    required
                    className="mt-1 h-4 w-4 shrink-0 accent-purple-500"
                  />
                  <span>I agree to be contacted by email or WhatsApp about volunteering with CTRL+SHIFT. *</span>
                </label>

                <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label>
                    Website
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                {status === 'error' && (
                  <p role="alert" className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-base font-bold text-black transition hover:bg-purple-300 disabled:cursor-wait disabled:opacity-70"
                >
                  {status === 'submitting' ? (
                    <><LoaderCircle className="animate-spin" size={19} /> Sending</>
                  ) : (
                    <>Raise your hand <ArrowRight size={19} /></>
                  )}
                </button>
              </form>
            )}
          </motion.section>
        </div>
      </main>
    </div>
  );
}

export default VolunteerPage;
