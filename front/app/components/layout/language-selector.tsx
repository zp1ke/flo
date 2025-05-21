import { useEffect, useState } from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';
import { GlobeIcon } from 'lucide-react';

const languages: string[] = ['en'];

export function LanguageSelector() {
  const { t } = useTranslation();
  const { i18n } = useTranslation();

  const [language, setLanguage] = useState(i18next.language);

  const handleLanguage = (lang: string) => {
    setLanguage(lang);
    i18next.changeLanguage(lang).then(() => {});
  };

  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n, i18n.language]);

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
            key={lang}>
            {t('language.' + lang)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
