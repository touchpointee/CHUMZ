import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { getProductsFromCollection } from "@/lib/shopify";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sparkles, ShoppingBag, Star, Truck } from "lucide-react";
import { Shield, Leaf, HeartHandshake } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const Shop = () => {
  const { data: initialProducts, isLoading } = useQuery({
    queryKey: ['all-products'],
    queryFn: () => getProductsFromCollection('frontpage', 50),
  });

  const [sortOption, setSortOption] = useState<string>("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter and Sort Logic
  const filteredAndSortedProducts = useMemo(() => {
    if (!initialProducts) return [];

    let processed = [...initialProducts];

    // 1. Filter by Stock
    if (onlyInStock) {
      processed = processed.filter(p => p.node.variants.edges[0]?.node.availableForSale);
    }

    // 2. Filter by Price
    processed = processed.filter(p => {
      const price = parseFloat(p.node.priceRange.minVariantPrice.amount);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // 3. Sort
    switch (sortOption) {
      case "price-asc":
        processed.sort((a, b) =>
          parseFloat(a.node.priceRange.minVariantPrice.amount) - parseFloat(b.node.priceRange.minVariantPrice.amount)
        );
        break;
      case "price-desc":
        processed.sort((a, b) =>
          parseFloat(b.node.priceRange.minVariantPrice.amount) - parseFloat(a.node.priceRange.minVariantPrice.amount)
        );
        break;
      case "title-asc":
        processed.sort((a, b) => a.node.title.localeCompare(b.node.title));
        break;
      case "title-desc":
        processed.sort((a, b) => b.node.title.localeCompare(a.node.title));
        break;
      default:
        // 'featured' - keep original order
        break;
    }

    return processed;
  }, [initialProducts, sortOption, priceRange, onlyInStock]);

  // Reset filters
  const clearFilters = () => {
    setPriceRange([0, 1000]);
    setOnlyInStock(false);
    setSortOption("featured");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/20 to-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-24">
        {/* soft pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGllPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiPjxwYXRoIGQ9Ik0zNiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptLTEyMGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMjQgMjRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bS0xMiAwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSAzIDQtMS43OS00LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat" />
        </div>

        {/* glow blobs */}
        <div className="pointer-events-none absolute -top-24 -left-10 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 w-80 h-80 rounded-full bg-brand-purple/25 blur-3xl" />

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* pill */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full 
                            bg-white/70 backdrop-blur-md border border-white/60 
                            shadow-[0_10px_30px_rgba(244,114,182,0.3)] text-xs md:text-sm 
                            tracking-[0.26em] uppercase font-semibold text-brand-purple/85">
              <Sparkles className="w-4 h-4 text-brand-coral" />
              <span>Premium Collection</span>
            </div>

            {/* UPDATED heading: white pill behind gradient "Products" */}
            <div className="relative inline-block">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-poppins leading-tight">
                Shop All{" "}
                <span
                  className="
                    relative inline-block
                    px-6 py-2
                    rounded-xl
                    bg-white/70
                    backdrop-blur-md
                    border border-white/40
                    shadow-[0_0_40px_rgba(255,255,255,0.28)]
                  "
                >
                  <span className="bg-gradient-to-r from-primary via-brand-coral to-secondary bg-clip-text text-transparent font-black">
                    Products
                  </span>
                </span>
              </h1>

              {/* subtle underline/halo like before */}
              <span
                className="pointer-events-none absolute inset-x-0 -bottom-3 mx-auto w-2/3 h-4
                           rounded-full bg-black/10 blur-xl"
              />
            </div>

            <p className="text-lg md:text-xl text-foreground/85 font-nunito max-w-2xl mx-auto leading-relaxed">
              Discover our complete range of premium, pH-balanced hygiene products—
              crafted for all-day comfort, confidence, and gentle care.
            </p>

            {/* meta row */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm font-nunito text-foreground/80 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-white/70">
                <ShoppingBag className="w-4 h-4 text-brand-pink" />
                <span>Curated premium range</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-white/70">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>4.9/5 customer rating</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-white/70">
                <Truck className="w-4 h-4 text-brand-coral" />
                <span>Fast delivery across India</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Filters Section */}
      <section className="sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b py-4">
        <div className="container">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredAndSortedProducts ? `${filteredAndSortedProducts.length} Products` : 'Loading...'}
              {initialProducts && filteredAndSortedProducts.length !== initialProducts.length && (
                <span className="ml-1 text-xs">(filtered from {initialProducts.length})</span>
              )}
            </p>
            <div className="flex gap-3">
              {/* Filter Sheet */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 relative">
                    <Filter className="w-4 h-4" />
                    Filter
                    {(priceRange[0] > 0 || priceRange[1] < 1000 || onlyInStock) && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-pink rounded-full border border-white" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Refine your search to find the perfect product.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6 space-y-8">
                    {/* Price Range Filter */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">Price Range</Label>
                        <span className="text-sm text-muted-foreground"> ₹{priceRange[0]} - {priceRange[1] === 1000 ? '₹1000+' : `₹${priceRange[1]}`}</span>
                      </div>
                      <Slider
                        defaultValue={[0, 1000]}
                        value={priceRange}
                        max={1000}
                        step={10}
                        minStepsBetweenThumbs={1}
                        onValueChange={(val) => setPriceRange(val as [number, number])}
                        className="py-4"
                      />
                    </div>

                    {/* Availability Filter */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="in-stock"
                        checked={onlyInStock}
                        onCheckedChange={(checked) => setOnlyInStock(checked as boolean)}
                      />
                      <Label htmlFor="in-stock" className="cursor-pointer font-medium">In Stock Only</Label>
                    </div>
                  </div>
                  <SheetFooter className="flex-col gap-3 sm:flex-col">
                    <Button onClick={() => setIsFilterOpen(false)} className="w-full bg-gradient-to-r from-brand-purple to-brand-pink">
                      Show {filteredAndSortedProducts.length} Results
                    </Button>
                    <Button variant="outline" onClick={clearFilters} className="w-full">
                      Reset Filters
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 min-w-[140px] justify-between">
                    <span className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      {sortOption === 'featured' ? 'Sort By' :
                        sortOption === 'price-asc' ? 'Price: Low to High' :
                          sortOption === 'price-desc' ? 'Price: High to Low' :
                            sortOption === 'title-asc' ? 'Name: A-Z' : 'Name: Z-A'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Sort Variables</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked={sortOption === 'featured'} onCheckedChange={() => setSortOption('featured')}>
                    Featured
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={sortOption === 'price-asc'} onCheckedChange={() => setSortOption('price-asc')}>
                    Price: Low to High
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={sortOption === 'price-desc'} onCheckedChange={() => setSortOption('price-desc')}>
                    Price: High to Low
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={sortOption === 'title-asc'} onCheckedChange={() => setSortOption('title-asc')}>
                    Name: A-Z
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={sortOption === 'title-desc'} onCheckedChange={() => setSortOption('title-desc')}>
                    Name: Z-A
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <div className="container py-16">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-pulse">
              <p className="text-muted-foreground text-lg">Loading our amazing products...</p>
            </div>
          </div>
        ) : filteredAndSortedProducts && filteredAndSortedProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAndSortedProducts.map((product, i) => (
              <div
                key={product.node.id}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto bg-gradient-card rounded-3xl p-12 shadow-soft border border-border/50">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-accent flex items-center justify-center">
                <Filter className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-poppins">No Products Found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any products matching your filters.
              </p>
              <Button onClick={clearFilters} variant="outline" className="min-w-[150px]">
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Trust Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-accent/40">
        <div className="container">
          <div
            className="
              relative overflow-hidden rounded-[2rem]
              bg-white/80 backdrop-blur-xl
              border border-white/80
              shadow-[0_20px_70px_rgba(15,23,42,0.16)]
              px-6 py-12 md:px-12 md:py-14
            "
          >
            {/* soft background blobs */}
            <div className="pointer-events-none absolute -top-24 left-0 w-64 h-64 rounded-full bg-brand-pink/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 right-0 w-72 h-72 rounded-full bg-brand-purple/15 blur-3xl" />

            {/* header */}
            <div className="relative text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
                              bg-brand-pink/10 border border-brand-pink/30 
                              text-[11px] tracking-[0.28em] uppercase font-semibold 
                              text-brand-purple/85">
                <Sparkles className="w-3.5 h-3.5 text-brand-coral" />
                <span>Why Chumz</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-black font-poppins">
                Why Choose <span className="text-brand-purple">Chumz Products?</span>
              </h2>

              <p className="text-sm md:text-base text-muted-foreground font-nunito">
                Thoughtfully designed intimate-care essentials that are gentle on your skin,
                backed by science, and made to fit real women’s lives.
              </p>
            </div>

            {/* feature cards */}
            <div className="relative mt-10 grid gap-6 md:grid-cols-3">
              {/* card 1 */}
              <div
                className="
                  group rounded-2xl p-6 md:p-7
                  bg-gradient-to-br from-brand-pink/6 via-white to-white
                  border border-white/80
                  shadow-[0_12px_35px_rgba(15,23,42,0.08)]
                  transition-all duration-300
                  hover:-translate-y-2 hover:shadow-[0_18px_55px_rgba(15,23,42,0.16)]
                "
              >
                <div className="inline-flex items-center justify-center mb-4">
                  <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-300 via-emerald-400 to-emerald-500 shadow-lg">
                    <div className="absolute inset-0 rounded-2xl bg-white/10" />
                    <Leaf className="relative w-7 h-7 text-white m-auto mt-[0.6rem]" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2 font-poppins text-lg">
                  Natural &amp; Safe
                </h3>
                <p className="text-sm text-muted-foreground font-nunito leading-relaxed">
                  Premium ingredients, pH-balanced and safety-tested to be gentle on intimate skin.
                </p>
              </div>

              {/* card 2 */}
              <div
                className="
                  group rounded-2xl p-6 md:p-7
                  bg-gradient-to-br from-brand-purple/6 via-white to-white
                  border border-white/80
                  shadow-[0_12px_35px_rgba(15,23,42,0.08)]
                  transition-all duration-300
                  hover:-translate-y-2 hover:shadow-[0_18px_55px_rgba(15,23,42,0.16)]
                "
              >
                <div className="inline-flex items-center justify-center mb-4">
                  <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-purple via-brand-magenta to-brand-pink shadow-lg">
                    <div className="absolute inset-0 rounded-2xl bg-white/10" />
                    <Shield className="relative w-7 h-7 text-white m-auto mt-[0.6rem]" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2 font-poppins text-lg">
                  Derma Tested
                </h3>
                <p className="text-sm text-muted-foreground font-nunito leading-relaxed">
                  Clinically tested, dermatologist-approved formulas you can trust every cycle.
                </p>
              </div>

              {/* card 3 */}
              <div
                className="
                  group rounded-2xl p-6 md:p-7
                  bg-gradient-to-br from-brand-coral/6 via-white to-white
                  border border-white/80
                  shadow-[0_12px_35px_rgba(15,23,42,0.08)]
                  transition-all duration-300
                  hover:-translate-y-2 hover:shadow-[0_18px_55px_rgba(15,23,42,0.16)]
                "
              >
                <div className="inline-flex items-center justify-center mb-4">
                  <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-pink via-brand-coral to-brand-purple shadow-lg">
                    <div className="absolute inset-0 rounded-2xl bg-white/10" />
                    <HeartHandshake className="relative w-7 h-7 text-white m-auto mt-[0.6rem]" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2 font-poppins text-lg">
                  Made for You
                </h3>
                <p className="text-sm text-muted-foreground font-nunito leading-relaxed">
                  Designed by women, for women—focused on comfort, confidence, and real-life needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;
