# AdminProblemAPIApi

All URIs are relative to *https://grav-it-dev.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createProblem**](#createproblem) | **POST** /api/v1/admin/problems | 문제 생성|
|[**deleteProblem**](#deleteproblem) | **DELETE** /api/v1/admin/problems/{problemId} | 문제 삭제|
|[**getProblem**](#getproblem) | **GET** /api/v1/admin/problems/{problemId} | 문제 조회|
|[**updateProblem**](#updateproblem) | **PUT** /api/v1/admin/problems | 문제 수정|

# **createProblem**
> createProblem(problemCreateRequest)

새로운 문제를 생성합니다<br>🔐 <strong>관리자 권한 필요</strong><br>

### Example

```typescript
import {
    AdminProblemAPIApi,
    Configuration,
    ProblemCreateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminProblemAPIApi(configuration);

let problemCreateRequest: ProblemCreateRequest; //

const { status, data } = await apiInstance.createProblem(
    problemCreateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **problemCreateRequest** | **ProblemCreateRequest**|  | |


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
|**201** | ✅ 문제 생성 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteProblem**
> deleteProblem()

기존 문제를 삭제합니다<br>🔐 <strong>관리자 권한 필요</strong><br>

### Example

```typescript
import {
    AdminProblemAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminProblemAPIApi(configuration);

let problemId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteProblem(
    problemId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **problemId** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | ✅ 문제 삭제 성공 |  -  |
|**404** | 🚨 문제 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getProblem**
> ProblemResponse getProblem()

특정 문제의 상세 정보를 조회합니다<br>🔐 <strong>관리자 권한 필요</strong><br>

### Example

```typescript
import {
    AdminProblemAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminProblemAPIApi(configuration);

let problemId: number; // (default to undefined)

const { status, data } = await apiInstance.getProblem(
    problemId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **problemId** | [**number**] |  | defaults to undefined|


### Return type

**ProblemResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 문제 조회 성공 |  -  |
|**404** | 🚨 문제 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateProblem**
> updateProblem(problemUpdateRequest)

기존 문제를 수정합니다<br>🔐 <strong>관리자 권한 필요</strong><br>

### Example

```typescript
import {
    AdminProblemAPIApi,
    Configuration,
    ProblemUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminProblemAPIApi(configuration);

let problemUpdateRequest: ProblemUpdateRequest; //

const { status, data } = await apiInstance.updateProblem(
    problemUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **problemUpdateRequest** | **ProblemUpdateRequest**|  | |


### Return type

void (empty response body)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | ✅ 문제 수정 성공 |  -  |
|**404** | 🚨 문제 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

