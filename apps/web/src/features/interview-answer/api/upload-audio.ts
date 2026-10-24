import axios from 'axios';

import { issueUploadUrl } from '@/shared/api/generated/interview-session-api/interview-session-api';

/**
 * presigned 업로드 URL을 발급받아 S3에 PUT 업로드하고 audioKey를 반환한다.
 * presigned URL은 발급 시 넘긴 Content-Type으로 서명되므로 PUT 헤더도 동일하게 맞춘다.
 *
 * S3는 우리 백엔드가 아니므로 customInstance(baseURL·Authorization·401 인터셉터)를 타면
 * 안 된다. 설정이 없는 기본 axios로 직접 PUT 한다.
 */
export async function uploadAudio(
  sessionId: number,
  displayOrder: number,
  blob: Blob,
): Promise<string> {
  // blob.type 은 'audio/webm;codecs=opus' 처럼 코덱 파라미터가 붙는다.
  // 백엔드 허용 목록은 베이스 MIME(audio/webm 등)이라 코덱 파라미터를 떼고 보낸다.
  // presigned 서명과 PUT 헤더가 동일한 값이어야 하므로 둘 다 이 값으로 맞춘다.
  const contentType = blob.type.split(';')[0];

  const { audioKey, uploadUrl } = await issueUploadUrl(sessionId, {
    displayOrder,
    contentType,
  });

  await axios.put(uploadUrl, blob, {
    headers: { 'Content-Type': contentType },
  });

  return audioKey;
}
