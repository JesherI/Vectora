"use client";

import React, { useState, useCallback } from 'react';
import frameworks from './framework-data';
import CustomBuilder, { CustomAsset } from './custom-builder';
import { saveAs } from 'file-saver';

const categories = ['Web', 'Mobile', 'Desktop', 'Universal'] as const;

const VectoraApp = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [svgFile, setSvgFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [baseName, setBaseName] = useState('app-icon');
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [customOutputs, setCustomOutputs] = useState<CustomAsset[]>([]);

  const toggleFramework = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const selectAll = (ids: string[]) => {
    const allSelected = ids.every(id => selected.includes(id));
    setSelected(prev =>
      allSelected ? prev.filter(f => !ids.includes(f)) : [...new Set([...prev, ...ids])]
    );
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'image/svg+xml') {
      setSvgFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSvgFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    if (!svgFile || (selected.length === 0 && customOutputs.length === 0)) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('svg', svgFile);
      formData.append('selected', JSON.stringify(selected));
      formData.append('custom', JSON.stringify(customOutputs));
      formData.append('baseName', baseName || 'app-icon');

      const res = await fetch('/api/convert', { method: 'POST', body: formData });
      if (!res.ok) {
        const text = await res.text();
        console.error('Server response:', text);
        let detail: string | undefined;
        try { detail = JSON.parse(text).detail } catch {}
        throw new Error(detail || text || 'Conversion failed');
      }

      const blob = await res.blob();
      saveAs(blob, `${baseName || 'app-icon'}.zip`);
    } catch (err) {
      console.error(err);
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown'}`);
    } finally {
      setLoading(false);
    }
  };

  const groupedFrameworks = categories.map(cat => ({
    category: cat,
    items: frameworks.filter(f => f.category === cat),
  }));

  const totalAssets = selected.reduce((acc, id) => acc + (frameworks.find(f => f.id === id)?.outputs.length ?? 0), 0) + customOutputs.length;

  return (
    <div className="w-full max-w-5xl mx-auto h-full">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl shadow-2xl p-8 md:p-12 h-full flex flex-col">
        {/* Header */}
        <div className="flex-none">
          <h1 className="text-2xl font-semibold text-white mb-1">Convert SVG</h1>
          <p className="text-zinc-400 text-sm mb-6">Drop your logo and pick target platforms</p>
        </div>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => document.getElementById('svg-input')?.click()}
          className={`
            flex-none rounded-xl border-2 border-dashed p-8 mb-4 text-center cursor-pointer
            transition-all duration-300
            ${dragging
              ? 'border-[#F9040E] bg-[#F9040E]/10'
              : svgFile
                ? 'border-white/20 bg-white/[0.02]'
                : 'border-white/[0.08] hover:border-white/20 bg-white/[0.02]'
            }
          `}
        >
          <input
            id="svg-input"
            type="file"
            accept=".svg"
            className="hidden"
            onChange={handleFileInput}
          />
          {svgFile && previewUrl ? (
            <div className="flex items-center justify-center gap-4">
              <img src={previewUrl} alt="preview" className="h-14 w-14 object-contain" />
              <span className="text-zinc-300 font-mono text-sm">{svgFile.name}</span>
            </div>
          ) : (
            <div>
              <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-white/[0.08] flex items-center justify-center">
                <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              </div>
              <p className="text-zinc-400 text-sm">
                Drop your <span className="text-[#F9040E] font-medium">SVG</span> here or click to browse
              </p>
            </div>
          )}
        </div>

        {/* Base name input */}
        <div className="flex-none mb-4">
          <label className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-mono block mb-2">File name</label>
          <input
            type="text"
            value={baseName}
            onChange={(e) => setBaseName(e.target.value)}
            placeholder="my-app-icon"
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white font-mono text-sm
                       placeholder:text-zinc-600 focus:outline-none focus:border-[#F9040E]/50 transition-colors"
          />
        </div>

        {/* Framework grid — scroll if needed */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-1">
          {groupedFrameworks.map(({ category, items }) => (
            <div key={category} className="mb-6 last:mb-0">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-mono">{category}</h2>
                <button
                  onClick={() => selectAll(items.map(f => f.id))}
                  className="text-[10px] uppercase tracking-wider text-zinc-600 hover:text-zinc-400 transition-colors font-mono"
                >
                  {items.every(f => selected.includes(f.id)) ? 'Deselect all' : 'Select all'}
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {items.map((fw) => (
                  <button
                    key={fw.id}
                    onClick={() => toggleFramework(fw.id)}
                    className={`
                      relative px-3.5 py-2.5 rounded-xl border text-left transition-all duration-200
                      font-mono text-xs leading-tight
                      ${selected.includes(fw.id)
                        ? 'border-[#F9040E] bg-[#F9040E]/10 text-white'
                        : 'border-white/[0.06] bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-zinc-200'
                      }
                    `}
                  >
                    <span className="block font-semibold text-sm mb-0.5">{fw.name}</span>
                    <span className="block text-[10px] opacity-50">{fw.outputs.length} assets</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Generate bar */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/[0.06] flex-none">
          <p className="text-zinc-500 text-xs font-mono">
            {selected.length === 0 && customOutputs.length === 0
              ? 'Select at least one platform or custom'
              : `${selected.length} platform${selected.length > 1 ? 's' : ''}${customOutputs.length > 0 ? ` + ${customOutputs.length} custom` : ''} · ${totalAssets} assets`
            }
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCustomOpen(true)}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase
                         border border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20
                         transition-all duration-300"
            >
              Custom
            </button>
            <button
              disabled={!svgFile || (selected.length === 0 && customOutputs.length === 0) || loading}
              onClick={handleGenerate}
              className={`
                px-8 py-2.5 rounded-xl font-semibold text-sm tracking-wider uppercase
                transition-all duration-300
                ${svgFile && (selected.length > 0 || customOutputs.length > 0) && !loading
                  ? 'bg-[#F9040E] text-white hover:bg-[#d0030a] active:scale-95 shadow-lg shadow-[#F9040E]/20'
                  : 'bg-white/[0.05] text-zinc-600 cursor-not-allowed'
                }
              `}
            >
              {loading ? 'Generating…' : 'Generate'}
            </button>
          </div>
        </div>
      </div>

      {/* Custom builder modal */}
      <CustomBuilder
        open={customOpen}
        onClose={() => setCustomOpen(false)}
        outputs={customOutputs}
        onChange={setCustomOutputs}
      />
    </div>
  );
};

export default VectoraApp;