# UnitAPIApi

All URIs are relative to *https://grav-it-dev.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAllUnitInChapter**](#getallunitinchapter) | **GET** /api/v1/units/{chapterId} | 유닛 조회|

# **getAllUnitInChapter**
> UnitPageResponse getAllUnitInChapter()

유저의 유닛 진행도를 포함한 유닛 목록을 조회합니다.<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    UnitAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UnitAPIApi(configuration);

let chapterId: number; // (default to undefined)

const { status, data } = await apiInstance.getAllUnitInChapter(
    chapterId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chapterId** | [**number**] |  | defaults to undefined|


### Return type

**UnitPageResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 유닛 목록 조회 성공 |  -  |
|**404** | 🚨 챕터 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

