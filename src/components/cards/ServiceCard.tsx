"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Service, CartItem } from "@/types";
import { formatPrice } from "@/lib/constants";
import { useCatalogStore } from "@/stores/catalogStore";
import { useCartStore } from "@/stores/cartStore";
import { showToast } from "@/components/ui/Toast";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const categories = useCatalogStore((s) => s.categories);
  const category = categories.find((c) => c.id === service.categoryId);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const item: CartItem = {
      id: service.id,
      type: "service",
      name: service.name,
      emoji: service.emoji,
      category: category?.name,
      price: service.basePrice,
      quantity: 1,
    };
    addItem(item);
    showToast(`${service.name} 담기 완료`);
  };

  return (
    <Link
      href={`/services/${service.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl
        bg-white border border-slate-200
        transition-all duration-300 ease-in-out
        hover:border-blue-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* 이미지 영역 */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {service.imageUrl ? (
          <Image
            src={service.imageUrl}
            alt={service.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
            <span className="text-3xl font-bold text-slate-300">{service.name[0]}</span>
          </div>
        )}

        {/* 인기 뱃지 */}
        {service.isPopular && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 text-[10px] sm:text-[11px] font-semibold bg-blue-500 text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md">
            인기
          </span>
        )}
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex flex-col flex-1 p-3 sm:p-4">
        {/* 카테고리명 */}
        {category && (
          <span className="text-[10px] sm:text-[11px] text-slate-500 mb-0.5 sm:mb-1">{category.name}</span>
        )}

        {/* 서비스명 */}
        <h3 className="text-[13px] sm:text-[15px] font-semibold text-slate-900 leading-snug mb-0.5 sm:mb-1 line-clamp-1">
          {service.name}
        </h3>

        {/* 간단 설명 - 모바일에서 숨김 */}
        <p className="hidden sm:block text-[12px] text-slate-500 line-clamp-1 mb-3">
          {service.description}
        </p>

        {/* 가격 + 담기 버튼 */}
        <div className="flex items-center justify-between mt-auto pt-1 sm:pt-0">
          <div>
            <span className="font-num text-base sm:text-lg font-bold text-slate-900">
              {formatPrice(service.basePrice)}
            </span>
            <span className="text-slate-500 text-[11px] sm:text-[12px] ml-0.5">원~</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-0.5 sm:gap-1 bg-blue-50 text-blue-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-[12px] font-medium
              hover:bg-blue-100 transition-colors"
            aria-label="장바구니 담기"
          >
            <Plus size={12} className="sm:w-[13px] sm:h-[13px]" />
            담기
          </button>
        </div>
      </div>
    </Link>
  );
}
