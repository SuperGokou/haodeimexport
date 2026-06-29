import ProductSite from '@/components/product-site'
import { getSiteData, publicProducts } from '@/lib/data-store'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const { products, company } = await getSiteData()
  return <ProductSite initialProducts={publicProducts(products)} company={company} />
}
