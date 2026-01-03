import { useState } from "react";

const getStatusColor = (status) => {
  if (status >= 200 && status < 300) return "text-green-600 bg-green-50";
  if (status >= 300 && status < 400) return "text-blue-600 bg-blue-50";
  if (status >= 400 && status < 500) return "text-yellow-600 bg-yellow-50";
  if (status >= 500) return "text-red-600 bg-red-50";
  return "text-slate-600 bg-slate-50";
};

export default function ResponseViewer({ response, loading, error }) {
  const [activeTab, setActiveTab] = useState("body");

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-8">
        <div className="flex flex-col items-center justify-center text-slate-400">
          <svg
            className="animate-spin h-8 w-8 mb-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-sm">Sending request...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-8">
        <div className="flex flex-col items-center justify-center text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm font-medium">Request Failed</p>
          <p className="text-xs text-slate-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-8">
        <div className="flex flex-col items-center justify-center text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm">Enter a URL and click Send to get a response</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg">
      {/* Response Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          {/* Status Badge */}
          <span
            className={`px-2.5 py-1 text-sm font-semibold rounded-lg ${getStatusColor(
              response.status
            )}`}
          >
            {response.status} {response.statusText}
          </span>

          {/* Time */}
          <span className="text-sm text-slate-500">
            <span className="font-medium text-slate-700">{response.time}</span>{" "}
            ms
          </span>

          {/* Size */}
          <span className="text-sm text-slate-500">
            <span className="font-medium text-slate-700">{response.size}</span>
          </span>
        </div>

        {/* Copy Button */}
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Copy
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-1 px-4">
          {["body", "headers"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? "text-orange-500 border-orange-500"
                  : "text-slate-500 border-transparent hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "body" && (
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono">
            {typeof response.data === "string"
              ? response.data
              : JSON.stringify(response.data, null, 2)}
          </pre>
        )}

        {activeTab === "headers" && (
          <div className="space-y-2">
            {Object.entries(response.headers || {}).map(([key, value]) => (
              <div
                key={key}
                className="flex items-start gap-4 py-2 border-b border-slate-100 last:border-0"
              >
                <span className="text-sm font-medium text-slate-700 min-w-40">
                  {key}
                </span>
                <span className="text-sm text-slate-500 break-all">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}