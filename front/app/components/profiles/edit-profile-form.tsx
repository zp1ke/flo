import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import useAuth from '~/contexts/auth/use-auth';
import type { RestError } from '~/lib/rest-client';
import { type Profile, profileNameIsValid, profileSchema } from '~/types/profile';

export function EditProfileForm({
  profile,
  onSaved,
  onProcessing,
}: {
  profile?: Profile;
  onSaved: (profile: Profile, setDefault: boolean) => Promise<void>;
  onProcessing: (processing: boolean) => void;
}) {
  const { t } = useTranslation();
  const { activateProfile, refreshUser, saveProfile } = useAuth();

  const [processing, setProcessing] = useState(false);

  const formSchema = z.object({
    name: profileSchema.shape.name.refine(profileNameIsValid, t('profiles.nameSize')),
    setDefault: z.boolean().default(true).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile?.name || '',
      setDefault: !profile,
    },
  });

  const toggleProcessing = (value: boolean) => {
    setProcessing(value);
    onProcessing(value);
  };

  const onSave = async (data: z.infer<typeof formSchema>) => {
    toggleProcessing(true);

    const { name, setDefault } = data;
    const setAsDefault = setDefault ?? false;

    try {
      const saved = await saveProfile(
        { code: profile?.code, name } satisfies Profile,
        setAsDefault
      );
      await refreshUser();
      if (setAsDefault) {
        await activateProfile(saved);
      }
      await onSaved(saved, setAsDefault);
      form.reset();
    } catch (e) {
      toast.error(t('profiles.fetchError'), { description: t((e as RestError).message) });
    } finally {
      toggleProcessing(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-8">
        <div className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>{t('profiles.name')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('profiles.namePlaceholder')}
                    type="text"
                    required
                    disabled={processing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="setDefault"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={processing}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t('profiles.defaultProfile')}</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={processing}>
          {processing && <Loader2 className="animate-spin" />}
          {processing && t('profiles.processing')}
          {!processing && t('profiles.save')}
        </Button>
      </form>
    </Form>
  );
}
