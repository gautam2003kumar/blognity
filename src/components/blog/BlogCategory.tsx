'use client'

import { Category } from '@/utils/Category'
import { CategoryIcon } from './CategoryIcon'
import React from 'react'

export default function CategoryCarousel() {
  return (
    <section className="py-16 px-6 bg-muted/30 mt-4 rounded-2xl overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">Explore Categories</h2>

        {/* Container with infinite scroll */}
        <div className="relative overflow-hidden">
          <div className="flex gap-8 animate-marquee">
            {Category.concat(Category).map((category, index) => (
              <div
                key={index}
                className="min-w-[150px] group border rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-muted hover:shadow-md transition-all cursor-pointer"
              >
                <div className="bg-primary/10 text-primary p-3 rounded-full group-hover:bg-primary/20">
                  {React.createElement(category.icon)}
                </div>
                <h3 className="text-sm font-semibold text-center group-hover:text-primary">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
