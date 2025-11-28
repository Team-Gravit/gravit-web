# LeagueAPIApi

All URIs are relative to *https://grav-it.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**enterHome**](#enterhome) | **GET** /api/v1/league/home | 리그 페이지 home 조회|
|[**getLeague**](#getleague) | **GET** /api/v1/league/{leagueId} | 리그 단건 조회|

# **enterHome**
> LeagueHomeResponse enterHome()

리그 페이지에 필요한 시즌 정보 및 팝업 데이터를 리턴합니다.<br> 시즌 정보는 필수적으로 포함합니다<br> containsPopup 필드가 true 면, lastSeasonPopup 에 팝업 정보를 포함합니다. <br> containsPopup 필드가 false 면, lastSeasonPopup 은 null 값을 가집니다.

### Example

```typescript
import {
    LeagueAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LeagueAPIApi(configuration);

const { status, data } = await apiInstance.enterHome();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**LeagueHomeResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 리그 home 조회 성공 |  -  |
|**404** | 🚨 시즌 조회 실패(미존재) |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getLeague**
> LeagueResponse getLeague()

리그 ID로 리그 정보를 조회합니다<br> <strong>리그 단건 조회는 현재 디자인상 사용하지 않아도 됩니다</strong>

### Example

```typescript
import {
    LeagueAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LeagueAPIApi(configuration);

let leagueId: number; // (default to undefined)

const { status, data } = await apiInstance.getLeague(
    leagueId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **leagueId** | [**number**] |  | defaults to undefined|


### Return type

**LeagueResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 리그 조회 성공 |  -  |
|**404** | 🚨 리그 조회 실패(미존재) |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

