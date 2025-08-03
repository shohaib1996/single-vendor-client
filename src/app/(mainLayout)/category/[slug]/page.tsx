import CategoryWiseProduct from "@/components/pages/CategoryWiseProduct/CategoryWiseProduct";

const Category = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  return (
    <CategoryWiseProduct slug={slug} />
  );
};

export default Category;
