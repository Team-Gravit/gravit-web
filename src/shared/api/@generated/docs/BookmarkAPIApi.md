# BookmarkAPIApi

All URIs are relative to *https://grav-it-dev.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addBookmark**](#addbookmark) | **POST** /api/v1/bookmarks | 북마크 저장|
|[**deleteBookmark**](#deletebookmark) | **DELETE** /api/v1/bookmarks | 북마크 삭제|
|[**getAllBookmarkedProblemInUnit**](#getallbookmarkedprobleminunit) | **GET** /api/v1/bookmarks/{unitId} | 유닛 내 북마크된 문제 조회|

# **addBookmark**
> addBookmark(bookmarkSaveRequest)

특정 문제를 북마크에 추가합니다.<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    BookmarkAPIApi,
    Configuration,
    BookmarkSaveRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BookmarkAPIApi(configuration);

let bookmarkSaveRequest: BookmarkSaveRequest; //

const { status, data } = await apiInstance.addBookmark(
    bookmarkSaveRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **bookmarkSaveRequest** | **BookmarkSaveRequest**|  | |


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
|**200** | ✅ 북마크 저장 성공 |  -  |
|**409** | 🚨 이미 북마크한 문제 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteBookmark**
> deleteBookmark(bookmarkDeleteRequest)

특정 문제의 북마크를 삭제합니다.<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    BookmarkAPIApi,
    Configuration,
    BookmarkDeleteRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BookmarkAPIApi(configuration);

let bookmarkDeleteRequest: BookmarkDeleteRequest; //

const { status, data } = await apiInstance.deleteBookmark(
    bookmarkDeleteRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **bookmarkDeleteRequest** | **BookmarkDeleteRequest**|  | |


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
|**204** | ✅ 북마크 삭제 성공 |  -  |
|**404** | 🚨 북마크 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllBookmarkedProblemInUnit**
> BookmarkedProblemResponse getAllBookmarkedProblemInUnit()

특정 유닛에서 사용자가 북마크한 문제 목록을 조회합니다.<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    BookmarkAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BookmarkAPIApi(configuration);

let unitId: number; // (default to undefined)

const { status, data } = await apiInstance.getAllBookmarkedProblemInUnit(
    unitId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **unitId** | [**number**] |  | defaults to undefined|


### Return type

**BookmarkedProblemResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 북마크된 문제 목록 조회 성공 |  -  |
|**404** | 🚨 옵션 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

