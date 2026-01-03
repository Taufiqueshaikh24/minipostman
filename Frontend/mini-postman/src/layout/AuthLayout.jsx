// import { Outlet } from "react-router-dom";

// export default function AuthLayout() {
//   return (
//     <div className="min-h-screen bg-slate-50 flex">
//       {/* Left side - Branding */}
//       <div className="hidden lg:flex lg:w-1/2 bg-orange-500 p-12 flex-col justify-between">
//         <div>
//           {/* Logo */}
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6 text-white"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M13 10V3L4 14h7v7l9-11h-7z"
//                 />
//               </svg>
//             </div>
//             <span className="text-2xl font-bold text-white">Mini Postman</span>
//           </div>
//         </div>

//         {/* Center content */}
//         <div className="space-y-6">
//           <h1 className="text-4xl font-bold text-white leading-tight">
//             Test your APIs <br />
//             with ease
//           </h1>
//           <p className="text-white/80 text-lg max-w-md">
//             A lightweight API testing tool. Create, save, and manage your API
//             requests all in one place.
//           </p>
          
//           {/* Features list */}
//           <div className="space-y-4 pt-4">
//             <div className="flex items-center gap-3 text-white/90">
//               <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//               <span>Send GET, POST, PUT, DELETE requests</span>
//             </div>
//             <div className="flex items-center gap-3 text-white/90">
//               <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//               <span>Save and organize your requests</span>
//             </div>
//             <div className="flex items-center gap-3 text-white/90">
//               <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//               <span>Import from cURL & Postman collections</span>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <p className="text-white/60 text-sm">
//           © 2024 Mini Postman. All rights reserved.
//         </p>
//       </div>

//       {/* Right side - Auth Form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
//         <div className="w-full max-w-md">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// }





























import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { checkAuth } from "./store/authSlice";

// Pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";

// Auth Layout
function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-slate-100 flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-orange-500 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">Mini Postman</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Test APIs with ease
          </h1>
          <p className="text-orange-100 text-lg">
            A simple, powerful API testing tool. Send requests, save them, organize into collections.
          </p>
        </div>
        <p className="text-orange-200 text-sm">© 2024 Mini Postman</p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}