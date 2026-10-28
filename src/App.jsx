import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/AppShell.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Messages from './pages/Messages.jsx'
import Chat from './pages/Chat.jsx'
import VoiceCall from './pages/VoiceCall.jsx'
import VideoCall from './pages/VideoCall.jsx'
import CommunityList from './pages/CommunityList.jsx'
import CommunityFeed from './pages/CommunityFeed.jsx'
import NewPost from './pages/NewPost.jsx'
import AskPharmacist from './pages/AskPharmacist.jsx'
import ShareReview from './pages/ShareReview.jsx'
import Orders from './pages/Orders.jsx'
import Profile from './pages/Profile.jsx'
import PrivacySecurity from './pages/PrivacySecurity.jsx'
import SecurityCheckup from './pages/SecurityCheckup.jsx'
import PersonalInformation from './pages/PersonalInformation.jsx'
import SavedAddresses from './pages/SavedAddresses.jsx'
import NotificationSettings from './pages/NotificationSettings.jsx'
import PharmacistStep1 from './pages/PharmacistStep1.jsx'
import PharmacistStep2 from './pages/PharmacistStep2.jsx'
import PharmacistStep3 from './pages/PharmacistStep3.jsx'
import HealthTips from './pages/HealthTips.jsx'
import TipsCategory from './pages/TipsCategory.jsx'
import TipPost from './pages/TipPost.jsx'
import Welcome from './pages/Welcome.jsx'
import Scanner from './pages/Scanner.jsx'
import ManualEntry from './pages/ManualEntry.jsx'
import Verify from './pages/Verify.jsx'
import OrderConfirmed from './pages/OrderConfirmed.jsx'
import Login from './pages/Login.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/welcome" replace />} />

      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/community" element={<CommunityList />} />
        <Route path="/community/new" element={<NewPost />} />
        <Route path="/community/:id" element={<CommunityFeed />} />
        <Route path="/ask-pharmacist" element={<AskPharmacist />} />
        <Route path="/share-review" element={<ShareReview />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings/privacy" element={<PrivacySecurity />} />
        <Route path="/settings/personal-info" element={<PersonalInformation />} />
        <Route path="/settings/addresses" element={<SavedAddresses />} />
        <Route path="/settings/notifications" element={<NotificationSettings />} />
        <Route path="/tips" element={<HealthTips />} />
        <Route path="/tips/:categoryId" element={<TipsCategory />} />
        <Route path="/tips/:categoryId/:tipId" element={<TipPost />} />
      </Route>

      <Route
        path="/settings/privacy/checkup"
        element={<SecurityCheckup />}
      />

      <Route path="/pharmacist/register" element={<PharmacistStep1 />} />
      <Route
        path="/pharmacist/register/credentials"
        element={<PharmacistStep2 />}
      />
      <Route
        path="/pharmacist/register/review"
        element={<PharmacistStep3 />}
      />

      <Route path="/messages/:chatId" element={<Chat />} />
      <Route path="/messages/:chatId/call" element={<VoiceCall />} />
      <Route path="/messages/:chatId/video-call" element={<VideoCall />} />

      <Route path="/welcome" element={<Welcome />} />
      <Route path="/order/scan" element={<Scanner />} />
      <Route path="/order/manual" element={<ManualEntry />} />
      <Route path="/order/verify" element={<Verify />} />
      <Route path="/order/confirmed" element={<OrderConfirmed />} />
      <Route path="/login" element={<Login />} />

      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  )
}
