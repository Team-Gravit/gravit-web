interface MobileHeaderProps {
  leftSlot?: React.ReactNode;
  pageTitle: string;
  rightSlot?: React.ReactNode;
}

export default function MobilePageHeader({ leftSlot, pageTitle, rightSlot }: MobileHeaderProps) {
  return (
    <header className="w-full bg-white border-b border-divider-1 h-12 ">
      <div className="flex justify-center items-center h-full w-full relative">
        <div className="absolute left-0 top-0 flex items-center justify-center">{leftSlot}</div>
        <h1 className="text-label1">{pageTitle}</h1>
        <div className="absolute right-0 top-0 flex items-center justify-center">{rightSlot}</div>
      </div>
    </header>
  );
}
