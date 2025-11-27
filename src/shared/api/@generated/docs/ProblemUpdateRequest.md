# ProblemUpdateRequest

문제 수정 Request

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**problemId** | **number** | 문제 아이디 | [default to undefined]
**problemType** | **string** | 문제 유형 | [default to undefined]
**instruction** | **string** | 발문 | [default to undefined]
**content** | **string** | 본문 | [default to undefined]

## Example

```typescript
import { ProblemUpdateRequest } from './api';

const instance: ProblemUpdateRequest = {
    problemId,
    problemType,
    instruction,
    content,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
