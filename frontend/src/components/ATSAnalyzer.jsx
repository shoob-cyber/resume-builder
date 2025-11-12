import React, { useState, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const CircularScore = ({ score }) => {
  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2} className="mx-auto">
      <defs>
        <linearGradient id="grad" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <circle
        stroke="#e6e6e6"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="url(#grad)"
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        style={{ strokeDashoffset }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        transform={`rotate(-90 ${radius} ${radius})`}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="20" fill="#111">{score}%</text>
    </svg>
  );
};

const ATSAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleAnalyze = async () => {
    setError(null);
    setResult(null);
    if (!jd || jd.trim().length === 0) {
      setError('Please paste a job description to analyze against.');
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      if (file) form.append('resume', file, file.name);
      form.append('jd', jd);

      const res = await axios.post('/api/analyze', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || 'Failed to analyze resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 glass p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">ATS Analyzer</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Upload Resume (PDF or DOCX)</label>
          {/* Hidden native file input, triggered by a styled button for a cleaner UI */}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
          <div className="flex items-center gap-3 mb-4">
            <button
              type="button"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50"
            >
              Choose file
            </button>
            <div className="text-sm text-gray-600">
              {file ? file.name : 'No file chosen'}
            </div>
          </div>

          <label className="block text-sm font-medium mb-2">Job Description</label>
          <textarea
            rows={12}
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white/60"
            placeholder="Paste the job description here..."
          />

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-teal-400 text-white rounded-lg shadow"
            >
              {loading ? 'Analyzing...' : 'Analyze Resume'}
            </button>
            <button
              disabled
              title="Download report (coming soon)"
              className="px-4 py-2 border rounded-lg text-sm"
            >
              Download Report
            </button>
          </div>

          {error && <div className="mt-4 text-red-600">{error}</div>}
        </div>

        <div>
          <div className="flex flex-col items-center">
            <div className="w-40 h-40">
              <CircularScore score={result?.atsScore ?? 0} />
            </div>
            <div className="mt-4 text-center">
              <div className="text-sm text-gray-600">ATS Score</div>
              <div className="text-xl font-semibold">{result ? `${result.atsScore}/100` : '—'}</div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium">Keyword Match</h3>
            <div className="w-full bg-gray-100 rounded h-4 mt-2">
              <div
                className="h-4 rounded bg-gradient-to-r from-purple-600 to-teal-400"
                style={{ width: `${result?.keywordMatch ?? 0}%` }}
              />
            </div>
            <div className="text-sm text-gray-500 mt-2">{result ? `${result.keywordMatch}% keywords matched` : '—'}</div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium">Missing Keywords</h3>
            {result?.missingKeywords?.length ? (
              <ul className="list-disc ml-5 mt-2 text-sm">
                {result.missingKeywords.map((k, i) => (
                  <li key={i}>{k}</li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-500 mt-2">No missing keywords or no result yet.</div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="font-medium">Suggestions</h3>
            {result?.suggestions?.length ? (
              <ul className="list-disc ml-5 mt-2 text-sm">
                {result.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-500 mt-2">No suggestions yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSAnalyzer;
