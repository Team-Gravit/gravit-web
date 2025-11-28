# OptionCreateRequest

옵션 생성 Request

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**content** | **string** | 옵션 내용 | [optional] [default to undefined]
**explanation** | **string** | 옵션에 대한 설명 | [optional] [default to undefined]
**isAnswer** | **boolean** | 정답 여부 | [optional] [default to undefined]
**problemId** | **number** | 문제 ID | [optional] [default to undefined]

## Example

```typescript
import { OptionCreateRequest } from './api';

const instance: OptionCreateRequest = {
    content,
    explanation,
    isAnswer,
    problemId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
