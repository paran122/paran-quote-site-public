import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 | 파란컴퍼니",
  description: "파란컴퍼니 주식회사의 서비스 이용약관입니다.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    title: "제1조 (목적)",
    content:
      '이 약관은 파란컴퍼니 주식회사(이하 "회사")가 운영하는 웹사이트(parancompany.co.kr, 이하 "사이트")에서 제공하는 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.',
  },
  {
    title: "제2조 (정의)",
    list: [
      '"서비스"란 회사가 사이트를 통해 제공하는 행사 기획·운영 관련 정보 제공, 견적 문의, 포트폴리오 열람 등의 온라인 서비스를 말합니다.',
      '"이용자"란 이 약관에 따라 회사가 제공하는 서비스를 이용하는 자를 말합니다.',
      '"견적 문의"란 이용자가 사이트를 통해 행사 기획·운영에 대한 상담을 요청하는 것을 말합니다.',
    ],
  },
  {
    title: "제3조 (약관의 효력 및 변경)",
    list: [
      "이 약관은 사이트에 게시함으로써 효력이 발생합니다.",
      "회사는 관련 법령에 위배되지 않는 범위에서 약관을 개정할 수 있으며, 변경된 약관은 사이트에 공지함으로써 효력이 발생합니다.",
      "이용자는 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단할 수 있습니다.",
    ],
  },
  {
    title: "제4조 (서비스의 내용)",
    content: "회사는 다음의 서비스를 제공합니다.",
    list: [
      "행사 기획 및 운영 관련 정보 제공",
      "포트폴리오 및 사례 열람",
      "견적 문의 및 상담 접수",
      "행사 가이드 및 블로그 콘텐츠 제공",
      "기타 회사가 정하는 서비스",
    ],
  },
  {
    title: "제5조 (서비스 이용)",
    list: [
      "서비스는 회사의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.",
      "회사는 시스템 점검, 교체 및 고장, 통신 두절 등의 사유가 발생한 경우 서비스의 제공을 일시적으로 중단할 수 있습니다.",
      "견적 문의에 대한 응대는 회사 영업일(평일 09:00~18:00) 기준으로 처리됩니다.",
    ],
  },
  {
    title: "제6조 (이용자의 의무)",
    content: "이용자는 다음 행위를 하여서는 안 됩니다.",
    list: [
      "허위 정보를 기재하여 견적 문의를 하는 행위",
      "사이트의 정보를 무단으로 변경하거나 회사의 운영을 방해하는 행위",
      "회사 및 제3자의 지식재산권을 침해하는 행위",
      "사이트에 게시된 콘텐츠(텍스트, 이미지, 영상 등)를 무단 복제·배포하는 행위",
      "기타 관계 법령에 위배되는 행위",
    ],
  },
  {
    title: "제7조 (지식재산권)",
    list: [
      "사이트에 게시된 모든 콘텐츠(포트폴리오 사진·영상, 블로그 글, 디자인 등)의 저작권은 회사에 귀속됩니다.",
      "이용자는 회사의 사전 서면 동의 없이 이를 상업적으로 이용하거나 제3자에게 제공할 수 없습니다.",
    ],
  },
  {
    title: "제8조 (견적 문의 및 계약)",
    list: [
      "사이트를 통한 견적 문의는 계약의 청약이 아니며, 문의 내용을 바탕으로 별도의 상담 및 계약 절차가 진행됩니다.",
      "실제 행사 용역 계약은 회사와 고객 간 별도의 계약서를 통해 체결되며, 계약 조건은 해당 계약서에 따릅니다.",
      "사이트에 표시된 가격 정보는 참고 용도이며, 실제 비용은 행사 유형·규모·요구 사항에 따라 달라질 수 있습니다.",
    ],
  },
  {
    title: "제9조 (면책 조항)",
    list: [
      "회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력적 사유로 서비스를 제공할 수 없는 경우 책임을 지지 않습니다.",
      "회사는 이용자의 귀책 사유로 인한 서비스 이용 장애에 대해 책임을 지지 않습니다.",
      "사이트에서 제공하는 가이드, 체크리스트 등의 콘텐츠는 일반적인 정보 제공 목적이며, 개별 행사 상황에 대한 전문적 조언을 대체하지 않습니다.",
    ],
  },
  {
    title: "제10조 (분쟁 해결)",
    list: [
      "이 약관에 관한 분쟁은 대한민국 법률에 따라 해석되고 적용됩니다.",
      "서비스 이용과 관련하여 분쟁이 발생한 경우 회사의 본사 소재지를 관할하는 법원을 전속 관할 법원으로 합니다.",
    ],
  },
  {
    title: "부칙",
    content: "이 약관은 2026년 3월 16일부터 시행됩니다.",
  },
] as const;

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white px-4 pb-20 pt-28 md:px-8 md:pt-36">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-2xl font-bold text-slate-900 md:text-3xl">
          이용약관
        </h1>
        <p className="mb-10 text-sm text-slate-500">
          파란컴퍼니 주식회사(이하 &quot;회사&quot;)가 운영하는
          웹사이트(parancompany.co.kr)의 서비스 이용에 관한 약관입니다.
        </p>

        <div className="space-y-10">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 text-base font-semibold text-slate-800 md:text-lg">
                {section.title}
              </h2>
              {"content" in section && section.content && (
                <p className="text-sm leading-relaxed text-slate-600">
                  {section.content}
                </p>
              )}

              {"list" in section && section.list && (
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm leading-relaxed text-slate-600">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
