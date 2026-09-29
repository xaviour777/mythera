import React from 'react';
import FilmGallery from '../../../components/FilmGallery';
import PathSelector from '../../../components/PathSelector';

export default function StoriesPage() {
  return (
    <div className="pt-24 pb-20 bg-[#000000] text-[#F4F0E8]">
      {/* Hero */}
      <section className="py-20 px-6 sm:px-8 border-b border-[#ffffff15]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="eyebrow-text block mb-3 text-[#d8ff44]">ORIGINALS & COMMISSIONS</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold uppercase tracking-tight leading-tight">
            MYTHRA STORIES & PORTFOLIO
          </h1>
          <p className="mt-6 text-sm sm:text-base text-[#A7A39B] max-w-2xl mx-auto leading-relaxed">
            Explore personalized cinema trailers, studio originals, and branded narrative drama. Every film strictly adheres to likeness consent and verified truth labeling.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <FilmGallery />

      {/* 3 Doors Router */}
      <PathSelector />
    </div>
  );
}
