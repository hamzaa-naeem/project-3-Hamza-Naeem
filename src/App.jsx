import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import Toast from './components/shared/Toast';
import ProtectedRoute from './components/shared/ProtectedRoute.jsx';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import TicketPage from './pages/TicketPage';
import MyBookingsPage from './pages/MyBookingsPage';
import SupportPage from './pages/SupportPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useToast } from './hooks/useToast';

function AppContent() {
  const [currentBooking, setCurrentBooking] = useState(null);
  const [lastTicket, setLastTicket]         = useState(null);
  const { toast, showToast }                = useToast();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Toast toast={toast} />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                setCurrentBooking={setCurrentBooking}
                showToast={showToast}
              />
            }
          />
          <Route path="/login" element={<LoginPage showToast={showToast} />} />
          <Route path="/register" element={<RegisterPage showToast={showToast} />} />
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <BookingPage
                  booking={currentBooking}
                  setLastTicket={setLastTicket}
                  showToast={showToast}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ticket"
            element={
              <ProtectedRoute>
                <TicketPage ticket={lastTicket} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mybookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage
                  setLastTicket={setLastTicket}
                  showToast={showToast}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <SupportPage showToast={showToast} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminPage showToast={showToast} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
