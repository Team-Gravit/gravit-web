import BottomTabBar from '@/widgets/bottom-tab-bar/bottom-tab-bar';

export default function PageLayout({
  children,
  bottomTabBar,
}: {
  children: React.ReactNode;
  bottomTabBar?: boolean;
}) {
  return (
    <div className="min-h-screen md:px-8 bg-bg-2 pb-[var(--bottom-tab-height)]">
      <main className="h-full max-w-[1200px] mx-auto">{children}</main>

      {bottomTabBar && <BottomTabBar />}
    </div>
  );
}
