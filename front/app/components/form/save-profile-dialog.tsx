import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
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
import { cn } from '~/lib/utils';
import type { Profile } from '~/types/user';

export function SaveProfileDialog({
  profile,
  onSaved,
  children,
}: {
  profile?: Profile;
  onSaved: (profile: Profile, setDefault: boolean) => void;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const { saveProfile } = useAuth();

  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const formSchema = z.object({
    name: z.string().min(3, t('profiles.nameSize')).max(255, t('profiles.nameSize')),
    setDefault: z.boolean().default(true).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile?.name || '',
      setDefault: !profile,
    },
  });

  const onSave = async (data: z.infer<typeof formSchema>) => {
    setProcessing(true);

    const { name, setDefault } = data;
    const setAsDefault = setDefault ?? false;

    const saved = await saveProfile({ code: profile?.code, name } satisfies Profile, setAsDefault);
    onSaved(saved, setAsDefault);

    setProcessing(false);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent
        className={cn('sm:max-w-[425px]', processing && '[&>button]:hidden')}
        onInteractOutside={(e) => {
          if (processing) {
            e.preventDefault();
          }
        }}>
        <DialogHeader>
          <DialogTitle>{t(profile ? 'profiles.edit' : 'profiles.add')}</DialogTitle>
          <DialogDescription>{t('profiles.editDescription')}</DialogDescription>
        </DialogHeader>
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
            <DialogFooter>
              <Button type="submit" disabled={processing}>
                {processing && <Loader2 className="animate-spin" />}
                {processing && t('profiles.processing')}
                {!processing && t('profiles.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
