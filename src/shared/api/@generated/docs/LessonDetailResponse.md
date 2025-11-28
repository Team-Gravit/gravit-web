# LessonDetailResponse

레슨 페이지 조회 Response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**chapterSummary** | [**ChapterSummary**](ChapterSummary.md) | 챕터 요약 정보 | [default to undefined]
**unitId** | **number** | 유닛 아이디 | [optional] [default to undefined]
**lessonSummaries** | [**Array&lt;LessonSummary&gt;**](LessonSummary.md) | 레슨 요약 정보 목록 | [default to undefined]

## Example

```typescript
import { LessonDetailResponse } from './api';

const instance: LessonDetailResponse = {
    chapterSummary,
    unitId,
    lessonSummaries,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
