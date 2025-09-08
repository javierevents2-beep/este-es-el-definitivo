import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Logo from '../ui/Logo';
import CartIcon from '../cart/CartIcon';
import { useFeatureFlags } from '../../contexts/FeatureFlagsContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(Boolean(typeof window !== 'undefined' && localStorage.getItem('site_admin_mode')));
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const handler = (e: Event | any) => {
      const val = e?.detail ?? (localStorage.getItem('site_admin_mode') ? true : false);
      setIsAdmin(Boolean(val));
    };
    window.addEventListener('siteAdminModeChanged', handler as EventListener);
    window.addEventListener('storage', handler as EventListener);
    return () => {
      window.removeEventListener('siteAdminModeChanged', handler as EventListener);
      window.removeEventListener('storage', handler as EventListener);
    };
  }, []);

  const notifyAdminChange = (val: boolean) => {
    try {
      if (val) localStorage.setItem('site_admin_mode', '1'); else localStorage.removeItem('site_admin_mode');
    } catch (_) {}
    window.dispatchEvent(new CustomEvent('siteAdminModeChanged', { detail: val }));
    setIsAdmin(val);
  };

  const toggleAdminFromHeader = () => {
    if (!isAdmin) {
      const adminPassword = prompt('Senha de administrador:');
      if (adminPassword === '1234') {
        notifyAdminChange(true);
        navigate('/store');
      } else if (adminPassword !== null) {
        alert('Senha incorreta');
      }
    } else {
      notifyAdminChange(false);
    }
  };

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
                    onClick={toggleAdminFromHeader}
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
            <button onClick={toggleAdminFromHeader} aria-label="Admin" title={isAdmin ? 'Salir modo admin' : 'Modo administrador'}>
              {isAdmin ? <EyeOff size={20} className="text-white" aria-hidden="true" /> : <Eye size={20} className="text-white" aria-hidden="true" />}
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
                      onClick={toggleAdminFromHeader}
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
                <button onClick={toggleAdminFromHeader} aria-label="Admin" title={isAdmin ? 'Salir modo admin' : 'Modo administrador'}>
                  {isAdmin ? <EyeOff size={24} className="text-primary" aria-hidden="true" /> : <Eye size={24} className="text-primary" aria-hidden="true" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


    </header>
  );
};

export default Header;
