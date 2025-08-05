"use client";

import { useEffect, useState } from "react";
import { useGetAllCategoriesQuery } from "@/redux/api/category/categoryApi";
import { CategorySkeleton } from "../Skeletons/CategorySkeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "../ui/card";
import { ICategory } from "@/types";
import Image from "next/image";
import Link from "next/link";

const CategoriesSection = () => {
  const { data: categories, isLoading } = useGetAllCategoriesQuery({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const categoryList = categories?.data || [];

  if (!isMounted || isLoading) {
    return (
      <section className="py-6 bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 border-primary/20 text-primary"
            >
              Featured Category
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Get Your Desired Product from Featured Category!
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive range of tech products across various
              categories
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {Array.from({ length: 16 }).map((_, index) => (
              <CategorySkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-in slide-in-from-bottom-10 duration-1000">
          <Badge
            variant="outline"
            className="mb-4 border-primary/20 text-primary"
          >
            Featured Category
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Get Your Desired Product from Featured Category!
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive range of tech products across various
            categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
          {categoryList.map((category: ICategory, index: number) => (
            <Link href={`/category/${category.slug}~${category.id}`} key={category.id}>
              <Card
                key={category.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-border/50 animate-in slide-in-from-bottom-10 p-0"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-2 text-center">
                  <div className="mb-4">
                    <Image
                      src={category.icon!}
                      alt={category.name}
                      width={64}
                      height={64}
                      className="inline-flex items-center justify-center w-10 h-10 dark:invert"
                    />
                  </div>

                  <h3 className="font-semibold text-sm md:text-base mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {category.name}
                  </h3>

                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2 hidden md:block">
                    {category.description}
                  </p>
                  {/* Hover Effect */}
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full mx-auto"></div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
