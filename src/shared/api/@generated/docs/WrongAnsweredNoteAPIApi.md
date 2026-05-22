# WrongAnsweredNoteAPIApi

All URIs are relative to *https://grav-it-dev.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteWrongAnsweredProblem**](#deletewrongansweredproblem) | **DELETE** /api/v1/wrong-answered-notes | 오답노트 삭제|
|[**getAllWrongAnsweredProblemInUnit**](#getallwrongansweredprobleminunit) | **GET** /api/v1/wrong-answered-notes/{unitId} | 유닛 내 오답 문제 조회|

# **deleteWrongAnsweredProblem**
> deleteWrongAnsweredProblem(wrongAnsweredNoteDeleteRequest)

특정 문제의 오답노트를 삭제합니다.<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    WrongAnsweredNoteAPIApi,
    Configuration,
    WrongAnsweredNoteDeleteRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new WrongAnsweredNoteAPIApi(configuration);

let wrongAnsweredNoteDeleteRequest: WrongAnsweredNoteDeleteRequest; //

const { status, data } = await apiInstance.deleteWrongAnsweredProblem(
    wrongAnsweredNoteDeleteRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **wrongAnsweredNoteDeleteRequest** | **WrongAnsweredNoteDeleteRequest**|  | |


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
|**204** | ✅ 오답노트 삭제 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllWrongAnsweredProblemInUnit**
> WrongAnsweredProblemsResponse getAllWrongAnsweredProblemInUnit()

특정 유닛에서 사용자가 틀린 문제 목록을 조회합니다.<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    WrongAnsweredNoteAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WrongAnsweredNoteAPIApi(configuration);

let unitId: number; // (default to undefined)

const { status, data } = await apiInstance.getAllWrongAnsweredProblemInUnit(
    unitId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **unitId** | [**number**] |  | defaults to undefined|


### Return type

**WrongAnsweredProblemsResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 오답 문제 목록 조회 성공 |  -  |
|**404** | 🚨 옵션 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

