import { profile } from '../data/profile';

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-[100svh] flex flex-col justify-center px-6 py-24 max-w-5xl mx-auto"
    >
      <h1 className="text-4xl sm:text-6xl font-display font-bold text-text tracking-tight mb-4">
        {profile.name}
      </h1>
      <p className="text-xl sm:text-2xl font-display text-accent mb-4">
        {profile.title}
      </p>
      <p className="text-base sm:text-lg font-body text-muted max-w-2xl leading-relaxed">
        {profile.tagline}
      </p>
    </section>
  );
}
