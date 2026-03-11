import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 파란컴퍼니",
  description: "파란컴퍼니 주식회사의 개인정보처리방침입니다.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    title: "제1조 (개인정보의 처리목적)",
    content: `파란컴퍼니 주식회사(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.`,
    list: ["견적 문의 및 상담 응대"],
  },
  {
    title: "제2조 (처리하는 개인정보 항목)",
    content:
      "회사는 다음의 개인정보 항목을 처리하고 있습니다.",
    list: [
      "필수항목: 이름, 연락처, 이메일",
      "인터넷 서비스 이용 과정에서 IP 주소, 쿠키, 방문 일시, 서비스 이용 기록 등이 자동으로 생성되어 수집될 수 있습니다.",
    ],
  },
  {
    title: "제3조 (개인정보의 처리 및 보유 기간)",
    content:
      "회사는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 개인정보를 수집 시 동의받은 개인정보 보유·이용 기간 내에서 개인정보를 처리·보유합니다.",
    list: [
      "보유 기간: 수집 목적 달성 시까지 (문의 응대 완료 후 지체 없이 파기)",
      "관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지",
    ],
  },
  {
    title: "제4조 (개인정보의 제3자 제공)",
    content:
      "회사는 정보주체의 개인정보를 제1조에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다. 현재 개인정보를 제3자에게 제공하고 있지 않습니다.",
  },
  {
    title: "제5조 (정보주체의 권리·의무 및 행사 방법)",
    content: "정보주체는 회사에 대해 언제든지 다음의 권리를 행사할 수 있습니다.",
    list: [
      "개인정보 열람 요구",
      "오류 등이 있을 경우 정정 요구",
      "삭제 요구",
      "처리 정지 요구",
    ],
    extra:
      "권리 행사는 회사에 대해 서면, 전화, 이메일 등을 통하여 하실 수 있으며, 회사는 이에 대해 지체 없이 조치하겠습니다.",
  },
  {
    title: "제6조 (개인정보의 파기)",
    content:
      "회사는 개인정보 보유 기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.",
    list: [
      "파기 절차: 불필요한 개인정보를 선정하고, 개인정보 보호책임자의 승인을 받아 파기합니다.",
      "파기 방법: 전자적 파일 형태의 개인정보는 기록을 재생할 수 없도록 파기하며, 종이 문서에 기록된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.",
    ],
  },
  {
    title: "제7조 (개인정보의 안전성 확보조치)",
    content:
      "회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.",
    list: [
      "관리적 조치: 개인정보 취급 직원 최소화 및 교육",
      "기술적 조치: 개인정보처리시스템 접근 권한 관리, SSL 암호화 통신",
      "물리적 조치: 전산실 등의 접근 통제",
    ],
  },
  {
    title: "제8조 (자동 수집 장치의 설치·운영 및 거부에 관한 사항)",
    content:
      "회사는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 이용 정보를 저장하고 수시로 불러오는 '쿠키(Cookie)'를 사용합니다.",
    list: [
      "쿠키의 사용 목적: 이용자의 방문 및 이용 형태를 파악하여 최적화된 정보 제공",
      "쿠키의 설치·운영 및 거부: 웹 브라우저 상단의 설정 > 개인정보 메뉴에서 쿠키 저장을 거부할 수 있습니다.",
      "쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.",
    ],
  },
  {
    title: "제9조 (개인정보 보호책임자)",
    content:
      "회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만 처리 및 피해 구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.",
    table: [
      ["성명", "김미경"],
      ["직위", "대표이사"],
      ["연락처", "02-6342-2800"],
      ["이메일", "info@parancompany.co.kr"],
    ],
  },
  {
    title: "제10조 (권익 침해 구제 방법)",
    content:
      "정보주체는 개인정보 침해로 인한 구제를 받기 위하여 아래의 기관에 분쟁 해결이나 상담 등을 신청할 수 있습니다.",
    list: [
      "개인정보 침해 신고센터 (한국인터넷진흥원): privacy.kisa.or.kr / 국번 없이 118",
      "개인정보 분쟁조정위원회: kopico.go.kr / 1833-6972",
      "대검찰청 사이버수사과: spo.go.kr / 국번 없이 1301",
      "경찰청 사이버안전국: cyberbureau.police.go.kr / 국번 없이 182",
    ],
  },
  {
    title: "제11조 (개인정보 처리방침 변경)",
    content:
      "이 개인정보처리방침은 2026년 3월 11일부터 적용됩니다. 변경 사항이 있을 경우 웹사이트 공지를 통해 고지하겠습니다.",
  },
] as const;

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-4 pb-20 pt-28 md:px-8 md:pt-36">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-2 text-2xl font-bold text-slate-900 md:text-3xl">
            개인정보처리방침
          </h1>
          <p className="mb-10 text-sm text-slate-500">
            파란컴퍼니 주식회사(이하 &quot;회사&quot;)는 개인정보 보호법 제30조에
            따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고
            원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보처리방침을
            수립·공개합니다.
          </p>

          <div className="space-y-10">
            {SECTIONS.map((section) => (
              <section key={section.title}>
                <h2 className="mb-3 text-base font-semibold text-slate-800 md:text-lg">
                  {section.title}
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  {section.content}
                </p>

                {"list" in section && section.list && (
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm leading-relaxed text-slate-600">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}

                {"extra" in section && section.extra && (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {section.extra}
                  </p>
                )}

                {"table" in section && section.table && (
                  <table className="mt-3 w-full border-collapse text-sm">
                    <tbody>
                      {section.table.map(([label, value]) => (
                        <tr key={label} className="border-b border-slate-100">
                          <td className="w-24 py-2 pr-4 font-medium text-slate-700">
                            {label}
                          </td>
                          <td className="py-2 text-slate-600">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>
            ))}
          </div>
        </div>
    </main>
  );
}
