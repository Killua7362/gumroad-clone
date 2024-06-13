import ProfileNavbar from '@/ui/components/profile/navbar';

interface ProductDetailsPageLayoutProps {
  children: React.ReactNode;
  preview?: boolean;
}

const ProductsDetailsPageLayout = ({
  children,
  preview = false,
}: ProductDetailsPageLayoutProps) => {
  return (
    <div className="w-full mb-20">
      <ProfileNavbar name="" preview={preview} />
      {children}
    </div>
  );
};
export default ProductsDetailsPageLayout;
