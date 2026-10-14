import { supabase } from "@/lib/supabase";

export const MAX_FILES = 5;
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_FILE_SIZE_LABEL = "50MB";
export const OVERSIZE_CONTACT_EMAIL = "info@parancompany.co.kr";

/** 첨부 한도 안내 (첨부 영역 하단 고정 노출) */
export const ATTACHMENT_LIMIT_TEXT = `최대 ${MAX_FILES}개, 개당 ${MAX_FILE_SIZE_LABEL}까지 첨부할 수 있습니다.`;

export interface UploadedFile {
  name: string;
  url: string;
  size: number;
  type: string;
}

interface UploadTicket {
  name: string;
  path: string;
  token: string;
  type: string;
  size: number;
}

/** 첨부 선택 시 용량·개수 검증. 통과하면 null, 아니면 토스트에 띄울 메시지 반환 */
export function validateFiles(
  selected: File[],
  alreadyAttached: number
): string | null {
  if (alreadyAttached + selected.length > MAX_FILES) {
    return `최대 ${MAX_FILES}개까지 첨부 가능합니다.`;
  }
  for (const file of selected) {
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name}: ${MAX_FILE_SIZE_LABEL} 이하 파일만 첨부 가능합니다. 더 큰 파일은 ${OVERSIZE_CONTACT_EMAIL}로 보내주세요.`;
    }
  }
  return null;
}

/**
 * 첨부파일 업로드.
 * 서버에서 업로드 티켓(서명 URL)만 받고 파일은 브라우저에서 Storage로 직접 올린다.
 * 서버리스 함수 요청 본문 제한(6MB)을 거치지 않으므로 대용량 첨부가 가능하다.
 */
export async function uploadAttachments(files: File[]): Promise<UploadedFile[]> {
  if (files.length === 0) return [];

  const res = await fetch("/api/contact/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      files: files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "업로드에 실패했습니다." }));
    throw new Error(err.error || "업로드에 실패했습니다.");
  }

  const { tickets } = (await res.json()) as { tickets: UploadTicket[] };

  if (!supabase) {
    throw new Error("업로드에 실패했습니다. 잠시 후 다시 시도해주세요.");
  }

  const uploaded: UploadedFile[] = [];
  for (let i = 0; i < tickets.length; i++) {
    const ticket = tickets[i];
    const { error } = await supabase.storage
      .from("contact-attachments")
      .uploadToSignedUrl(ticket.path, ticket.token, files[i], {
        contentType: ticket.type,
      });

    if (error) {
      console.error("[attachments] 업로드 실패:", { name: ticket.name, error });
      throw new Error(`${ticket.name} 업로드에 실패했습니다. 파일 크기와 네트워크 상태를 확인해주세요.`);
    }

    uploaded.push({
      name: ticket.name,
      url: ticket.path,
      size: ticket.size,
      type: ticket.type,
    });
  }

  return uploaded;
}
