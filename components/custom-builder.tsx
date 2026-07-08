"use client";

import React, { useState } from 'react';

export interface CustomAsset {
  size: number;
  format: 'png' | 'jpg' | 'ico';
  name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  outputs: CustomAsset[];
  onChange: (outputs: CustomAsset[]) => void;
}

const SIZES = [
  16, 20, 24, 29, 30, 32,
  40, 44, 48, 58, 60, 64,
  71, 76, 80, 83, 87, 89,
  96, 107, 120, 128, 142, 144,
  150, 152, 167, 180, 192, 200,
  256, 284, 310,
  512, 1024,
];

const FORMATS = ['png', 'jpg', 'ico'] as const;

const CustomBuilder = ({ open, onClose, outputs, onChange }: Props) => {
  const [selectedFormat, setSelectedFormat] = useState<'png' | 'jpg' | 'ico'>('png');

  const addOutput = (size: number) => {
    const key = `${size}x${size}.${selectedFormat}`;
    if (outputs.some(o => o.name === key)) return;
    onChange([...outputs, { size, format: selectedFormat, name: key }]);
  };

  const removeOutput = (name: string) => {
    onChange(outputs.filter(o => o.name !== name));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 rounded-2xl border border-white/[0.08] bg-zinc-900 backdrop-blur-2xl shadow-2xl p-6 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4 flex-none">
          <h2 className="text-lg font-semibold text-white">Custom assets</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Format selector */}
        <div className="flex gap-2 mb-4 flex-none">
          {FORMATS.map(fmt => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-4 py-1.5 rounded-lg border text-xs font-mono uppercase transition-all
                ${selectedFormat === fmt
                  ? 'border-[#F9040E] bg-[#F9040E]/10 text-white'
                  : 'border-white/[0.06] text-zinc-400 hover:border-zinc-500'
                }`}
            >
              .{fmt}
            </button>
          ))}
        </div>

        {/* Size grid */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-1">
          <div className="flex flex-wrap gap-1.5">
            {SIZES.map(size => {
              const key = `${size}x${size}.${selectedFormat}`;
              const selected = outputs.some(o => o.name === key);
              return (
                <button
                  key={key}
                  onClick={() => selected ? removeOutput(key) : addOutput(size)}
                  className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-mono transition-all
                    ${selected
                      ? 'border-[#F9040E] bg-[#F9040E]/10 text-white'
                      : 'border-white/[0.06] text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
                    }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected list */}
        <div className="flex-none mt-4 pt-3 border-t border-white/[0.06]">
          {outputs.length === 0 ? (
            <p className="text-zinc-500 text-[10px] font-mono text-center">No assets selected</p>
          ) : (
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {outputs.map(o => (
                <span
                  key={o.name}
                  onClick={() => removeOutput(o.name)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg
                    bg-[#F9040E]/10 border border-[#F9040E]/30 text-[10px] font-mono
                    text-zinc-300 cursor-pointer hover:bg-[#F9040E]/20 transition-colors"
                >
                  {o.name}
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </span>
              ))}
            </div>
          )}
          <p className="text-[10px] text-zinc-600 font-mono mt-1.5 text-center">{outputs.length} asset{outputs.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomBuilder;