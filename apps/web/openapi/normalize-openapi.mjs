/**
 * Springdoc가 HTTP Bearer 스키마에 apiKey 전용 필드를 함께 내보내는 문제를 보정한다.
 * 백엔드 명세가 수정되면 이 transformer는 제거한다.
 */
export default function normalizeOpenApi(schema) {
  const bearerAuth = schema.components?.securitySchemes?.BearerAuth;

  if (bearerAuth?.type === 'http') {
    delete bearerAuth.name;
    delete bearerAuth.in;
  }

  return schema;
}
