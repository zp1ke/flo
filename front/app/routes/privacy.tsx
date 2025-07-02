import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import AppLogo from '~/components/app-logo';
import { LanguageSelector } from '~/components/layout/language-selector';
import PageContent from '~/components/layout/page-content';
import { ThemeModeSelector } from '~/components/layout/theme-mode-selector';

const sections = [
  {
    title: 'privacy.informationCollection',
    content: 'privacy.informationCollectionContent',
    id: 'privacy-policy',
  },
  {
    title: 'privacy.usageData',
    content: 'privacy.usageDataContent',
    id: 'privacy-usage-data',
  },
  {
    title: 'privacy.informationUse',
    content: 'privacy.informationUseContent',
    id: 'privacy-information-use',
  },
  {
    title: 'privacy.informationProtection',
    content: 'privacy.informationProtectionContent',
    id: 'privacy-information-protection',
  },
  {
    title: 'privacy.informationRights',
    content: 'privacy.informationRightsContent',
    id: 'privacy-information-rights',
  },
  {
    title: 'privacy.changes',
    content: 'privacy.changesContent',
    id: 'privacy-changes',
  },
  {
    title: 'privacy.contactUs',
    content: 'privacy.contactUsContent',
    id: 'privacy-contact-us',
  },
];

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 p-6 md:p-10">
      <div className="flex items-center justify-between">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <AppLogo className="size-4" />
            {t('app.name')}
          </Link>
        </div>
        <div className="flex items-center gap-2 px-4">
          <LanguageSelector />
          <ThemeModeSelector />
        </div>
      </div>
      <div className="w-full max-w-4xl mx-auto">
        <PageContent
          title={t('privacy.title')}
          subtitle={t('privacy.description')}
        >
          <div className="space-y-4 md:space-y-5 lg:space-y-6 mt-4 md:mt-6">
            {sections.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="space-y-2 md:space-y-4 lg:space-y-6"
              >
                <h2 className="text-xl font-semibold border-b pb-2">
                  {t(section.title)}
                </h2>
                <p className="leading-2 md:leading-4 lg:leading-6">
                  {t(section.content)}
                </p>
              </div>
            ))}
          </div>
        </PageContent>
      </div>
    </div>
  );
}
