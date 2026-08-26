import type { ReactNode } from 'react';

interface StatusPageLayoutProps {
  icon: ReactNode;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}

export default function StatusPageLayout({
  icon,
  title,
  description,
  children,
}: StatusPageLayoutProps) {
  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center md:gap-18 bg-white md:bg-bg-2">
      <section className="flex flex-col items-center gap-10 md:gap-8 flex-1 md:flex-0 justify-center">
        {icon}

        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-heading1 md:text-title2 text-text-1 md:text-text-2">{title}</h2>
          {description && (
            <p className="text-body2-normal md:text-headline1 text-text-4 md:text-text-3-w">
              {description}
            </p>
          )}
        </div>
      </section>

      {children && (
        <section className="w-full flex items-center gap-3 px-4 py-5 md:w-[370px] md:mx-auto md:p-0">
          {children}
        </section>
      )}
    </div>
  );
}
