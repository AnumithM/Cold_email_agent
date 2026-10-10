import { useState } from "react";
import { Copy, Check, RotateCcw, RefreshCw } from "lucide-react";
import { refineEmail } from "../api";

export default function EmailResult({ result, formData, onReset }) {
  const [copiedSubject, setCopiedSubject] = useState(null);
  const [copiedBody, setCopiedBody] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [refining, setRefining] = useState(false);
  const [currentResult, setCurrentResult] = useState(result);
  const [showRefine, setShowRefine] = useState(false);

  const copyToClipboard = async (text, type, index = null) => {
    await navigator.clipboard.writeText(text);
    if (type === "subject") {
      setCopiedSubject(index);
      setTimeout(() => setCopiedSubject(null), 2000);
    } else {
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2000);
    }
  };

  const handleRefine = async () => {
    if (!feedback.trim()) return;
    setRefining(true);
    try {
      const refined = await refineEmail(
        currentResult.email_body,
        feedback,
        formData
      );
      setCurrentResult({
        ...refined,
        word_count: refined.email_body?.split(" ").length || 0,
      });
      setFeedback("");
      setShowRefine(false);
    } catch (err) {
      console.error(err);
    } finally {
      setRefining(false);
    }
  };

  const wordCountColor =
    currentResult.word_count <= 100
      ? "text-emerald-400"
      : "text-amber-400";

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Subject Lines */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Subject Lines
        </h3>
        <div className="space-y-2">
          {currentResult.subject_lines.map((subject, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg group hover:border-indigo-500/50 transition-all"
            >
              <span className="text-sm text-gray-200 flex-1">{subject}</span>
              <button
                onClick={() => copyToClipboard(subject, "subject", i)}
                className="shrink-0 text-gray-500 hover:text-indigo-400 transition-colors"
                title="Copy subject line"
              >
                {copiedSubject === i ? (
                  <Check size={15} className="text-emerald-400" />
                ) : (
                  <Copy size={15} />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Email Body */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Email Body
          </h3>
          <span className={`text-xs font-medium ${wordCountColor}`}>
            {currentResult.word_count} words
          </span>
        </div>
        <div className="relative">
          <pre className="whitespace-pre-wrap font-sans text-sm text-gray-200 leading-relaxed bg-gray-800 border border-gray-700 rounded-lg p-4 pr-12">
            {currentResult.email_body}
          </pre>
          <button
            onClick={() => copyToClipboard(currentResult.email_body, "body")}
            className="absolute top-3 right-3 text-gray-500 hover:text-indigo-400 transition-colors"
            title="Copy email"
          >
            {copiedBody ? (
              <Check size={16} className="text-emerald-400" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Tone Notes */}
      {currentResult.tone_notes && (
        <div className="px-4 py-3 bg-indigo-950/50 border border-indigo-800/40 rounded-lg">
          <p className="text-xs text-indigo-300">
            <span className="font-semibold">Tone note: </span>
            {currentResult.tone_notes}
          </p>
        </div>
      )}

      {/* Refine Section */}
      <div className="border-t border-gray-800 pt-5 space-y-3">
        <button
          onClick={() => setShowRefine((v) => !v)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-400 transition-colors"
        >
          <RefreshCw size={14} />
          {showRefine ? "Cancel refinement" : "Refine with AI feedback"}
        </button>

        {showRefine && (
          <div className="space-y-3 animate-fade-in">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder='e.g. "Make it more casual" or "Add urgency without spam words"'
              rows={3}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
            />
            <button
              onClick={handleRefine}
              disabled={refining || !feedback.trim()}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all text-sm flex items-center justify-center gap-2"
            >
              {refining ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Refining...
                </>
              ) : (
                "Apply Feedback"
              )}
            </button>
          </div>
        )}
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
      >
        <RotateCcw size={14} />
        Start over
      </button>
    </div>
  );
}
