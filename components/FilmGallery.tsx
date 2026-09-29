'use client';

import React, { useState } from 'react';
import { Play, ShieldCheck } from 'lucide-react';

export interface GalleryItem {
  id: string;
  title: string;
  genre: string;
  category: 'YOU' | 'STUDIOS' | 'GENESIS';
  duration: string;
  label: 'Commissioned Film' | 'Studio Original' | 'Concept Demonstration';
  permissionConfirmed: boolean;
  synopsis: string;
  aspectRatio: string;
  imageBg?: string;
}

const GALLERY_DATA: GalleryItem[] = [
  {
    id: 'gal-01',
    title: 'THE CHRONOMANCER’S DAUGHTER',
    genre: 'Fantasy',
    category: 'YOU',
    duration: '1:30 Trailer',
    label: 'Commissioned Film',
    permissionConfirmed: true,
    synopsis: 'A personalized cinematic trailer starring an authorized client as a time-bending scholar in a gothic fantasy world.',
    aspectRatio: '16:9',
    imageBg: '/un1/mythra-world.png',
  },
  {
    id: 'gal-02',
    title: 'SOLARIS ECHOES',
    genre: 'Sci-fi',
    category: 'STUDIOS',
    duration: '3:45 Short',
    label: 'Studio Original',
    permissionConfirmed: true,
    synopsis: 'Branded deep-space atmosphere film exploring solitude and communication across orbital stations.',
    aspectRatio: '16:9',
    imageBg: '/un1/mythra-world.png',
  },
  {
    id: 'gal-03',
    title: 'THE FOUNDER’S ASCENT',
    genre: 'Founder',
    category: 'YOU',
    duration: '2:15 Trailer',
    label: 'Commissioned Film',
    permissionConfirmed: true,
    synopsis: 'A high-octane narrative trailer documenting a hardware startup founder’s 10-year breakthrough journey.',
    aspectRatio: '16:9',
  },
  {
    id: 'gal-04',
    title: 'A VOW IN VENICE',
    genre: 'Wedding',
    category: 'YOU',
    duration: '1:45 Trailer',
    label: 'Concept Demonstration',
    permissionConfirmed: true,
    synopsis: 'A personalized romantic wedding trailer reimagining an elopement as a 1960s Italian cinema masterpiece.',
    aspectRatio: '16:9',
  },
  {
    id: 'gal-05',
    title: 'THE GENESIS EXPERIMENT',
    genre: 'Drama',
    category: 'GENESIS',
    duration: '27:40 Film',
    label: 'Studio Original',
    permissionConfirmed: true,
    synopsis: 'The landmark first-film experiment testing whether one creator could produce a 28-minute emotional drama.',
    aspectRatio: '16:9',
    imageBg: '/un1/mythra-world.png',
  },
  {
    id: 'gal-06',
    title: 'THE LAST WATCHMAKER',
    genre: 'Life Story',
    category: 'YOU',
    duration: '4:20 Short',
    label: 'Commissioned Film',
    permissionConfirmed: true,
    synopsis: 'A 70th birthday legacy tribute honoring a master horologist and grandfather through generational scenes.',
    aspectRatio: '16:9',
  },
];

export default function FilmGallery() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedFilm, setSelectedFilm] = useState<GalleryItem | null>(null);

  const filters = ['ALL', 'Fantasy', 'Sci-fi', 'Founder', 'Wedding', 'Life Story', 'Drama'];

  const filteredItems = activeFilter === 'ALL'
    ? GALLERY_DATA
    : GALLERY_DATA.filter((item) => item.genre.toLowerCase() === activeFilter.toLowerCase());

  return (
    <section className="py-20 px-6 sm:px-12 bg-[#000000] border-t border-[#ffffff15]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#d8ff44]" />
              <span className="eyebrow-text text-xs text-[#d8ff44]">CINEMATIC PROOF & WORK</span>
            </div>
            <h2 className="font-sans text-3xl sm:text-5xl font-black tracking-tight text-[#f3f3eb] uppercase">
              STORIES & PORTFOLIO
            </h2>
          </div>
          <p className="text-xs text-[#9ea399] max-w-md">
            *All films strictly feature consented likenesses or original studio actors. Fictional concepts and commissions are clearly labeled.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2.5 mb-10 pb-4 border-b border-[#ffffff15]">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-xs uppercase tracking-wider px-5 py-2.5 rounded-full font-bold transition-all ${
                activeFilter === filter
                  ? 'bg-[#d8ff44] text-[#000000] border-2 border-[#000000] shadow-[0_3px_0_0_#000000]'
                  : 'bg-[#080a08] text-[#9ea399] hover:text-white border-2 border-[#ffffff15]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedFilm(item)}
              className="group cursor-pointer bg-[#080a08] border-2 border-[#ffffff15] hover:border-[#d8ff44] rounded-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-[#050605] flex items-center justify-center overflow-hidden border-b border-[#ffffff15]">
                {item.imageBg && (
                  <img
                    src={item.imageBg}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent opacity-85 z-10" />

                {/* Content info */}
                <div className="text-center p-6 z-20">
                  <span className="text-[10px] uppercase tracking-widest text-[#d8ff44] font-mono font-bold block mb-1">
                    {item.genre} · {item.duration}
                  </span>
                  <span className="font-sans text-lg font-black text-[#f3f3eb] block max-w-xs">
                    {item.title}
                  </span>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute z-20 w-12 h-12 rounded-full bg-[#000000]/90 border-2 border-[#d8ff44] flex items-center justify-center text-[#d8ff44] group-hover:bg-[#d8ff44] group-hover:text-[#000000] transition-all shadow-lg">
                  <Play className="w-5 h-5 ml-0.5 fill-current" />
                </div>

                {/* Permission Badge */}
                <div className="absolute top-3 left-3 z-20">
                  <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider bg-[#000000]/90 border border-[#ffffff20] text-[#f3f3eb] font-semibold px-2.5 py-1 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-[#d8ff44]" />
                    {item.label}
                  </span>
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-6">
                <div className="flex items-center justify-between text-xs text-[#9ea399] mb-2 font-mono">
                  <span>{item.category}</span>
                  <span>{item.duration}</span>
                </div>
                <h3 className="font-sans text-xl font-bold text-[#f3f3eb] mb-2 group-hover:text-[#d8ff44] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#9ea399] leading-relaxed">
                  {item.synopsis}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Video Player Simulation */}
      {selectedFilm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-[#080a08] border-2 border-[#d8ff44]/50 rounded-2xl p-6 sm:p-8 text-[#f3f3eb] shadow-2xl">
            <button
              onClick={() => setSelectedFilm(null)}
              className="absolute top-4 right-4 text-xs text-[#9ea399] hover:text-white uppercase font-bold px-3 py-1 bg-[#1a1e19] rounded-full"
            >
              Close [ESC]
            </button>

            <div className="aspect-video bg-[#000000] border border-[#ffffff20] rounded-xl flex flex-col items-center justify-center p-8 text-center my-4 overflow-hidden relative">
              {selectedFilm.imageBg && (
                <img
                  src={selectedFilm.imageBg}
                  alt={selectedFilm.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
              )}
              <div className="relative z-10">
                <span className="eyebrow-text text-[#d8ff44] mb-2 block">{selectedFilm.genre} PREVIEW</span>
                <h3 className="font-sans text-3xl font-black mb-3">{selectedFilm.title}</h3>
                <p className="text-xs text-[#9ea399] max-w-md mx-auto mb-6">{selectedFilm.synopsis}</p>
                <div className="inline-flex items-center gap-2 text-xs text-[#d8ff44] bg-[#0d100c] px-4 py-2 rounded-full border border-[#d8ff44]/30">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorized likeness on file &bull; Master delivered in 1080p</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#9ea399]">
              <span>Label: {selectedFilm.label}</span>
              <button
                onClick={() => setSelectedFilm(null)}
                className="btn-pill-primary text-xs !py-2 !px-4"
              >
                Back to Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
