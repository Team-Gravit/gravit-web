# LessonResponse

레슨 조회 Response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**unitSummary** | [**UnitSummary**](UnitSummary.md) | 유닛 요약 정보 | [optional] [default to undefined]
**problems** | [**Array&lt;ProblemResponse&gt;**](ProblemResponse.md) | 문제 목록 | [optional] [default to undefined]
**totalProblems** | **number** | 전체 문제 수 | [optional] [default to undefined]

## Example

```typescript
import { LessonResponse } from './api';

const instance: LessonResponse = {
    unitSummary,
    problems,
    totalProblems,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
