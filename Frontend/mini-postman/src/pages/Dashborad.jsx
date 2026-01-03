// import { useState, useEffect } from "react";
// import { RequestBuilder, ResponseViewer } from "../components/dashboard";
// import { requestsApi } from "../api";

// export default function Dashboard() {
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [response, setResponse] = useState(null);
//   const [error, setError] = useState(null);
//   const [savedRequests, setSavedRequests] = useState([]);
//   const [currentRequest, setCurrentRequest] = useState(null);

//   // Fetch saved requests on mount
//   useEffect(() => {
//     fetchSavedRequests();
//   }, []);

//   const fetchSavedRequests = async () => {
//     try {
//       const requests = await requestsApi.getAll();
//       setSavedRequests(requests);
//     } catch (err) {
//       console.error("Failed to fetch requests:", err);
//     }
//   };

//   const handleSendRequest = async (requestData) => {
//     setLoading(true);
//     setError(null);
//     setResponse(null);

//     const startTime = Date.now();

//     try {
//       // Build headers object
//       const headers = {};
//       requestData.headers.forEach((h) => {
//         if (h.key && h.enabled) {
//           headers[h.key] = h.value;
//         }
//       });

//       // Add content-type for JSON body
//       if (requestData.bodyType === "json" && requestData.body) {
//         headers["Content-Type"] = "application/json";
//       }

//       // Build fetch options
//       const options = {
//         method: requestData.method,
//         headers,
//       };

//       // Add body for POST, PUT, PATCH
//       if (["POST", "PUT", "PATCH"].includes(requestData.method) && requestData.body) {
//         options.body = requestData.body;
//       }

//       const res = await fetch(requestData.url, options);
//       const endTime = Date.now();

//       // Try to parse as JSON, fallback to text
//       let data;
//       const contentType = res.headers.get("content-type");
//       if (contentType && contentType.includes("application/json")) {
//         data = await res.json();
//       } else {
//         data = await res.text();
//       }

//       // Get response headers
//       const responseHeaders = {};
//       res.headers.forEach((value, key) => {
//         responseHeaders[key] = value;
//       });

//       // Calculate size
//       const sizeInBytes = new Blob([JSON.stringify(data)]).size;
//       const size =
//         sizeInBytes > 1024
//           ? `${(sizeInBytes / 1024).toFixed(2)} KB`
//           : `${sizeInBytes} B`;

//       setResponse({
//         status: res.status,
//         statusText: res.statusText,
//         time: endTime - startTime,
//         size,
//         headers: responseHeaders,
//         data,
//       });
//     } catch (err) {
//       setError(err.message || "Failed to send request");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSaveRequest = async (requestData) => {
//     setSaving(true);
//     try {
//       // Format headers for API
//       const headers = requestData.headers
//         .filter((h) => h.key && h.enabled)
//         .map((h) => ({ key: h.key, value: h.value }));

//       const payload = {
//         name: requestData.name || "Untitled Request",
//         method: requestData.method,
//         url: requestData.url,
//         headers,
//         body: ["POST", "PUT", "PATCH"].includes(requestData.method)
//           ? requestData.body
//           : null,
//       };

//       const result = await requestsApi.create(payload);
      
//       // Refresh saved requests
//       await fetchSavedRequests();
      
//       return result;
//     } catch (err) {
//       console.error("Failed to save request:", err);
//       throw err;
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDeleteRequest = async (id) => {
//     try {
//       await requestsApi.delete(id);
//       await fetchSavedRequests();
//     } catch (err) {
//       console.error("Failed to delete request:", err);
//     }
//   };

//   const handleLoadRequest = (request) => {
//     setCurrentRequest(request);
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* Request Builder */}
//       <RequestBuilder
//         onSend={handleSendRequest}
//         onSave={handleSaveRequest}
//         loading={loading}
//         saving={saving}
//         initialData={currentRequest}
//       />

//       {/* Response Viewer */}
//       <ResponseViewer response={response} loading={loading} error={error} />
//     </div>
//   );
// }



























import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import {
  fetchRequests, createRequest, deleteRequest, setCurrentRequest, clearCurrentRequest,
  executeRequest, fetchExecutions, setDirectResponse, setDirectError, setExecuting,
} from "../store/slices/requestsSlice";
import { fetchCollections, createCollection, addRequestToCollection } from "../store/slices/collectionsSlice";
import { fetchEnvironments, createEnvironment, deleteEnvironment, setSelectedEnvironment } from "../store/slices/enviromentSlice";
import parseCurl from "../utils/parseCurl";
import parsePostmanCollection from "../utils/parsePostman";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const METHOD_COLORS = {
  GET: "text-green-600 bg-green-50",
  POST: "text-yellow-600 bg-yellow-50",
  PUT: "text-blue-600 bg-blue-50",
  PATCH: "text-purple-600 bg-purple-50",
  DELETE: "text-red-600 bg-red-50",
};

const getStatusColor = (status) => {
  if (status >= 200 && status < 300) return "bg-green-100 text-green-700";
  if (status >= 300 && status < 400) return "bg-yellow-100 text-yellow-700";
  if (status >= 400 && status < 500) return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
};

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((s) => s.auth);
  const { items: requests, currentRequest, response, executions, isLoading, isSaving, isExecuting, error } = useSelector((s) => s.requests);
  const { items: collections, isLoading: collectionsLoading } = useSelector((s) => s.collections);
  const { items: environments, selectedId: selectedEnvId, isLoading: envsLoading } = useSelector((s) => s.environments);

  // UI state
  const [sidebarTab, setSidebarTab] = useState("requests");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [responseTab, setResponseTab] = useState("body");

  // Modals
  const [modal, setModal] = useState(null); // 'save' | 'collection' | 'curl' | 'postman' | 'addToCol' | 'history' | 'env'

  // Form state
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [requestName, setRequestName] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [activeTab, setActiveTab] = useState("headers");
  const [headers, setHeaders] = useState([{ id: 1, key: "", value: "", enabled: true }]);
  const [body, setBody] = useState("");
  const [bodyType, setBodyType] = useState("json");
  const [curlInput, setCurlInput] = useState("");
  const [postmanInput, setPostmanInput] = useState("");
  const [importError, setImportError] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [envName, setEnvName] = useState("");
  const [envVariables, setEnvVariables] = useState("");

  // Fetch all data on mount
  useEffect(() => {
    dispatch(fetchRequests());
    dispatch(fetchCollections());
    dispatch(fetchEnvironments());
  }, [dispatch]);

  // Load current request into form
  useEffect(() => {
    if (currentRequest) {
      setMethod(currentRequest.method || "GET");
      setUrl(currentRequest.url || "");
      setRequestName(currentRequest.name || "");
      setBody(currentRequest.body || "");
      setHeaders(
        currentRequest.headers?.length > 0
          ? currentRequest.headers.map((h, i) => ({ id: i + 1, key: h.key, value: h.value, enabled: true }))
          : [{ id: 1, key: "", value: "", enabled: true }]
      );
    }
  }, [currentRequest]);

  // Handlers
  const handleLogout = () => { dispatch(logout()); navigate("/login"); };

  const handleNewRequest = () => {
    dispatch(clearCurrentRequest());
    setMethod("GET"); setUrl(""); setRequestName("");
    setHeaders([{ id: 1, key: "", value: "", enabled: true }]);
    setBody(""); setMobileSidebarOpen(false);
  };

  const handleSelectRequest = (req) => { dispatch(setCurrentRequest(req)); setMobileSidebarOpen(false); };

  const handleDeleteRequest = (e, id) => {
    e.stopPropagation();
    if (confirm("Delete this request?")) dispatch(deleteRequest(id));
  };

  const addHeader = () => setHeaders([...headers, { id: Date.now(), key: "", value: "", enabled: true }]);
  const updateHeader = (id, field, value) => setHeaders(headers.map((h) => (h.id === id ? { ...h, [field]: value } : h)));
  const removeHeader = (id) => headers.length > 1 && setHeaders(headers.filter((h) => h.id !== id));

  // Save request
  const handleSaveRequest = async () => {
    if (!url || !requestName) return;
    const reqHeaders = headers.filter((h) => h.key && h.enabled).map((h) => ({ key: h.key, value: h.value }));
    const result = await dispatch(createRequest({
      name: requestName, method, url, headers: reqHeaders,
      body: ["POST", "PUT", "PATCH"].includes(method) ? body : null,
    })).unwrap();
    setModal(null); setRequestName("");
    dispatch(setCurrentRequest({ ...result, name: requestName, method, url, headers: reqHeaders }));
  };

  // Send request
  const handleSend = async () => {
    if (!url) return;

    // If saved request, execute via backend
    if (currentRequest?.id) {
      dispatch(executeRequest({ id: currentRequest.id, environmentId: selectedEnvId }));
      return;
    }

    // Direct fetch for unsaved requests
    dispatch(setExecuting(true));
    const reqHeaders = {};
    headers.forEach((h) => { if (h.key && h.enabled) reqHeaders[h.key] = h.value; });
    if (bodyType === "json" && body) reqHeaders["Content-Type"] = "application/json";

    const options = { method, headers: reqHeaders };
    if (["POST", "PUT", "PATCH"].includes(method) && body) options.body = body;

    try {
      const startTime = Date.now();
      const res = await fetch(url, options);
      const duration = Date.now() - startTime;
      let data;
      const contentType = res.headers.get("content-type");
      if (contentType?.includes("application/json")) data = await res.json();
      else data = await res.text();
      const resHeaders = {}; res.headers.forEach((v, k) => resHeaders[k] = v);
      dispatch(setDirectResponse({ status: res.status, headers: resHeaders, data, duration }));
    } catch (err) {
      dispatch(setDirectError(err.message));
    }
  };

  const handleViewHistory = () => {
    if (currentRequest?.id) { dispatch(fetchExecutions(currentRequest.id)); setModal("history"); }
  };

  const handleCreateCollection = async () => {
    if (!collectionName) return;
    await dispatch(createCollection(collectionName));
    setModal(null); setCollectionName("");
  };

  const handleAddToCollection = async () => {
    if (!selectedCollectionId || !currentRequest?.id) return;
    await dispatch(addRequestToCollection({ collectionId: selectedCollectionId, requestId: currentRequest.id }));
    setModal(null); setSelectedCollectionId("");
  };

  const handleImportCurl = async () => {
    setImportError("");
    try {
      const parsed = parseCurl(curlInput);
      if (!parsed.url) { setImportError("Could not parse URL"); return; }
      const result = await dispatch(createRequest({
        name: `Imported: ${parsed.url.substring(0, 30)}...`,
        method: parsed.method, url: parsed.url, headers: parsed.headers, body: parsed.body,
      })).unwrap();
      dispatch(setCurrentRequest({ ...result, ...parsed }));
      setModal(null); setCurlInput("");
    } catch (err) { setImportError("Failed: " + err.message); }
  };

  const handleImportPostman = async () => {
    setImportError("");
    try {
      const parsed = parsePostmanCollection(postmanInput);
      const colResult = await dispatch(createCollection(parsed.name)).unwrap();
      for (const req of parsed.requests) {
        const reqResult = await dispatch(createRequest(req)).unwrap();
        await dispatch(addRequestToCollection({ collectionId: colResult.id, requestId: reqResult.id }));
      }
      setModal(null); setPostmanInput("");
      dispatch(fetchRequests()); dispatch(fetchCollections());
    } catch (err) { setImportError("Failed: " + err.message); }
  };

  const handleCreateEnvironment = async () => {
    if (!envName) return;
    let variables = {};
    try {
      if (envVariables.trim()) variables = JSON.parse(envVariables);
    } catch { setImportError("Invalid JSON for variables"); return; }
    await dispatch(createEnvironment({ name: envName, variables }));
    setModal(null); setEnvName(""); setEnvVariables(""); setImportError("");
  };

  const handleDeleteEnv = (e, id) => {
    e.stopPropagation();
    if (confirm("Delete this environment?")) dispatch(deleteEnvironment(id));
  };

  const userInitials = user?.email?.substring(0, 2).toUpperCase() || "U";

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Navbar */}
      <nav className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
            <MenuIcon />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <BoltIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 hidden sm:block">Mini Postman</span>
          </div>
        </div>

        {/* Environment Selector */}
        <div className="flex items-center gap-3">
          <select
            value={selectedEnvId || ""}
            onChange={(e) => dispatch(setSelectedEnvironment(e.target.value ? Number(e.target.value) : null))}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white"
          >
            <option value="">No Environment</option>
            {environments.map((env) => (
              <option key={env.id} value={env.id}>{env.name}</option>
            ))}
          </select>

          <div className="relative">
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-orange-600">{userInitials}</span>
              </div>
            </button>
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                  <div className="px-4 py-2 border-b"><p className="text-sm font-medium truncate">{user?.email}</p></div>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogoutIcon /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Sidebar */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl flex flex-col">
              <Sidebar {...{ sidebarTab, setSidebarTab, requests, collections, environments, isLoading, collectionsLoading, envsLoading,
                handleNewRequest, handleSelectRequest, handleDeleteRequest, handleDeleteEnv, setModal, closeMobile: () => setMobileSidebarOpen(false) }} />
            </aside>
          </div>
        )}

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col shrink-0">
          <Sidebar {...{ sidebarTab, setSidebarTab, requests, collections, environments, isLoading, collectionsLoading, envsLoading,
            handleNewRequest, handleSelectRequest, handleDeleteRequest, handleDeleteEnv, setModal }} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-4 lg:p-6 space-y-4">
            {/* Request Builder */}
            <div className="bg-white border border-slate-200 rounded-lg">
              <div className="p-3 lg:p-4 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row gap-2">
                  <select value={method} onChange={(e) => setMethod(e.target.value)}
                    className={`px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-sm ${METHOD_COLORS[method]?.split(" ")[0]}`}>
                    {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter request URL (use {{VAR}} for variables)"
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                  <div className="flex gap-2">
                    <button onClick={handleSend} disabled={isExecuting || !url}
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-orange-500 text-white rounded-lg font-medium text-sm hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2">
                      {isExecuting ? <><Spinner small /> <span className="hidden sm:inline">Sending...</span></> : <><SendIcon /> Send</>}
                    </button>
                    <button onClick={() => setModal("save")} disabled={!url} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50">Save</button>
                    {currentRequest?.id && (
                      <>
                        <button onClick={handleViewHistory} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm hover:bg-slate-50" title="History"><HistoryIcon /></button>
                        <button onClick={() => setModal("addToCol")} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm hover:bg-slate-50" title="Add to Collection"><FolderIcon /></button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-slate-200">
                <div className="flex gap-1 px-3">
                  {["headers", "body"].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`px-4 py-3 text-sm font-medium border-b-2 capitalize ${activeTab === tab ? "text-orange-500 border-orange-500" : "text-slate-500 border-transparent"}`}>
                      {tab}{tab === "headers" && headers.filter((h) => h.key).length > 0 && <span className="ml-2 px-1.5 py-0.5 text-xs bg-slate-100 rounded">{headers.filter((h) => h.key).length}</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 lg:p-4">
                {activeTab === "headers" && (
                  <div className="space-y-2">
                    {headers.map((h) => (
                      <div key={h.id} className="flex items-center gap-2">
                        <input type="checkbox" checked={h.enabled} onChange={(e) => updateHeader(h.id, "enabled", e.target.checked)} className="w-4 h-4 rounded text-orange-500" />
                        <input type="text" value={h.key} onChange={(e) => updateHeader(h.id, "key", e.target.value)} placeholder="Key" className="flex-1 min-w-0 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        <input type="text" value={h.value} onChange={(e) => updateHeader(h.id, "value", e.target.value)} placeholder="Value" className="flex-1 min-w-0 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        <button onClick={() => removeHeader(h.id)} className="p-2 text-slate-400 hover:text-red-500"><XIcon /></button>
                      </div>
                    ))}
                    <button onClick={addHeader} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-slate-700"><PlusIcon /> Add Header</button>
                  </div>
                )}
                {activeTab === "body" && (
                  <div className="space-y-3">
                    <div className="flex gap-4">
                      {["none", "json", "raw"].map((t) => (
                        <label key={t} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" value={t} checked={bodyType === t} onChange={(e) => setBodyType(e.target.value)} className="w-4 h-4 text-orange-500" />
                          <span className="text-sm capitalize">{t}</span>
                        </label>
                      ))}
                    </div>
                    {bodyType !== "none" && (
                      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder={bodyType === "json" ? '{\n  "key": "value"\n}' : "Enter body..."}
                        className="w-full h-40 px-4 py-3 bg-slate-900 text-slate-100 font-mono text-sm rounded-lg resize-none" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Response Viewer */}
            <div className="bg-white border border-slate-200 rounded-lg">
              <div className="p-3 lg:p-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-medium text-slate-900">Response</h3>
                {response && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className={`px-2 py-0.5 rounded-full font-medium ${getStatusColor(response.status)}`}>{response.status}</span>
                    <span className="text-slate-500">{response.duration} ms</span>
                  </div>
                )}
              </div>
              <div className="p-3 lg:p-4">
                {isExecuting ? (
                  <div className="flex items-center justify-center py-12"><Spinner /><p className="ml-3 text-sm text-slate-500">Sending...</p></div>
                ) : error ? (
                  <div className="text-center py-12">
                    <WarningIcon className="h-12 w-12 text-red-400 mx-auto mb-3" />
                    <p className="text-red-600 font-medium">Request Failed</p>
                    <p className="text-sm text-slate-500 mt-1">{error}</p>
                  </div>
                ) : response ? (
                  <div className="space-y-4">
                    <div className="flex gap-4 border-b border-slate-200">
                      {["body", "headers"].map((t) => (
                        <button key={t} onClick={() => setResponseTab(t)} className={`pb-2 text-sm font-medium border-b-2 capitalize ${responseTab === t ? "text-orange-500 border-orange-500" : "text-slate-500 border-transparent"}`}>{t}</button>
                      ))}
                    </div>
                    {responseTab === "body" && (
                      <div className="relative">
                        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm font-mono overflow-x-auto max-h-80">
                          {typeof response.data === "string" ? response.data : JSON.stringify(response.data, null, 2)}
                        </pre>
                        <button onClick={() => navigator.clipboard.writeText(typeof response.data === "string" ? response.data : JSON.stringify(response.data, null, 2))}
                          className="absolute top-2 right-2 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400" title="Copy"><CopyIcon /></button>
                      </div>
                    )}
                    {responseTab === "headers" && (
                      <div className="bg-slate-50 rounded-lg p-3 text-sm">
                        {Object.entries(response.headers || {}).map(([k, v]) => (
                          <div key={k} className="flex gap-2 py-1"><span className="font-medium text-slate-700">{k}:</span><span className="text-slate-600 break-all">{v}</span></div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <TerminalIcon className="h-12 w-12 mx-auto mb-3" />
                    <p>Enter a URL and click Send</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {modal === "save" && (
        <Modal onClose={() => setModal(null)} title="Save Request">
          <input type="text" value={requestName} onChange={(e) => setRequestName(e.target.value)} placeholder="Request name" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm mb-4" autoFocus />
          <ModalButtons onCancel={() => setModal(null)} onConfirm={handleSaveRequest} disabled={!requestName || isSaving} label={isSaving ? "Saving..." : "Save"} />
        </Modal>
      )}

      {modal === "collection" && (
        <Modal onClose={() => setModal(null)} title="New Collection">
          <input type="text" value={collectionName} onChange={(e) => setCollectionName(e.target.value)} placeholder="Collection name" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm mb-4" autoFocus />
          <ModalButtons onCancel={() => setModal(null)} onConfirm={handleCreateCollection} disabled={!collectionName} label="Create" />
        </Modal>
      )}

      {modal === "addToCol" && (
        <Modal onClose={() => setModal(null)} title="Add to Collection">
          <select value={selectedCollectionId} onChange={(e) => setSelectedCollectionId(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm mb-4">
            <option value="">Select collection</option>
            {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <ModalButtons onCancel={() => setModal(null)} onConfirm={handleAddToCollection} disabled={!selectedCollectionId} label="Add" />
        </Modal>
      )}

      {modal === "curl" && (
        <Modal onClose={() => { setModal(null); setImportError(""); setCurlInput(""); }} title="Import cURL">
          {importError && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{importError}</div>}
          <textarea value={curlInput} onChange={(e) => setCurlInput(e.target.value)} placeholder='curl -X GET "https://api.example.com/users"'
            className="w-full h-40 px-4 py-3 bg-slate-900 text-slate-100 font-mono text-sm rounded-lg resize-none mb-4" />
          <ModalButtons onCancel={() => { setModal(null); setCurlInput(""); }} onConfirm={handleImportCurl} disabled={!curlInput} label="Import" />
        </Modal>
      )}

      {modal === "postman" && (
        <Modal onClose={() => { setModal(null); setImportError(""); setPostmanInput(""); }} title="Import Postman Collection">
          {importError && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{importError}</div>}
          <p className="text-sm text-slate-500 mb-3">Paste Postman Collection v2 JSON:</p>
          <textarea value={postmanInput} onChange={(e) => setPostmanInput(e.target.value)} placeholder='{"info": {"name": "..."}, "item": [...]}'
            className="w-full h-40 px-4 py-3 bg-slate-900 text-slate-100 font-mono text-sm rounded-lg resize-none mb-4" />
          <ModalButtons onCancel={() => { setModal(null); setPostmanInput(""); }} onConfirm={handleImportPostman} disabled={!postmanInput} label="Import" />
        </Modal>
      )}

      {modal === "env" && (
        <Modal onClose={() => { setModal(null); setImportError(""); setEnvName(""); setEnvVariables(""); }} title="New Environment">
          {importError && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{importError}</div>}
          <input type="text" value={envName} onChange={(e) => setEnvName(e.target.value)} placeholder="Environment name" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm mb-3" autoFocus />
          <p className="text-sm text-slate-500 mb-2">Variables (JSON):</p>
          <textarea value={envVariables} onChange={(e) => setEnvVariables(e.target.value)} placeholder='{"BASE_URL": "https://api.example.com", "TOKEN": "abc123"}'
            className="w-full h-32 px-4 py-3 bg-slate-900 text-slate-100 font-mono text-sm rounded-lg resize-none mb-4" />
          <ModalButtons onCancel={() => { setModal(null); setEnvName(""); setEnvVariables(""); }} onConfirm={handleCreateEnvironment} disabled={!envName} label="Create" />
        </Modal>
      )}

      {modal === "history" && (
        <Modal onClose={() => setModal(null)} title="Execution History" wide>
          {executions.length === 0 ? <p className="text-sm text-slate-500 text-center py-8">No history</p> : (
            <div className="max-h-96 overflow-y-auto">
              {executions.map((exec) => (
                <div key={exec.id} className="border-b border-slate-100 py-3 last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exec.status)}`}>{exec.status}</span>
                    <span className="text-sm text-slate-500">{exec.duration} ms</span>
                    <span className="text-xs text-slate-400">{new Date(exec.executed_at).toLocaleString()}</span>
                  </div>
                  <details className="text-sm">
                    <summary className="cursor-pointer text-slate-600 hover:text-slate-900">View Response</summary>
                    <pre className="mt-2 bg-slate-900 text-slate-100 p-3 rounded-lg text-xs overflow-x-auto max-h-40">{exec.response_body}</pre>
                  </details>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

// Components
function Spinner({ small }) {
  return <svg className={`animate-spin ${small ? "h-4 w-4" : "h-8 w-8"} text-orange-500`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>;
}

function Modal({ onClose, title, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white rounded-xl shadow-xl ${wide ? "w-full max-w-2xl" : "w-full max-w-md"} p-6 animate-fade-in`}>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function ModalButtons({ onCancel, onConfirm, disabled, label }) {
  return (
    <div className="flex gap-3 justify-end">
      <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
      <button onClick={onConfirm} disabled={disabled} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 disabled:opacity-50">{label}</button>
    </div>
  );
}

function Sidebar({ sidebarTab, setSidebarTab, requests, collections, environments, isLoading, collectionsLoading, envsLoading, handleNewRequest, handleSelectRequest, handleDeleteRequest, handleDeleteEnv, setModal, closeMobile }) {
  return (
    <>
      {closeMobile && <div className="p-3 border-b flex justify-end lg:hidden"><button onClick={closeMobile} className="p-2 hover:bg-slate-100 rounded-lg"><XIcon /></button></div>}
      <div className="p-3">
        <button onClick={handleNewRequest} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium text-sm">
          <PlusIcon /> New Request
        </button>
      </div>
      <div className="px-3">
        <div className="flex bg-slate-100 rounded-lg p-1">
          {["requests", "collections", "environments"].map((t) => (
            <button key={t} onClick={() => setSidebarTab(t)} className={`flex-1 py-1.5 text-xs font-medium rounded-md capitalize ${sidebarTab === t ? "bg-white shadow-sm" : "text-slate-500"}`}>
              {t.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {sidebarTab === "requests" && (
          isLoading ? <div className="flex justify-center py-8"><Spinner /></div> :
          requests.length === 0 ? <p className="text-sm text-slate-400 text-center py-4">No requests</p> :
          <div className="space-y-1">
            {requests.map((req) => (
              <button key={req.id} onClick={() => handleSelectRequest(req)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-left group">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${METHOD_COLORS[req.method]}`}>{req.method}</span>
                <span className="text-sm text-slate-700 truncate flex-1">{req.name}</span>
                <TrashIcon onClick={(e) => handleDeleteRequest(e, req.id)} className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500" />
              </button>
            ))}
          </div>
        )}
        {sidebarTab === "collections" && (
          collectionsLoading ? <div className="flex justify-center py-8"><Spinner /></div> :
          collections.length === 0 ? <p className="text-sm text-slate-400 text-center py-4">No collections</p> :
          <div className="space-y-1">
            {collections.map((col) => (
              <div key={col.id} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50">
                <FolderIcon className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-700">{col.name}</span>
              </div>
            ))}
          </div>
        )}
        {sidebarTab === "environments" && (
          envsLoading ? <div className="flex justify-center py-8"><Spinner /></div> :
          environments.length === 0 ? <p className="text-sm text-slate-400 text-center py-4">No environments</p> :
          <div className="space-y-1">
            {environments.map((env) => (
              <div key={env.id} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 group">
                <GlobeIcon className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-700 flex-1">{env.name}</span>
                <TrashIcon onClick={(e) => handleDeleteEnv(e, env.id)} className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 cursor-pointer" />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-3 border-t border-slate-200 space-y-1">
        {sidebarTab === "collections" && <SidebarBtn onClick={() => setModal("collection")} icon={<PlusIcon />} label="New Collection" />}
        {sidebarTab === "environments" && <SidebarBtn onClick={() => setModal("env")} icon={<PlusIcon />} label="New Environment" />}
        <SidebarBtn onClick={() => setModal("curl")} icon={<TerminalIcon className="h-4 w-4" />} label="Import cURL" />
        <SidebarBtn onClick={() => setModal("postman")} icon={<UploadIcon />} label="Import Postman" />
      </div>
    </>
  );
}

function SidebarBtn({ onClick, icon, label }) {
  return <button onClick={onClick} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">{icon}{label}</button>;
}

// Icons
const MenuIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const BoltIcon = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const LogoutIcon = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const SendIcon = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>;
const PlusIcon = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const XIcon = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const HistoryIcon = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const FolderIcon = ({ className }) => <svg className={className || "h-4 w-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
const CopyIcon = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const TerminalIcon = ({ className }) => <svg className={className || "h-4 w-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const WarningIcon = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const TrashIcon = ({ onClick, className }) => <svg onClick={onClick} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const UploadIcon = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const GlobeIcon = ({ className }) => <svg className={className || "h-4 w-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;