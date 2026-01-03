import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchRequests,
  fetchCollections,
  deleteRequest,
  setCurrentRequest,
  selectRequests,
  selectCollections,
  selectRequestsLoading,
  selectCollectionsLoading,
} from "../../store/slices";

export default function Sidebar({ onImportCurl, onImportCollection }) {
  const dispatch = useAppDispatch();

  const requests = useAppSelector(selectRequests);
  const collections = useAppSelector(selectCollections);
  const requestsLoading = useAppSelector(selectRequestsLoading);
  const collectionsLoading = useAppSelector(selectCollectionsLoading);

  const [activeTab, setActiveTab] = useState("requests");

  useEffect(() => {
    dispatch(fetchRequests());
    dispatch(fetchCollections());
  }, [dispatch]);

  const handleSelectRequest = (request) => {
    dispatch(setCurrentRequest(request));
  };

  const handleDeleteRequest = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this request?")) {
      dispatch(deleteRequest(id));
    }
  };

  const handleNewRequest = () => {
    dispatch(setCurrentRequest(null));
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: "text-green-600 bg-green-50",
      POST: "text-yellow-600 bg-yellow-50",
      PUT: "text-blue-600 bg-blue-50",
      PATCH: "text-purple-600 bg-purple-50",
      DELETE: "text-red-600 bg-red-50",
    };
    return colors[method] || "text-slate-600 bg-slate-50";
  };

  const isLoading = requestsLoading || collectionsLoading;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="text-lg font-bold text-slate-900">Mini Postman</span>
        </div>
      </div>

      {/* New Request Button */}
      <div className="p-3">
        <button
          onClick={handleNewRequest}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm"
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
          New Request
        </button>
      </div>

      {/* Tabs */}
      <div className="px-3">
        <div className="flex bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === "requests"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Requests
          </button>
          <button
            onClick={() => setActiveTab("collections")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === "collections"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Collections
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <svg
              className="animate-spin h-5 w-5 text-orange-500"
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
          </div>
        ) : activeTab === "requests" ? (
          <div className="space-y-1">
            {requests.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">
                No saved requests
              </p>
            ) : (
              requests.map((request) => (
                <button
                  key={request.id}
                  onClick={() => handleSelectRequest(request)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left group"
                >
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getMethodColor(
                      request.method
                    )}`}
                  >
                    {request.method}
                  </span>
                  <span className="text-sm text-slate-700 truncate flex-1">
                    {request.name}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    onClick={(e) => handleDeleteRequest(e, request.id)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {collections.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">
                No collections
              </p>
            ) : (
              collections.map((collection) => (
                <button
                  key={collection.id}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                  <span className="text-sm text-slate-700 font-medium">
                    {collection.name}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-slate-200 space-y-2">
        <button
          onClick={onImportCollection}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          Import Collection
        </button>
        <button
          onClick={onImportCurl}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
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
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Import cURL
        </button>
      </div>
    </aside>
  );
}