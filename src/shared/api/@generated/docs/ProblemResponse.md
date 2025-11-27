# ProblemResponse

문제 정보 Response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**problemId** | **number** | 문제 아이디 | [optional] [default to undefined]
**problemType** | **string** | 문제 타입 | [default to undefined]
**instruction** | **string** | 발문 | [default to undefined]
**content** | **string** | 본문 | [default to undefined]
**answerResponse** | [**AnswerResponse**](AnswerResponse.md) | 주관식 정답 | [optional] [default to undefined]
**_options** | [**Array&lt;OptionResponse&gt;**](OptionResponse.md) | 객관식 선지 | [optional] [default to undefined]
**isBookmarked** | **boolean** | 북마크 여부 | [optional] [default to undefined]

## Example

```typescript
import { ProblemResponse } from './api';

const instance: ProblemResponse = {
    problemId,
    problemType,
    instruction,
    content,
    answerResponse,
    _options,
    isBookmarked,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
