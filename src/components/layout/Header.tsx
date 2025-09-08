import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Logo from '../ui/Logo';
import CartIcon from '../cart/CartIcon';
import { useFeatureFlags } from '../../contexts/FeatureFlagsContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  const handleBooking = () => {
    const message = t('nav.bookMessage');
    window.open(`https://wa.me/5541984875565?text=${encodeURIComponent(message)}`, '_blank');
  };

  const { flags } = useFeatureFlags();
  const navLinks = useMemo(() => {
    const links: { name: string; path?: string; action?: () => void; key?: string }[] = [
      { name: t('nav.home'), path: '/', key: 'home' },
      { name: t('nav.portfolio'), path: '/portfolio', key: 'portfolio' },
      { name: t('nav.store'), path: '/store', key: 'store' },
      { name: t('nav.book'), action: handleBooking, key: 'booking' },
      { name: t('nav.contact'), path: '/contact', key: 'contact' },
      { name: 'Admin', path: '/packages-admin', key: 'admin' },
    ];
    return links.filter(l => !l.key || flags.pages[l.key as keyof typeof flags.pages]);
  }, [t, flags]);

  const isHomePage = location.pathname === '/';

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled || !isHomePage
          ? 'bg-primary py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        {flags.pages.home ? (
          <Link to="/" className="z-50">
            <Logo dark={false} />
          </Link>
        ) : (
          <div className="z-50">
            <Logo dark={false} />
          </div>
        )}

        <nav className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                {link.key === 'admin' ? (
                  <button
                    onClick={() => setShowAdminKeyModal(true)}
                    className="font-lato text-sm tracking-wide uppercase text-white hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </button>
                ) : link.path ? (
                  <Link
                    to={link.path}
                    className="font-lato text-sm tracking-wide uppercase text-white hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <button
                    onClick={link.action}
                    className="font-lato text-sm tracking-wide uppercase text-white hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </button>
                )}
              </li>
            ))}
          </ul>
          <div className="flex items-center space-x-6 text-white">
            <CartIcon />
            <button onClick={() => setShowAdminKeyModal(true)} aria-label="Admin">
              <Eye size={20} className="text-white" aria-hidden="true" />
            </button>
          </div>
        </nav>

        <div className="md:hidden flex items-center space-x-4">
          <CartIcon />
          <button 
            className="z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-primary" />
            ) : (
              <Menu size={24} className="text-white" />
            )}
          </button>
        </div>

        <div className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col h-full pt-24 px-6">
            <ul className="flex flex-col space-y-6 text-center">
              {navLinks.map((link) => (
                <li key={link.name}>
                  {link.key === 'admin' ? (
                    <button
                      onClick={() => setShowAdminKeyModal(true)}
                      className="text-primary font-lato text-lg uppercase tracking-wide hover:text-secondary transition-colors"
                    >
                      {link.name}
                    </button>
                  ) : link.path ? (
                    <Link
                      to={link.path}
                      className="text-primary font-lato text-lg uppercase tracking-wide hover:text-secondary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <button
                      onClick={link.action}
                      className="text-primary font-lato text-lg uppercase tracking-wide hover:text-secondary transition-colors"
                    >
                      {link.name}
                    </button>
                  )}
                </li>
              ))}
              
            </ul>
            <div className="mt-auto pb-10">
              <div className="mt-6 flex justify-center">
                <button onClick={() => setShowAdminKeyModal(true)} aria-label="Admin">
                  <Eye size={24} className="text-primary" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAdminKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-md max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Acceso a Panel de Administración</h3>
            <p className="text-sm text-gray-600 mb-4">Introduce la clave para acceder al panel de tienda.</p>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
              placeholder="Clave de acceso"
            />
            {adminError && <div className="text-red-500 text-sm mb-2">{adminError}</div>}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => { setShowAdminKeyModal(false); setAdminKey(''); setAdminError(''); }}
                className="px-4 py-2 border rounded"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!adminKey) { setAdminError('Introduce la clave'); return; }
                  const url = `${externalAdminUrl}?key=${encodeURIComponent(adminKey)}`;
                  window.open(url, '_blank');
                  setShowAdminKeyModal(false);
                  setAdminKey('');
                  setAdminError('');
                }}
                className="px-4 py-2 bg-primary text-white rounded"
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};

export default Header;
