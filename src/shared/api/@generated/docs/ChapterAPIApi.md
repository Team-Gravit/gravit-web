# ChapterAPIApi

All URIs are relative to *https://grav-it.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAllChapter**](#getallchapter) | **GET** /api/v1/chapters | 챕터 조회|

# **getAllChapter**
> Array<ChapterDetailResponse> getAllChapter()

유저의 챕터 진행도를 포함한 챕터 목록을 조회합니다.<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    ChapterAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChapterAPIApi(configuration);

const { status, data } = await apiInstance.getAllChapter();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<ChapterDetailResponse>**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 챕터 목록 조회 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

