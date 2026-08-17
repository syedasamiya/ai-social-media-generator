"use client";

import { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:8000";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("LinkedIn");
  const [tone, setTone] = useState("professional");
  const [generatedContent, setGeneratedContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch(`${API_URL}/posts`);
    const data = await res.json();
    setSavedPosts(data);
  };

  const handleGenerate = async () => {
    if (!topic) {
      alert("Please enter a topic");
      return;
    }
    setLoading(true);
    setImageUrl("");
    try {
      const res = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform, tone }),
      });
      const data = await res.json();
      setGeneratedContent(data.generated_content);

      const imgRes = await fetch(`${API_URL}/generate-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform, tone }),
      });
      const imgData = await imgRes.json();
      setImageUrl(imgData.image_url);
    } catch (error) {
      alert("Error generating post. Make sure the backend is running.");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!generatedContent) return;
    await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        platform,
        tone,
        generated_content: generatedContent,
      }),
    });
    fetchPosts();
    setGeneratedContent("");
    setImageUrl("");
    setTopic("");
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API_URL}/posts/${id}`, { method: "DELETE" });
    fetchPosts();
  };

  const platformColors: Record<string, string> = {
    LinkedIn: "bg-blue-100 text-blue-700",
    Instagram: "bg-pink-100 text-pink-700",
    "X/Twitter": "bg-slate-200 text-slate-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            AI Social Media Generator
          </h1>
          <p className="text-slate-500 mt-2">
            Generate ready-to-post content for any platform, instantly
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. AI in healthcare"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 bg-white"
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Instagram">Instagram</option>
                <option value="X/Twitter">X/Twitter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 bg-white"
              >
                <option value="professional">Professional</option>
                <option value="engaging">Engaging</option>
                <option value="concise">Concise</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Generating...
              </>
            ) : (
              "Generate Post"
            )}
          </button>
        </div>

        {/* Generated Post */}
        {generatedContent && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Generated Post
            </h3>

            {imageUrl && (
              <img
                src={imageUrl}
                alt="Generated visual"
                className="w-full rounded-lg mb-3 border border-slate-200"
              />
            )}

            <textarea
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              className="w-full min-h-[160px] px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 text-sm text-slate-700 leading-relaxed"
            />
            <button
              onClick={handleSave}
              className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-lg transition"
            >
              Save Post
            </button>
          </div>
        )}

        {/* Saved Posts */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Saved Posts {savedPosts.length > 0 && `(${savedPosts.length})`}
          </h3>

          {savedPosts.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-6">
              No saved posts yet. Generate one above to get started.
            </p>
          )}

          <div className="space-y-3">
            {savedPosts.map((post) => (
              <div
                key={post.id}
                className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-800">
                      {post.topic}
                    </h4>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        platformColors[post.platform] ||
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {post.platform}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-md transition"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {post.generated_content.slice(0, 150)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}