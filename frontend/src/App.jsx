import { useState } from "react";
import { Mail, Zap } from "lucide-react";
import EmailForm from "./components/EmailForm";
import EmailResult from "./components/EmailResult";
import Skeleton from "./components/Skeleton";
import { generateEmail } from "./api";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(null);

  const handleGenerate = async (data) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setFormData(data);
    try {
      const res = await generateEmail(data);
      setResult(res);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Something went wrong. Is the backend running?"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setFormData(null);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Mail size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white">
              Cold Email Agent
            </h1>
            <p className="text-xs text-gray-500">Powered by Google Gemini</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">
            <Zap size={11} />
            AI Active
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Input Panel */}
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-1">
                Prospect Details
              </h2>
              <p className="text-sm text-gray-400">
                Fill in your prospect's context and we'll generate a
                high-converting cold email.
              </p>
            </div>
            <EmailForm onSubmit={handleGenerate} loading={loading} />
          </div>

          {/* Right — Output Panel */}
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-1">
                Generated Email
              </h2>
              <p className="text-sm text-gray-400">
                3 subject lines + personalized body, under 100 words.
              </p>
            </div>

            {loading && <Skeleton />}

            {error && !loading && (
              <div className="p-4 bg-red-950/50 border border-red-800/50 rounded-lg animate-fade-in">
                <p className="text-sm text-red-300">⚠️ {error}</p>
              </div>
            )}

            {!loading && !result && !error && (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-800 rounded-xl text-center px-6">
                <Mail size={32} className="text-gray-700 mb-3" />
                <p className="text-sm text-gray-500">
                  Your generated email will appear here
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Fill the form on the left to get started
                </p>
              </div>
            )}

            {result && !loading && (
              <EmailResult
                result={result}
                formData={formData}
                onReset={handleReset}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-5xl mx-auto px-6 py-4 text-center text-xs text-gray-600">
          Cold Email Agent · Built with FastAPI + React + Gemini
        </div>
      </footer>
    </div>
  );
}
