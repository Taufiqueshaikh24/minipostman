import { useState, useEffect } from "react";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const getMethodColor = (method) => {
  const colors = {
    GET: "text-green-600",
    POST: "text-yellow-600",
    PUT: "text-blue-600",
    PATCH: "text-purple-600",
    DELETE: "text-red-600",
  };
  return colors[method] || "text-slate-600";
};

export default function RequestBuilder({
  onSend,
  onSave,
  loading,
  saving,
  initialData,
}) {
  const [name, setName] = useState("Untitled Request");
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [activeTab, setActiveTab] = useState("params");
  const [headers, setHeaders] = useState([
    { id: 1, key: "", value: "", enabled: true },
  ]);
  const [body, setBody] = useState("");
  const [bodyType, setBodyType] = useState("json");
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Load initial data when editing a saved request
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "Untitled Request");
      setMethod(initialData.method || "GET");
      setUrl(initialData.url || "");
      setBody(initialData.body || "");
      if (initialData.headers && initialData.headers.length > 0) {
        setHeaders(
          initialData.headers.map((h, i) => ({
            id: i + 1,
            key: h.key,
            value: h.value,
            enabled: true,
          }))
        );
      }
    }
  }, [initialData]);

  const addHeader = () => {
    setHeaders([
      ...headers,
      { id: Date.now(), key: "", value: "", enabled: true },
    ]);
  };

  const updateHeader = (id, field, value) => {
    setHeaders(
      headers.map((h) => (h.id === id ? { ...h, [field]: value } : h))
    );
  };

  const removeHeader = (id) => {
    if (headers.length > 1) {
      setHeaders(headers.filter((h) => h.id !== id));
    }
  };

  const getRequestData = () => ({
    name,
    method,
    url,
    headers: headers.filter((h) => h.enabled && h.key),
    body: ["POST", "PUT", "PATCH"].includes(method) ? body : null,
    bodyType,
  });

  const handleSend = () => {
    onSend?.(getRequestData());
  };

  const handleSave = async () => {
    try {
      await onSave?.(getRequestData());
      setShowSaveModal(false);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-lg">
        {/* URL Bar */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex gap-2">
            {/* Method Selector */}
            <div className="relative">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className={`appearance-none px-4 py-2.5 pr-8 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${getMethodColor(
                  method
                )}`}
              >
                {METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* URL Input */}
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter request URL"
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={loading || !url}
              className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
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
                  Sending...
                </>
              ) : (
                <>
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
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                  Send
                </>
              )}
            </button>

            {/* Save Button */}
            <button
              onClick={() => setShowSaveModal(true)}
              disabled={!url}
              className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <div className="flex gap-1 px-4">
            {["params", "headers", "body"].map((tab) => (
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
                {tab === "headers" && headers.filter((h) => h.key).length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-slate-100 text-slate-600 rounded">
                    {headers.filter((h) => h.key).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 min-h-48">
          {/* Params Tab */}
          {activeTab === "params" && (
            <div className="text-sm text-slate-500">
              <p>Query parameters will be automatically parsed from the URL.</p>
            </div>
          )}

          {/* Headers Tab */}
          {activeTab === "headers" && (
            <div className="space-y-2">
              {headers.map((header) => (
                <div key={header.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={header.enabled}
                    onChange={(e) =>
                      updateHeader(header.id, "enabled", e.target.checked)
                    }
                    className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500/20"
                  />
                  <input
                    type="text"
                    value={header.key}
                    onChange={(e) =>
                      updateHeader(header.id, "key", e.target.value)
                    }
                    placeholder="Key"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                  <input
                    type="text"
                    value={header.value}
                    onChange={(e) =>
                      updateHeader(header.id, "value", e.target.value)
                    }
                    placeholder="Value"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                  <button
                    onClick={() => removeHeader(header.id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={addHeader}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Header
              </button>
            </div>
          )}

          {/* Body Tab */}
          {activeTab === "body" && (
            <div className="space-y-3">
              {/* Body Type Selector */}
              <div className="flex gap-4">
                {["none", "json", "form-data", "raw"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="bodyType"
                      value={type}
                      checked={bodyType === type}
                      onChange={(e) => setBodyType(e.target.value)}
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500/20"
                    />
                    <span className="text-sm text-slate-600 capitalize">
                      {type}
                    </span>
                  </label>
                ))}
              </div>

              {/* Body Input */}
              {bodyType !== "none" && (
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder={
                    bodyType === "json"
                      ? '{\n  "key": "value"\n}'
                      : "Enter request body..."
                  }
                  className="w-full h-48 px-4 py-3 bg-slate-900 text-slate-100 font-mono text-sm rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none"
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Save Request
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Request Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter request name"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !name}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
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
                      Saving...
                    </>
                  ) : (
                    "Save Request"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}