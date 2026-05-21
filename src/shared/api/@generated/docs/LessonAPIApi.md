# LessonAPIApi

All URIs are relative to *https://grav-it-dev.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAllLessonInUnit**](#getalllessoninunit) | **GET** /api/v1/lessons/{unitId} | 레슨 목록 조회|
|[**saveLessonSubmission**](#savelessonsubmission) | **POST** /api/v1/lessons/results | 레슨 결과 저장|

# **getAllLessonInUnit**
> LessonDetailResponse getAllLessonInUnit()

특정 유닛의 레슨 목록을 조회합니다.<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    LessonAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LessonAPIApi(configuration);

let unitId: number; // (default to undefined)

const { status, data } = await apiInstance.getAllLessonInUnit(
    unitId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **unitId** | [**number**] |  | defaults to undefined|


### Return type

**LessonDetailResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 레슨 목록 조회 성공 |  -  |
|**404** | 🚨 유닛 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **saveLessonSubmission**
> LessonSubmissionSaveResponse saveLessonSubmission(learningSubmissionSaveRequest)

레슨 완료 후 문제 풀이 결과를 저장하고 사용자 레벨을 업데이트합니다.<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    LessonAPIApi,
    Configuration,
    LearningSubmissionSaveRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new LessonAPIApi(configuration);

let learningSubmissionSaveRequest: LearningSubmissionSaveRequest; //

const { status, data } = await apiInstance.saveLessonSubmission(
    learningSubmissionSaveRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **learningSubmissionSaveRequest** | **LearningSubmissionSaveRequest**|  | |


### Return type

**LessonSubmissionSaveResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 레슨 결과 저장 성공 |  -  |
|**404** | 🚨 학습 정보 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

