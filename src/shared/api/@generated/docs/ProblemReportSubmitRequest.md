# ProblemReportSubmitRequest

문제 신고 제출 request

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**reportType** | **string** | 신고 유형 | [default to undefined]
**content** | **string** | 신고 사유 | [optional] [default to undefined]
**problemId** | **number** | 문제 아이디 | [default to undefined]

## Example

```typescript
import { ProblemReportSubmitRequest } from './api';

const instance: ProblemReportSubmitRequest = {
    reportType,
    content,
    problemId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
