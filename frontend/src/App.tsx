import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LayoutDashboard, Users, Droplets, Calendar, ClipboardList, Building2, Heart, User, Lock } from "lucide-react";
import { useAuthSession } from "@/lib/auth-session";
import type { UserRole } from "@/types";

// Public pages
import Landing from "@/pages/public/Landing";
import AuthenticatedHome from "@/pages/public/AuthenticatedHome";
import About from "@/pages/public/About";
import CampSchedule from "@/pages/public/CampSchedule";
import Contact from "@/pages/public/Contact";
import PrivacyPolicy from "@/pages/public/PrivacyPolicy";
import TermsOfService from "@/pages/public/TermsOfService";

// Auth pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import OTPVerification from "@/pages/auth/OTPVerification";
import ForgotPassword from "@/pages/auth/ForgotPassword";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageDonors from "@/pages/admin/ManageDonors";
import ManageRecipients from "@/pages/admin/ManageRecipients";
import ManageHospitals from "@/pages/admin/ManageHospitals";
import ManageCamps from "@/pages/admin/ManageCamps";
import ManageStock from "@/pages/admin/ManageStock";
import ManageRequests from "@/pages/admin/ManageRequests";
import AdminProfile from "@/pages/admin/AdminProfile";

// Donor pages
import DonorDashboard from "@/pages/donor/DonorDashboard";
import DonorProfile from "@/pages/donor/DonorProfile";
import DonorCamps from "@/pages/donor/DonorCamps";
import DonorRequestDonation from "@/pages/donor/DonorRequestDonation";
import DonorChangePassword from "@/pages/donor/DonorChangePassword";

// Recipient pages
import RecipientDashboard from "@/pages/recipient/RecipientDashboard";
import RecipientProfile from "@/pages/recipient/RecipientProfile";
import RecipientRequestBlood from "@/pages/recipient/RecipientRequestBlood";
import RecipientBloodStock from "@/pages/recipient/RecipientBloodStock";
import RecipientChangePassword from "@/pages/recipient/RecipientChangePassword";

// Hospital pages
import HospitalDashboard from "@/pages/hospital/HospitalDashboard";
import HospitalProfile from "@/pages/hospital/HospitalProfile";
import HospitalRequestBlood from "@/pages/hospital/HospitalRequestBlood";
import HospitalBloodStock from "@/pages/hospital/HospitalBloodStock";
import HospitalChangePassword from "@/pages/hospital/HospitalChangePassword";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const adminNav = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Donors", path: "/admin/donors", icon: Users },
  { label: "Recipients", path: "/admin/recipients", icon: Heart },
  { label: "Hospitals", path: "/admin/hospitals", icon: Building2 },
  { label: "Camps", path: "/admin/camps", icon: Calendar },
  { label: "Blood Stock", path: "/admin/stock", icon: Droplets },
  { label: "Requests", path: "/admin/requests", icon: ClipboardList },
  { label: "Profile", path: "/admin/profile", icon: User },
];

const donorNav = [
  { label: "Dashboard", path: "/donor/dashboard", icon: LayoutDashboard },
  { label: "Camps", path: "/donor/camps", icon: Calendar },
  { label: "Request Donation", path: "/donor/request-donation", icon: Heart },
  { label: "Profile", path: "/donor/profile", icon: User },
  { label: "Change Password", path: "/donor/change-password", icon: Lock },
];

const recipientNav = [
  { label: "Dashboard", path: "/recipient/dashboard", icon: LayoutDashboard },
  { label: "Request Blood", path: "/recipient/request-blood", icon: Droplets },
  { label: "Blood Stock", path: "/recipient/blood-stock", icon: ClipboardList },
  { label: "Profile", path: "/recipient/profile", icon: User },
  { label: "Change Password", path: "/recipient/change-password", icon: Lock },
];

const hospitalNav = [
  { label: "Dashboard", path: "/hospital/dashboard", icon: LayoutDashboard },
  { label: "Request Blood", path: "/hospital/request-blood", icon: Droplets },
  { label: "Blood Stock", path: "/hospital/blood-stock", icon: ClipboardList },
  { label: "Profile", path: "/hospital/profile", icon: User },
  { label: "Change Password", path: "/hospital/change-password", icon: Lock },
];

function ProtectedHome({ role }: { role: UserRole }) {
  const session = useAuthSession();
  if (!session) return <Navigate to="/login" replace />;
  if (session.user.role !== role) return <Navigate to={`/${session.user.role}`} replace />;
  return <AuthenticatedHome />;
}

function ProtectedLayout({ role, navItems }: { role: UserRole; navItems: typeof adminNav }) {
  const session = useAuthSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (session.user.role !== role) {
    return <Navigate to={`/${session.user.role}`} replace />;
  }

  return (
    <DashboardLayout role={role} userName={session.user.full_name} navItems={navItems} />
  );
}

function AppRoutes() {
  const session = useAuthSession();

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={session ? <Navigate to={`/${session.user.role}`} replace /> : <Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/camps" element={<CampSchedule />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />

      {/* Auth */}
      <Route path="/login" element={session ? <Navigate to={`/${session.user.role}`} replace /> : <Login />} />
      <Route path="/register" element={session ? <Navigate to={`/${session.user.role}`} replace /> : <Register />} />
      <Route path="/verify-otp" element={<OTPVerification />} />
      <Route path="/forgot-password" element={session ? <Navigate to={`/${session.user.role}`} replace /> : <ForgotPassword />} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedHome role="admin" />} />
      <Route element={<ProtectedLayout role="admin" navItems={adminNav} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/donors" element={<ManageDonors />} />
        <Route path="/admin/recipients" element={<ManageRecipients />} />
        <Route path="/admin/hospitals" element={<ManageHospitals />} />
        <Route path="/admin/camps" element={<ManageCamps />} />
        <Route path="/admin/stock" element={<ManageStock />} />
        <Route path="/admin/requests" element={<ManageRequests />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
      </Route>

      {/* Donor */}
      <Route path="/donor" element={<ProtectedHome role="donor" />} />
      <Route element={<ProtectedLayout role="donor" navItems={donorNav} />}>
        <Route path="/donor/dashboard" element={<DonorDashboard />} />
        <Route path="/donor/camps" element={<DonorCamps />} />
        <Route path="/donor/request-donation" element={<DonorRequestDonation />} />
        <Route path="/donor/profile" element={<DonorProfile />} />
        <Route path="/donor/change-password" element={<DonorChangePassword />} />
      </Route>

      {/* Recipient */}
      <Route path="/recipient" element={<ProtectedHome role="recipient" />} />
      <Route element={<ProtectedLayout role="recipient" navItems={recipientNav} />}>
        <Route path="/recipient/dashboard" element={<RecipientDashboard />} />
        <Route path="/recipient/request-blood" element={<RecipientRequestBlood />} />
        <Route path="/recipient/blood-stock" element={<RecipientBloodStock />} />
        <Route path="/recipient/profile" element={<RecipientProfile />} />
        <Route path="/recipient/change-password" element={<RecipientChangePassword />} />
      </Route>

      {/* Hospital */}
      <Route path="/hospital" element={<ProtectedHome role="hospital" />} />
      <Route element={<ProtectedLayout role="hospital" navItems={hospitalNav} />}>
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/hospital/request-blood" element={<HospitalRequestBlood />} />
        <Route path="/hospital/blood-stock" element={<HospitalBloodStock />} />
        <Route path="/hospital/profile" element={<HospitalProfile />} />
        <Route path="/hospital/change-password" element={<HospitalChangePassword />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
