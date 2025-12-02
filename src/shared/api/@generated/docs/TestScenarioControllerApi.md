# TestScenarioControllerApi

All URIs are relative to *https://grav-it.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createChapterAlmostClearUser**](#createchapteralmostclearuser) | **POST** /api/v1/test/chapter-almost-clear | |
|[**testConsecutiveSolvedUser**](#testconsecutivesolveduser) | **POST** /api/v1/test/consecutive_solved | |

# **createChapterAlmostClearUser**
> number createChapterAlmostClearUser()


### Example

```typescript
import {
    TestScenarioControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TestScenarioControllerApi(configuration);

let userId: number; // (default to undefined)
let chapterId: number; // (default to undefined)

const { status, data } = await apiInstance.createChapterAlmostClearUser(
    userId,
    chapterId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**number**] |  | defaults to undefined|
| **chapterId** | [**number**] |  | defaults to undefined|


### Return type

**number**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **testConsecutiveSolvedUser**
> number testConsecutiveSolvedUser()


### Example

```typescript
import {
    TestScenarioControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TestScenarioControllerApi(configuration);

let userId: number; // (default to undefined)
let consecutiveSolvedCount: number; // (default to undefined)

const { status, data } = await apiInstance.testConsecutiveSolvedUser(
    userId,
    consecutiveSolvedCount
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**number**] |  | defaults to undefined|
| **consecutiveSolvedCount** | [**number**] |  | defaults to undefined|


### Return type

**number**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

