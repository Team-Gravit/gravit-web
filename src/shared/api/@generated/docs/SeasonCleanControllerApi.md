# SeasonCleanControllerApi

All URIs are relative to *https://grav-it.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**cleanSeason**](#cleanseason) | **POST** /api/v1/test/season/clean | |

# **cleanSeason**
> cleanSeason()


### Example

```typescript
import {
    SeasonCleanControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SeasonCleanControllerApi(configuration);

const { status, data } = await apiInstance.cleanSeason();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

