# MyLeagueProfileAPIApi

All URIs are relative to *https://grav-it.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getMyLeagueWithProfile**](#getmyleaguewithprofile) | **GET** /api/v1/ranking/me | 내 리그·랭킹 요약 조회|

# **getMyLeagueWithProfile**
> MyLeagueRankWithProfileResponse getMyLeagueWithProfile()

인증된 사용자의 현재 리그를 기준으로 랭킹 및 프로필 요약 정보를 반환합니다.<br> 🔐 <strong>Jwt 필요</strong> 

### Example

```typescript
import {
    MyLeagueProfileAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MyLeagueProfileAPIApi(configuration);

const { status, data } = await apiInstance.getMyLeagueWithProfile();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**MyLeagueRankWithProfileResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 조회 성공 |  -  |
|**404** | 🚨 유저 조회 실패 |  -  |
|**500** | 서버 내부 에러 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

