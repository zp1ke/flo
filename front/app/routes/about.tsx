import { Rocket } from 'lucide-react';
import {
  SiDribbble,
  SiFacebook,
  SiGithub,
  SiInstagram,
  SiX,
  SiYoutube,
} from 'react-icons/si';
import { Link } from 'react-router';

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
  return (
    <footer className="container mx-auto py-16">
      <div className="space-y-8 px-4 sm:px-6 lg:space-y-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Logo and Description */}
          <div>
            <Link to="/" className="flex items-center gap-1 text-primary">
              <Rocket size={32} strokeWidth={2.7} />
              <span className="text-xl font-bold">StarterBlocks TODO</span>
            </Link>
            <p className="mt-4 max-w-xs text-muted-foreground">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Esse non
              cupiditate quae nam molestias.
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
          &copy; 2022. Company Name TODO. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
