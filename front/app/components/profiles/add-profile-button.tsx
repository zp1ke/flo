import { PlusIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';

export default function AddProfileButton() {
  const { t } = useTranslation();

  return (
    <Button variant="outline">
      <PlusIcon className="h-4 w-4" />
      {t('profiles.add')}
    </Button>
  );
}
