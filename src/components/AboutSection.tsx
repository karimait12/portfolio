import React from 'react';

export default function AboutSection() {
  const dots = Array.from({ length: 60 });
  return (
    <section className="relative min-h-screen bg-[#0a0a0a] overflow-hidden text-[#E5E7EB]">
      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none">
        {dots.map((_, i) => (
          <div
            key={i}
            className="absolute w-[2px] h-[2px] rounded-full bg-[#F59E0B] opacity-[0.6] animate-starfield"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-20 max-w-6xl flex flex-col md:flex-row items-center">
        {/* Image */}
        <div className="relative md:w-2/5 w-full mb-10 md:mb-0">
          <div className="pixel-border p-1 bg-[#FACC15] rounded-md border border-dotted border-[#FACC15]">
            <img src="/anas.jpg" alt="Anas Sghir" className="w-full rounded-md" />
          </div>
          <span className="absolute top-2 left-2 text-[#FACC15] text-[1.2rem] font-mono">I</span>
        </div>

        {/* Text */}
        <div className="md:w-3/5 space-y-6 text-[#E5E7EB]">
          <p className="text-[#FACC15] font-mono" style={{ fontSize: '1.2rem' }}>My name is</p>
          <h1
            className="font-bold"
            style={{
              color: '#FACC15',
              fontSize: '3.5rem',
              fontFamily: 'Courier New, Fira Code, Roboto Mono',
            }}
          >
            ANAS SGHIR
          </h1>
          <p className="font-mono" style={{ color: '#E5E7EB', fontSize: '1rem' }}>
            I’m a front-end/mobile developer based in Morocco. With over 2 years of professional experience. My stack spans React, Next.js, React Native, Tailwind CSS, Three.js. I bring a special touch by blending performance, UI/UX, and subtle animations to turn complex ideas into elegant products.
          </p>
        </div>
      </div>
    </section>
  );
}
