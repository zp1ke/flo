import i18next from 'i18next';
import { GlobeIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { saveLanguage } from '~/lib/i18n';

const languages: string[] = ['en'];

export function LanguageSelector() {
  const { t } = useTranslation();
  const { i18n } = useTranslation();

  const [language, setLanguage] = useState(i18next.language);

  const handleLanguage = (lang: string) => {
    setLanguage(lang);
    i18next.changeLanguage(lang).then(() => {
      saveLanguage(lang);
    });
  };

  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <GlobeIcon className="absolute h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t('language.change')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            onClick={() => handleLanguage(lang)}
            disabled={language === lang}
            key={lang}
          >
            {t(`language.${lang}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
