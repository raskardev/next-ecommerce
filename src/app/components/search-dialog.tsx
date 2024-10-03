"use client";

import { getProductsByName } from "@/app/[gender]/[[...category-product]]/_actions";
import { ProductList } from "@/app/[gender]/[[...category-product]]/components/product-list";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const EXCLUDED_PATHS = ["/sign-in", "/sign-up"];

type Product = Awaited<
  ReturnType<typeof getProductsByName>
>["products"][number];

export function SearchDialog() {
  const pathname = usePathname();

  const show = EXCLUDED_PATHS.includes(pathname);
  if (show) return null;

  const [products, setProducts] = useState<Product[] | undefined>();
  const [searchInput, setSearchInput] = useState("");
  const [open, setOpen] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function handleOpenChange(open: boolean) {
    setOpen(open);

    if (!open) {
      setSearchInput("");
      setProducts(undefined);
    }
  }

  async function searchAction() {
    const formData = new FormData();
    formData.append("name", searchInput);

    const { products: searchProducts } = await getProductsByName(
      {
        products: [],
      },
      formData,
    );

    setProducts(searchProducts ?? []);
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>
        <Button
          className="w-52 justify-start space-x-4 rounded-2xl border-foreground"
          variant="outline"
        >
          <MagnifyingGlassIcon />
          <span>Search</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-full h-dvh !rounded-none border-none flex flex-col">
        <VisuallyHidden>
          <DialogTitle>Search products input</DialogTitle>
          <DialogDescription>Search products</DialogDescription>
        </VisuallyHidden>
        <div className="flex items-center h-14 border-b space-x-3">
          <MagnifyingGlassIcon className="h-6 w-6" />
          <form className="w-full" action={searchAction}>
            <Input
              className="border-none outline-none focus-visible:ring-0 text-2xl font-semibold"
              placeholder="What are you looking for?"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
        </div>
        {products ? (
          products.length > 0 ? (
            <ProductList products={products} />
          ) : (
            <div className="text-center">
              <h3 className="text-2xl font-bold">No products found</h3>
              <p className="mt-4">
                Sorry, we couldn't find any products matching your search
                criteria.
              </p>
            </div>
          )
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
