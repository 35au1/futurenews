"use client"

import { Button } from "@/components/ui/button"

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="flex flex-wrap gap-2 my-4">
      <Button
        key="all"
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => onSelectCategory(null)}
        className="transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
      >
        Wszystkie
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectCategory(category)}
          className="transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
        >
          {category}
        </Button>
      ))}
    </div>
  )
}
