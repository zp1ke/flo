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
    <div className="@container/main flex flex-1 flex-col space-y-4 p-8 pt-6 gap-2">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
        {headerEnd}
      </div>
      {children}
    </div>
  );
}
