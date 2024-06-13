import ProfileNavbar from '@/ui/components/profile/navbar';

interface ProfilePageLayoutProps {
  children: React.ReactNode;
  preview?: boolean;
  name: string;
}

const ProfilePageLayout = ({
  children,
  preview = false,
  name,
}: ProfilePageLayoutProps) => {
  return (
    <div className="h-full w-full mb-20">
      <ProfileNavbar name={name} preview={preview} />
      {children}
    </div>
  );
};

export default ProfilePageLayout;
