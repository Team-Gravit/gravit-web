# LessonSubmissionSaveRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**lessonId** | **number** | 레슨 아이디 | [default to undefined]
**learningTime** | **number** | 풀이 시간(단위 : 정수 초) / 1분 20초가 걸렸다면 80 | [default to undefined]
**accuracy** | **number** | 정확도(단위 : 정수) / 78.9 -&gt; 79 | [default to undefined]

## Example

```typescript
import { LessonSubmissionSaveRequest } from './api';

const instance: LessonSubmissionSaveRequest = {
    lessonId,
    learningTime,
    accuracy,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
