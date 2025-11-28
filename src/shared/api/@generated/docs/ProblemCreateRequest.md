# ProblemCreateRequest

문제 생성 Request

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**lessonId** | **number** | 레슨 아이디 | [default to undefined]
**problemType** | **string** | 문제 유형 | [default to undefined]
**instruction** | **string** | 발문 | [default to undefined]
**content** | **string** | 본문 | [default to undefined]

## Example

```typescript
import { ProblemCreateRequest } from './api';

const instance: ProblemCreateRequest = {
    lessonId,
    problemType,
    instruction,
    content,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
