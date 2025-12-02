# TestEventControllerApi

All URIs are relative to *https://grav-it.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**mission**](#mission) | **POST** /api/v1/test/mission-completed | |
|[**planetCompleted**](#planetcompleted) | **POST** /api/v1/test/planet-completed | |
|[**qualified**](#qualified) | **POST** /api/v1/test/qualified-solved | |
|[**streak**](#streak) | **POST** /api/v1/test/streak | |

# **mission**
> mission(missionCompletedEvent)


### Example

```typescript
import {
    TestEventControllerApi,
    Configuration,
    MissionCompletedEvent
} from './api';

const configuration = new Configuration();
const apiInstance = new TestEventControllerApi(configuration);

let missionCompletedEvent: MissionCompletedEvent; //

const { status, data } = await apiInstance.mission(
    missionCompletedEvent
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **missionCompletedEvent** | **MissionCompletedEvent**|  | |


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
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **planetCompleted**
> planetCompleted(lessonCompletedEvent)


### Example

```typescript
import {
    TestEventControllerApi,
    Configuration,
    LessonCompletedEvent
} from './api';

const configuration = new Configuration();
const apiInstance = new TestEventControllerApi(configuration);

let lessonCompletedEvent: LessonCompletedEvent; //

const { status, data } = await apiInstance.planetCompleted(
    lessonCompletedEvent
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **lessonCompletedEvent** | **LessonCompletedEvent**|  | |


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
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **qualified**
> qualified(qualifiedSolvedEvent)


### Example

```typescript
import {
    TestEventControllerApi,
    Configuration,
    QualifiedSolvedEvent
} from './api';

const configuration = new Configuration();
const apiInstance = new TestEventControllerApi(configuration);

let qualifiedSolvedEvent: QualifiedSolvedEvent; //

const { status, data } = await apiInstance.qualified(
    qualifiedSolvedEvent
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **qualifiedSolvedEvent** | **QualifiedSolvedEvent**|  | |


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
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **streak**
> streak(consecutiveSolvedEvent)


### Example

```typescript
import {
    TestEventControllerApi,
    Configuration,
    ConsecutiveSolvedEvent
} from './api';

const configuration = new Configuration();
const apiInstance = new TestEventControllerApi(configuration);

let consecutiveSolvedEvent: ConsecutiveSolvedEvent; //

const { status, data } = await apiInstance.streak(
    consecutiveSolvedEvent
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **consecutiveSolvedEvent** | **ConsecutiveSolvedEvent**|  | |


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
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

