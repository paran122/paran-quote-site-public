"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { Package as PackageType, CartItem } from "@/types";
import { formatPrice } from "@/lib/constants";
import { useCatalogStore } from "@/stores/catalogStore";
import { useCartStore } from "@/stores/cartStore";
import { showToast } from "@/components/ui/Toast";

interface PackageCardProps {
  pkg: PackageType;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const services = useCatalogStore((s) => s.services);
  const includedServices = services.filter((s) =>
    pkg.includedServiceIds.includes(s.id)
  );

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const item: CartItem = {
      id: pkg.id,
      type: "package",
      name: pkg.name,
      emoji: pkg.emoji,
      price: pkg.discountPrice,
      quantity: 1,
      includedServices: includedServices.map((s) => s.name),
      discountRate: pkg.discountRate,
    };
    addItem(item);
    showToast(`${pkg.name} 패키지 담기 완료`);
  };

  return (
    <div className="group relative w-full h-[320px] overflow-hidden rounded-xl shadow-lg cursor-pointer transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2">
      {/* 배경 이미지 + 줌 효과 */}
      {pkg.imageUrl ? (
        <Image
          src={pkg.imageUrl}
          alt={pkg.name}
          fill
          sizes="(max-width: 768px) 100vw, 380px"
          className="absolute inset-0 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-slate-700 flex items-center justify-center">
          <span className="text-3xl font-bold text-slate-400">{pkg.name[0]}</span>
        </div>
      )}

      {/* 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      {/* 콘텐츠 */}
      <div className="relative flex h-full flex-col justify-between p-5">
        {/* 상단: 할인 뱃지 */}
        <div className="flex items-start justify-end">
          <span className="text-[11px] font-bold bg-amber-500/90 text-white px-3 py-1.5 rounded-full backdrop-blur-sm">
            {pkg.discountRate}% 할인
          </span>
        </div>

        {/* 중단: 패키지명 + 포함 서비스 (호버 시 위로 이동) */}
        <div className="transition-transform duration-500 ease-in-out group-hover:-translate-y-16">
          <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
          {pkg.description && (
            <p className="text-sm text-white/60 mt-1">{pkg.description}</p>
          )}
          <div className="mt-3 space-y-1">
            {includedServices.slice(0, 3).map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <Check size={12} className="text-amber-400 shrink-0" />
                <span className="text-xs text-white/70">{s.name}</span>
              </div>
            ))}
            {includedServices.length > 3 && (
              <p className="text-[11px] text-white/50 pl-5">
                외 {includedServices.length - 3}개 서비스
              </p>
            )}
          </div>
        </div>

        {/* 하단: 가격 + 버튼 (호버 시 나타남) */}
        <div className="absolute -bottom-20 left-0 w-full px-5 pb-5 opacity-0 transition-all duration-500 ease-in-out group-hover:bottom-0 group-hover:opacity-100">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-sm text-white/50 line-through font-num">
                {formatPrice(pkg.originalPrice)}원
              </span>
              <div>
                <span className="font-num text-2xl font-bold text-white">
                  {formatPrice(pkg.discountPrice)}
                </span>
                <span className="text-white/70 text-sm ml-1">원</span>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              패키지 담기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
