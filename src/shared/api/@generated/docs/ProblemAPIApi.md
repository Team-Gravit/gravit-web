# ProblemAPIApi

All URIs are relative to *https://grav-it-dev.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAllProblemInLesson**](#getallprobleminlesson) | **GET** /api/v1/problems/{lessonId} | 레슨 문제 조회|
|[**saveProblemSubmission**](#saveproblemsubmission) | **POST** /api/v1/problems/results | 문제 결과 저장|

# **getAllProblemInLesson**
> LessonResponse getAllProblemInLesson()

특정 레슨을 구성하는 문제 목록을 조회합니다.<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    ProblemAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProblemAPIApi(configuration);

let lessonId: number; // (default to undefined)

const { status, data } = await apiInstance.getAllProblemInLesson(
    lessonId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **lessonId** | [**number**] |  | defaults to undefined|


### Return type

**LessonResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 레슨 문제 목록 조회 성공 |  -  |
|**404** | 🚨 옵션 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **saveProblemSubmission**
> saveProblemSubmission(problemSubmissionRequest)

문제 풀이 결과를 저장합니다.<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    ProblemAPIApi,
    Configuration,
    ProblemSubmissionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ProblemAPIApi(configuration);

let problemSubmissionRequest: ProblemSubmissionRequest; //

const { status, data } = await apiInstance.saveProblemSubmission(
    problemSubmissionRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **problemSubmissionRequest** | **ProblemSubmissionRequest**|  | |


### Return type

void (empty response body)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 문제 결과 저장 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

