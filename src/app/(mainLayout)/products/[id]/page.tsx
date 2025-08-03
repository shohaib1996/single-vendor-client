import ProductDetailsPage from "@/components/pages/ProductDeatisPage/ProductDetailsPage";

const ProductDetails = async({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
   const { id } = await params
  return (
    <ProductDetailsPage id={id} />
  )
}

export default ProductDetails;
