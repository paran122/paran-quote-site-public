import type { Metadata } from "next";
import NotFoundView from "@/components/NotFoundView";

// 없는 주소 안내. 제목은 서버에서 바로 넣는다(검색엔진·링크 미리보기가 옛 제목을 보지 않게). 화면은 NotFoundView.
export const metadata: Metadata = { title: "페이지를 찾을 수 없습니다", robots: { index: false, follow: true } };

export default function NotFound() {
  return <NotFoundView />;
}
