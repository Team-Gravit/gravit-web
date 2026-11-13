/**
 * 서버 명세가 실제 응답과 다른 부분을 생성 전에 보정한다.
 * 백엔드 명세가 수정되면 해당 보정을 제거한다.
 */
export default function normalizeOpenApi(schema) {
  // Springdoc가 HTTP Bearer 스키마에 apiKey 전용 필드를 함께 내보낸다.
  const bearerAuth = schema.components?.securitySchemes?.BearerAuth;

  if (bearerAuth?.type === 'http') {
    delete bearerAuth.name;
    delete bearerAuth.in;
  }

  // 설명에는 "함께 아는 친구가 없으면 null"이라고 적혀 있지만 타입은 non-null string으로 선언돼 있다.
  const mutualFollowPreviewNickname =
    schema.components?.schemas?.RecommendUserResponse?.properties?.mutualFollowPreviewNickname;

  if (mutualFollowPreviewNickname && !mutualFollowPreviewNickname.nullable) {
    mutualFollowPreviewNickname.nullable = true;
  }

  return schema;
}
