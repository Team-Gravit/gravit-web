# BadgeApi

All URIs are relative to *https://grav-it-dev.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAllMyBadges**](#getallmybadges) | **GET** /api/v1/badges/me | 내 뱃지 목록(카테고리별 정렬) 조회|

# **getAllMyBadges**
> AllBadgesResponse getAllMyBadges()

전체 뱃지 카탈로그를 **카테고리 → 뱃지 display_order** 기준으로 정렬하여 반환합니다.<br> 각 뱃지에는 현재 유저가 획득했는지 여부(earned)가 포함됩니다.<br> 응답의 earnedCount / totalCount로 전체 대비 획득 개수를 확인할 수 있습니다. 

### Example

```typescript
import {
    BadgeApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BadgeApi(configuration);

const { status, data } = await apiInstance.getAllMyBadges();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**AllBadgesResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 내 뱃지 목록 조회 성공 |  -  |
|**500** | 🚨 서버 오류 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

