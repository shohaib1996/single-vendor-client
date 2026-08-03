import Link from "next/link";
import type { ChatProduct } from "@/lib/chatStream";

// Renders the real product_url/image_url straight from the tool result —
// deliberately NOT parsed out of the LLM's text. gpt-4o-mini could not
// reliably keep product_url and image_url straight once a reply listed
// more than one product (see chat_customer.py's PRODUCT_TOOL_NAMES
// comment), so the backend sends this as structured data instead of
// asking the model to hand-write Markdown links/images.
export function ProductCard({ product }: { product: ChatProduct }) {
  return (
    <Link
      href={product.product_url}
      className="flex gap-2 items-center border rounded-lg p-2 hover:bg-muted/50 transition-colors w-56 shrink-0"
    >
      {product.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element -- external product image URL
        <img
          src={product.image_url}
          alt={product.name}
          className="w-12 h-12 rounded object-cover shrink-0"
        />
      ) : (
        <div className="w-12 h-12 rounded bg-muted shrink-0" />
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium truncate">{product.name}</p>
        <p className="text-xs text-muted-foreground">
          {product.discountedPrice ? (
            <>
              <span className="line-through mr-1">${product.price.toFixed(2)}</span>
              <span className="font-semibold text-foreground">${product.discountedPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-semibold text-foreground">${product.price.toFixed(2)}</span>
          )}
        </p>
      </div>
    </Link>
  );
}
