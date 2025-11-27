# ReportDetailResponse

신고 상세 조회 Response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**reportId** | **number** | 신고 ID | [optional] [default to undefined]
**reportType** | **string** | 신고 유형 | [default to undefined]
**problemId** | **number** | 문제 ID | [optional] [default to undefined]
**content** | **string** | 신고 내용 | [default to undefined]
**isResolved** | **boolean** | 해결 여부 | [optional] [default to undefined]
**submittedAt** | **string** | 신고 접수 시간 | [default to undefined]

## Example

```typescript
import { ReportDetailResponse } from './api';

const instance: ReportDetailResponse = {
    reportId,
    reportType,
    problemId,
    content,
    isResolved,
    submittedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
