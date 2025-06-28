import type { ReactNode } from 'react';

export default function PageContent({
  title,
  subtitle,
  headerEnd,
  children,
}: {
  title: string;
  subtitle?: string;
  headerEnd?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="@container/main flex flex-1 flex-col space-y-2 p-4 md:p-6 pt-0 gap-0">
      <div className="flex flex-col md:flex-row items-center space-y-2 gap-2 md:gap-4">
        <div className="flex flex-col mr-auto border-b pb-2 w-full">
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="ml-auto flex items-center">{headerEnd}</div>
      </div>
      {children}
    </div>
  );
}
