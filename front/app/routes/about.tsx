import { useTranslation } from 'react-i18next';
import { SiGithub } from 'react-icons/si';
import { Link } from 'react-router';
import AppLogo from '~/components/app-logo';

const sections = [
  // {
  //   key: 'helpfulLinks',
  //   links: [
  //     { key: 'contact', href: '/contact' },
  //     { key: 'faqs', href: '/faqs' },
  //   ],
  // },
  {
    key: 'legal',
    links: [{ key: 'privacyPolicy', href: '/privacy-policy' }],
  },
];

const socialLinks = [
  {
    key: 'github',
    icon: SiGithub,
    name: 'GitHub',
    href: 'https://github.com/zp1ke/flo',
  },
];

export default function About() {
  const { t } = useTranslation();

  return (
    <footer className="container mx-auto py-16">
      <div className="space-y-8 px-4 sm:px-6 lg:space-y-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Logo and Description */}
          <div>
            <Link to="/" className="flex items-center gap-1 text-primary">
              <AppLogo className="size-8" />
              <span className="text-xl font-bold ml-2">{t('app.title')}</span>
            </Link>
            <p className="mt-4 max-w-xs text-muted-foreground">
              {t('about.description')}
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
                <p className="font-medium text-foreground">
                  {t(`about.${section.key}`)}
                </p>
                <ul className="mt-6 space-y-4 text-sm">
                  {section.links.map((link) => (
                    <li key={link.key}>
                      <a
                        href={link.href}
                        className="text-muted-foreground transition hover:text-primary"
                      >
                        {t(`about.${link.key}`)}
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
