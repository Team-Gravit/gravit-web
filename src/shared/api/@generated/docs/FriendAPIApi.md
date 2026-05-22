# FriendAPIApi

All URIs are relative to *https://grav-it-dev.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**following**](#following) | **POST** /api/v1/friends/following/{followeeId} | 팔로잉|
|[**getFollowAndFollowingCount**](#getfollowandfollowingcount) | **GET** /api/v1/friends/count | 팔로워/팔로잉 카운트 조회|
|[**getFollowers**](#getfollowers) | **GET** /api/v1/friends/follower | 팔로워 목록 조회|
|[**getFollowings**](#getfollowings) | **GET** /api/v1/friends/following | 팔로잉 목록 조회|
|[**rejectFollowing**](#rejectfollowing) | **POST** /api/v1/friends/reject-following/{followerId} | 팔로잉 거절 |
|[**search**](#search) | **GET** /api/v1/friends/search | 핸들&amp;닉네임 검색|
|[**unFollowing**](#unfollowing) | **POST** /api/v1/friends/unfollowing/{followeeId} | 언팔로잉|

# **following**
> FriendResponse following()

다른 사용자를 팔로잉합니다<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    FriendAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FriendAPIApi(configuration);

let followeeId: number; //팔로잉할 대상 유저 ID (default to undefined)

const { status, data } = await apiInstance.following(
    followeeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **followeeId** | [**number**] | 팔로잉할 대상 유저 ID | defaults to undefined|


### Return type

**FriendResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 팔로잉 성공 |  -  |
|**400** | 🚨 자기 자신 팔로잉 불가 |  -  |
|**404** | 🚨 팔로우 대상 유저 조회 실패 |  -  |
|**409** | 🚨 이미 팔로잉 중인 유저 |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getFollowAndFollowingCount**
> FollowCountsResponse getFollowAndFollowingCount()

현재 사용자의 팔로워 수와 팔로잉 수를 조회합니다.<br> 🔐 <strong>Jwt 필요</strong><br> 

### Example

```typescript
import {
    FriendAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FriendAPIApi(configuration);

const { status, data } = await apiInstance.getFollowAndFollowingCount();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**FollowCountsResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 카운트 조회 성공 |  -  |
|**404** | 🚨 존재하지 않는 유저입니다 |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getFollowers**
> SliceResponseFollowerResponse getFollowers()

현재 사용자를 팔로우하고 있는 사용자 목록을 조회합니다<br>🔐 <strong>Jwt 필요</strong><br><strong>Slice 페이징을 적용합니다</strong><br>쿼리 파라미터로 page 값을 보내주세요(0부터 시작)

### Example

```typescript
import {
    FriendAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FriendAPIApi(configuration);

let page: number; // (optional) (default to 0)

const { status, data } = await apiInstance.getFollowers(
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | (optional) defaults to 0|


### Return type

**SliceResponseFollowerResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 팔로워 목록 조회 성공 |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getFollowings**
> SliceResponseFollowingResponse getFollowings()

현재 사용자가 팔로잉하고 있는 사용자 목록을 조회합니다<br>🔐 <strong>Jwt 필요</strong><br><strong>Slice 페이징을 적용합니다</strong><br>쿼리 파라미터로 page 값을 보내주세요(0부터 시작)

### Example

```typescript
import {
    FriendAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FriendAPIApi(configuration);

let page: number; // (optional) (default to 0)

const { status, data } = await apiInstance.getFollowings(
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | (optional) defaults to 0|


### Return type

**SliceResponseFollowingResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 팔로잉 목록 조회 성공 |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **rejectFollowing**
> rejectFollowing()

다른 사용자가 나에게 보낸 팔로잉을 거절합니다.<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    FriendAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FriendAPIApi(configuration);

let followerId: number; //나를 팔로잉한 대상 유저 ID (default to undefined)

const { status, data } = await apiInstance.rejectFollowing(
    followerId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **followerId** | [**number**] | 나를 팔로잉한 대상 유저 ID | defaults to undefined|


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
|**200** | ✅ 팔로잉 거절 성공 |  -  |
|**404** | 🚨 팔로우 내역 조회 실패 |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **search**
> SliceResponse search()

사용자 핸들&닉네임 으로 팔로우 대상 검색을 수행합니다.<br> - (핸들의 경우) <br> - 입력이 \'@\' 부터 시작하면 handle 기반 조회를 시도합니다. <br> - 입력은 정규화됩니다: 선두 \'@\' 제거, 유니코드 정규화(NFKC), 소문자화, 허용 문자만 유지(소문자,숫자).<br> - 매칭 우선순위: 정확 일치 > 접두 일치 > 부분 일치.<br> - (닉네임의 경우) <br> - 입력이 문자(알파벳, 한글) 이나 숫자로 시작하면 nickname 기반 조회를 시도합니다 <br> - 입력은 정규화 됩니다. 유니코드 정규화(NFKC), 소문자화, 허용 문자만 유지(소문자, 한글, 숫자).<br> - 매칭 우선순위: 정확 일치 > 접두 일치 > 부분 일치.<br> 🔐 <strong>Jwt 필요</strong><br> 🔐 <strong>다음 페이지가 존재하면 hasNextPage 가 true, 없으면 false</strong><br> 

### Example

```typescript
import {
    FriendAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FriendAPIApi(configuration);

let queryText: string; //검색할 핸들 문자열 (선두 \'@\' 허용, 대소문자 무시) (default to undefined)
let page: number; //0부터 시작하는 페이지 인덱스 (optional) (default to 0)

const { status, data } = await apiInstance.search(
    queryText,
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **queryText** | [**string**] | 검색할 핸들 문자열 (선두 \&#39;@\&#39; 허용, 대소문자 무시) | defaults to undefined|
| **page** | [**number**] | 0부터 시작하는 페이지 인덱스 | (optional) defaults to 0|


### Return type

**SliceResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 검색 성공 |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **unFollowing**
> unFollowing()

다른 사용자에 대한 팔로잉을 취소합니다<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    FriendAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FriendAPIApi(configuration);

let followeeId: number; //언팔로잉할 대상 유저 ID (default to undefined)

const { status, data } = await apiInstance.unFollowing(
    followeeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **followeeId** | [**number**] | 언팔로잉할 대상 유저 ID | defaults to undefined|


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
|**200** | ✅ 언팔로잉 성공 |  -  |
|**404** | 🚨 팔로우 내역 조회 실패 |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

