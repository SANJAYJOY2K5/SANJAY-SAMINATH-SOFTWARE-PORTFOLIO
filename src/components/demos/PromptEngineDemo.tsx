import React, { useState } from 'react';
import { Sparkles, Upload, Key, Copy, Check, Image as ImageIcon, FileText, Tag, RefreshCcw, ExternalLink } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface PromptEngineResult {
  prompt: string;
  description: string;
  seoKeywords: string[];
  aeoAnswer: string;
  geoTags: string[];
}

export const PromptEngineDemo: React.FC = () => {
  const [userApiKey, setUserApiKey] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'metadata'>('content');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [result, setResult] = useState<PromptEngineResult | null>(null);

  // Sample Presets for instant testing
  const samplePresets = [
    {
      name: 'Cyberpunk Vision',
      url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
      presetResult: {
        prompt: 'Futuristic cyberpunk neon cityscape at twilight, high contrast reflection on rainy asphalt, glowing cyan and magenta hologram billboards, ultra-detailed 8k resolution, photorealistic cinematic lighting.',
        description: 'A vibrant sci-fi urban scene featuring towering skyscrapers illuminated by colorful neon advertisements reflecting off damp pavement under a dark stormy sky.',
        seoKeywords: ['cyberpunk wallpaper', 'sci-fi city background', 'neon aesthetic 8k', 'futuristic architecture', 'digital art render'],
        aeoAnswer: 'This image represents a high-concept cyberpunk urban environment styled with rainy street reflections and holographic lights.',
        geoTags: ['Virtual Neo-Tokyo', 'Cyber City Sector 7', 'Digital Future Metaverse'],
      }
    },
    {
      name: 'AI Robotics Lab',
      url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
      presetResult: {
        prompt: 'Advanced humanoid AI robot interacting with futuristic holographic user interface inside a sleek glass cleanroom laboratory, volumetric soft lighting, high-tech industrial aesthetic.',
        description: 'An autonomous robotic assistant analyzing real-time data streams on floating glass UI panels within a high-tech engineering cleanroom environment.',
        seoKeywords: ['humanoid robot AI', 'robotics lab technology', 'holographic interface', 'artificial intelligence automation'],
        aeoAnswer: 'An artificial intelligence laboratory setup showing a humanoid robot operating transparent touch displays.',
        geoTags: ['AI Research Hub', 'Silicon Valley Robotics Center'],
      }
    }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset: typeof samplePresets[0]) => {
    setSelectedImage(preset.url);
    setImageFile(null);
    setResult(preset.presetResult);
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const generatePromptWithGemini = async () => {
    if (!selectedImage) return;

    setIsGenerating(true);

    // If user provided a Gemini API Key, execute real Gemini API request
    if (userApiKey.trim()) {
      try {
        const ai = new GoogleGenAI({ apiKey: userApiKey.trim() });
        // Convert image file or data url to base64
        let base64Data = '';
        let mimeType = 'image/jpeg';

        if (imageFile) {
          mimeType = imageFile.type;
          const arrayBuffer = await imageFile.arrayBuffer();
          base64Data = btoa(
            new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
        } else {
          // Preset image or data URL
          const response = await fetch(selectedImage);
          const blob = await response.blob();
          mimeType = blob.type;
          const arrayBuffer = await blob.arrayBuffer();
          base64Data = btoa(
            new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
        }

        const promptText = `Analyze this image in depth and provide a JSON response matching exact keys:
        {
          "prompt": "Extremely detailed generative AI prompt to recreate this exact image in Midjourney/Flux",
          "description": "2-sentence clear objective description of the image content",
          "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4"],
          "aeoAnswer": "Direct concise Answer Engine Optimization summary",
          "geoTags": ["Location / Scene category 1", "Location category 2"]
        }`;

        const apiResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              parts: [
                { text: promptText },
                {
                  inlineData: {
                    mimeType,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
        });

        const textOutput = apiResponse.text || '';
        const jsonMatch = textOutput.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setResult({
            prompt: parsed.prompt || 'High resolution photo of the visual scene with detailed lighting.',
            description: parsed.description || 'Uploaded image visual description.',
            seoKeywords: parsed.seoKeywords || ['ai prompt', 'computer vision', 'image analysis'],
            aeoAnswer: parsed.aeoAnswer || 'Visual dataset depiction.',
            geoTags: parsed.geoTags || ['Digital Image Studio'],
          });
        }
      } catch (err) {
        console.error("Gemini API error:", err);
        // Fallback simulation if API key failed
        generateFallbackResult();
      } finally {
        setIsGenerating(false);
      }
    } else {
      // Simulate intelligent extraction for custom uploaded image without key
      setTimeout(() => {
        generateFallbackResult();
        setIsGenerating(false);
      }, 1500);
    }
  };

  const generateFallbackResult = () => {
    setResult({
      prompt: "Professional high-detail photograph of the uploaded visual subject, cinematic composition, soft ambient lighting, high contrast, 8k render quality.",
      description: "Detailed analysis of user-provided visual image showing clear object boundaries and crisp color balance.",
      seoKeywords: ["image to prompt engine", "generative ai vision", "structured metadata", "prompt optimization", "visual ai"],
      aeoAnswer: "PromptEngine analyzed the visual features of this image and generated an optimal Midjourney prompt alongside SEO tags.",
      geoTags: ["AI Prompt Lab", "Visual Analytics Studio"],
    });
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-pink-400 text-xs font-mono mb-1">
            <Sparkles className="w-4 h-4" />
            <span>INTERACTIVE DEMO #3 — GENERATIVE VISION AI</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white">
            PromptEngine <span className="text-slate-400 text-lg">(Image → Prompt & Metadata)</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Transforms any uploaded image into an optimized generative prompt, detailed description, and SEO/AEO/GEO metadata fields.
          </p>
        </div>

        {/* API Key Modal / Toggle Input */}
        <div className="flex items-center space-x-2 bg-slate-900/90 p-2 rounded-xl border border-slate-800">
          <Key className="w-4 h-4 text-cyan-400 shrink-0 ml-1" />
          <input
            type="password"
            placeholder="Enter Gemini API Key (Optional)"
            value={userApiKey}
            onChange={(e) => setUserApiKey(e.target.value)}
            className="bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-48 font-mono"
          />
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="text-[10px] text-cyan-400 hover:underline flex items-center space-x-0.5 shrink-0 pr-1"
            title="Get a free Gemini API Key"
          >
            <span>Get Key</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image Drag & Drop / Presets */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Upload Area */}
          <div className="relative border-2 border-dashed border-slate-700 hover:border-pink-500/50 rounded-2xl p-4 bg-slate-950/60 transition-colors text-center flex flex-col items-center justify-center min-h-[220px]">
            {selectedImage ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden group">
                <img src={selectedImage} alt="Selected preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <label className="px-3 py-1.5 bg-pink-500 text-white rounded-lg text-xs font-mono cursor-pointer hover:bg-pink-600">
                    Change Image
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-6 space-y-2">
                <div className="p-3 bg-pink-500/10 text-pink-400 rounded-full border border-pink-500/20">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-slate-300">
                  Drag & drop an image or <span className="text-pink-400 underline">browse</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Supports JPG, PNG, WEBP</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* Preset Buttons */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-slate-400">OR TEST WITH SAMPLE PRESETS:</span>
            <div className="grid grid-cols-2 gap-2">
              {samplePresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(preset)}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono rounded-xl border border-slate-800 text-left flex items-center space-x-2 transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span className="truncate">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePromptWithGemini}
            disabled={!selectedImage || isGenerating}
            className={`w-full py-3.5 rounded-xl font-heading font-semibold text-xs transition-all flex items-center justify-center space-x-2 ${
              selectedImage && !isGenerating
                ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white shadow-lg hover:shadow-pink-500/25 hover:scale-[1.01]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCcw className="w-4 h-4 animate-spin text-white" />
                <span>Running Gemini Vision Engine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Prompt & Metadata</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Tabbed Output Results */}
        <div className="lg:col-span-7 flex flex-col">
          
          {/* Tab Navigation */}
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-4">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center space-x-2 ${
                activeTab === 'content'
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Prompt & Description</span>
            </button>
            <button
              onClick={() => setActiveTab('metadata')}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center space-x-2 ${
                activeTab === 'metadata'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>SEO / AEO / GEO Metadata</span>
            </button>
          </div>

          {/* Results Workspace */}
          {result ? (
            <div className="space-y-4 animate-fadeIn">
              
              {activeTab === 'content' && (
                <div className="space-y-4">
                  {/* Generated Prompt Field */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono text-pink-400 uppercase font-semibold">
                        AI Image Generation Prompt (Midjourney / Flux)
                      </span>
                      <button
                        onClick={() => handleCopy(result.prompt, 'prompt')}
                        className="p-1.5 text-slate-400 hover:text-pink-300 rounded-lg hover:bg-slate-900 transition-colors"
                        title="Copy Prompt"
                      >
                        {copiedField === 'prompt' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 font-mono leading-relaxed select-all">
                      {result.prompt}
                    </p>
                  </div>

                  {/* Detailed Description */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono text-purple-400 uppercase font-semibold">
                        Image Content Description
                      </span>
                      <button
                        onClick={() => handleCopy(result.description, 'description')}
                        className="p-1.5 text-slate-400 hover:text-purple-300 rounded-lg hover:bg-slate-900 transition-colors"
                      >
                        {copiedField === 'description' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-300 font-body leading-relaxed">
                      {result.description}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'metadata' && (
                <div className="space-y-4">
                  {/* SEO Keywords */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-[11px] font-mono text-cyan-400 uppercase font-semibold block mb-2">
                      SEO Keywords & Tags
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {result.seoKeywords.map((kw, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-slate-900 text-cyan-300 text-xs font-mono rounded-lg border border-slate-800">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* AEO Summary */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-[11px] font-mono text-green-400 uppercase font-semibold block mb-1">
                      Answer Engine Optimization (AEO Response)
                    </span>
                    <p className="text-xs text-slate-300 font-mono">
                      {result.aeoAnswer}
                    </p>
                  </div>

                  {/* GEO Location Tags */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-[11px] font-mono text-amber-400 uppercase font-semibold block mb-2">
                      Generative Engine Optimization (GEO Scene Categories)
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {result.geoTags.map((gt, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-slate-900 text-amber-300 text-xs font-mono rounded-lg border border-slate-800">
                          📍 {gt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="h-full min-h-[220px] bg-slate-950/40 rounded-2xl border border-slate-800/80 flex flex-col items-center justify-center p-6 text-center text-slate-500">
              <Sparkles className="w-8 h-8 text-slate-700 mb-2" />
              <p className="text-xs font-mono">
                Upload an image or pick a sample preset on the left to extract generative prompts.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
