import { useTranslation } from 'react-i18next';
import {
  SiDribbble,
  SiFacebook,
  SiGithub,
  SiInstagram,
  SiX,
  SiYoutube,
} from 'react-icons/si';
import { Link } from 'react-router';
import { useTheme } from '~/contexts/theme-provider';

const sections = [
  {
    key: 'services',
    title: 'Services',
    links: [
      { key: '1on1-coaching', name: '1on1 Coaching', href: '#' },
      { key: 'company-review', name: 'Company Review', href: '#' },
      { key: 'accounts-review', name: 'Accounts Review', href: '#' },
      { key: 'hr-consulting', name: 'HR Consulting', href: '#' },
      { key: 'seo-optimisation', name: 'SEO Optimisation', href: '#' },
    ],
  },
  {
    key: 'company',
    title: 'Company',
    links: [
      { key: 'about', name: 'About', href: '#' },
      { key: 'meet-the-team', name: 'Meet the Team', href: '#' },
      { key: 'accounts-review', name: 'Accounts Review', href: '#' },
    ],
  },
  {
    key: 'helpful-links',
    title: 'Helpful Links',
    links: [
      { key: 'contact', name: 'Contact', href: '#' },
      { key: 'faqs', name: 'FAQs', href: '#' },
      { key: 'live-chat', name: 'Live Chat', href: '#' },
    ],
  },
  {
    key: 'legal',
    title: 'Legal',
    links: [
      { key: 'accessibility', name: 'Accessibility', href: '#' },
      { key: 'returns-policy', name: 'Returns Policy', href: '#' },
      { key: 'refund-policy', name: 'Refund Policy', href: '#' },
      { key: 'hiring-statistics', name: 'Hiring Statistics', href: '#' },
    ],
  },
];

const socialLinks = [
  { key: 'twitter', icon: SiX, name: 'Twitter', href: '#' },
  { key: 'instagram', icon: SiInstagram, name: 'Instagram', href: '#' },
  { key: 'youtube', icon: SiYoutube, name: 'YouTube', href: '#' },
  { key: 'facebook', icon: SiFacebook, name: 'Facebook', href: '#' },
  { key: 'github', icon: SiGithub, name: 'GitHub', href: '#' },
  { key: 'dribbble', icon: SiDribbble, name: 'Dribbble', href: '#' },
];

export default function About() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <footer className="container mx-auto py-16">
      <div className="space-y-8 px-4 sm:px-6 lg:space-y-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Logo and Description */}
          <div>
            <Link to="/" className="flex items-center gap-1 text-primary">
              {theme === 'light' && (
                <img
                  src="/apple-touch-icon-light.png"
                  alt={t('app.name')}
                  className="size-[32px] object-cover"
                />
              )}
              {theme === 'dark' && (
                <img
                  src="/apple-touch-icon-dark.png"
                  alt={t('app.name')}
                  className="size-[32px] object-cover"
                />
              )}
              {theme === 'system' && (
                <picture className="size-[32px] object-cover">
                  <source
                    srcSet="/apple-touch-icon-dark.png"
                    media="(prefers-color-scheme: dark)"
                  />
                  <source
                    srcSet="/apple-touch-icon-light.png"
                    media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)"
                  />
                  <img src="/apple-touch-icon-light.png" alt={t('app.name')} />
                </picture>
              )}
              <span className="text-xl font-bold ml-2">{t('app.title')}</span>
            </Link>
            <p className="mt-4 max-w-xs text-muted-foreground text-justify">
              {t('app.description')}
            </p>

            {/* Social Links */}
            <ul className="mt-8 flex gap-6">
              {socialLinks.map(({ key, icon: Icon, name, href }) => (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={name}
                    className="text-muted-foreground transition hover:text-primary"
                  >
                    <Icon className="w-6 h-6" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Sections */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
            {sections.map((section) => (
              <div key={section.key}>
                <p className="font-medium text-foreground">{section.title}</p>
                <ul className="mt-6 space-y-4 text-sm">
                  {section.links.map((link) => (
                    <li key={link.key}>
                      <a
                        href={link.href}
                        className="text-muted-foreground transition hover:text-primary"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          &copy; 2025. {t('app.title')}
        </p>
      </div>
    </footer>
  );
}
