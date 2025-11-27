# MainPageResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**nickname** | **string** | 닉네임 | [default to undefined]
**leagueName** | **string** | 리그 이름(티어) | [default to undefined]
**userLevelDetail** | [**UserLevelDetail**](UserLevelDetail.md) | 유저 레벨 관련 정보 | [default to undefined]
**learningDetail** | [**LearningDetail**](LearningDetail.md) | 유저 학습 관련 정보 | [default to undefined]
**missionDetail** | [**MissionDetail**](MissionDetail.md) | 미션 관련 정보 | [default to undefined]

## Example

```typescript
import { MainPageResponse } from './api';

const instance: MainPageResponse = {
    nickname,
    leagueName,
    userLevelDetail,
    learningDetail,
    missionDetail,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
