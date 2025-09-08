import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { FeatureFlagsProvider } from './contexts/FeatureFlagsContext';
import GuardedRoute from './components/ui/GuardedRoute';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ui/ScrollToTop';
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import PortraitPage from './pages/PortraitPage';
import MaternityPage from './pages/MaternityPage';
import EventsPage from './pages/EventsPage';
import ContactPage from './pages/ContactPage';
import StorePage from './pages/StorePage';
import AdminPage from './pages/AdminPage';
import BookingPage from './pages/BookingPage';
import ClientDashboardPage from './pages/ClientDashboardPage';
import PackagesAdminPage from './pages/PackagesAdminPage';
import AdminStorePage from './pages/AdminStorePage';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FeatureFlagsProvider>
          <Router>
            <ScrollToTop />
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/portfolio" element={<GuardedRoute page="portfolio"><PortfolioPage /></GuardedRoute>} />
                <Route path="/portrait" element={<GuardedRoute page="portrait"><PortraitPage /></GuardedRoute>} />
                <Route path="/maternity" element={<GuardedRoute page="maternity"><MaternityPage /></GuardedRoute>} />
                <Route path="/events" element={<GuardedRoute page="events"><EventsPage /></GuardedRoute>} />
                <Route path="/contact" element={<GuardedRoute page="contact"><ContactPage /></GuardedRoute>} />
                <Route path="/booking" element={<GuardedRoute page="booking"><BookingPage /></GuardedRoute>} />
                <Route path="/store" element={<GuardedRoute page="store"><StorePage /></GuardedRoute>} />
                <Route path="/admin" element={<GuardedRoute page="admin"><AdminPage /></GuardedRoute>} />
                <Route path="/dashboard" element={<GuardedRoute page="clientDashboard"><ClientDashboardPage /></GuardedRoute>} />
                <Route path="/packages-admin" element={<GuardedRoute page="packagesAdmin"><PackagesAdminPage /></GuardedRoute>} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </Layout>
          </Router>
        </FeatureFlagsProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
