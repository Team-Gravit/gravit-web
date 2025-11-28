# LearningAPIApi

All URIs are relative to *https://grav-it.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteBookmark**](#deletebookmark) | **DELETE** /api/v1/learning/bookmarks | 북마크 삭제|
|[**deleteWrongAnsweredNote**](#deletewronganswerednote) | **DELETE** /api/v1/learning/wrong-answered-notes | 오답노트 삭제|
|[**getAllChapters**](#getallchapters) | **GET** /api/v1/learning/chapters | 챕터 조회|
|[**getAllLessonsInUnit**](#getalllessonsinunit) | **GET** /api/v1/learning/{unitId}/lessons | 레슨 목록 조회|
|[**getAllProblemsInLesson**](#getallproblemsinlesson) | **GET** /api/v1/learning/{lessonId} | 레슨 문제 조회|
|[**getAllUnitsInChapter**](#getallunitsinchapter) | **GET** /api/v1/learning/{chapterId}/units | 유닛 조회|
|[**getBookmarkedProblemsInUnit**](#getbookmarkedproblemsinunit) | **GET** /api/v1/learning/{unitId}/bookmarks | 유닛 내 북마크된 문제 조회|
|[**getWrongAnsweredProblemsInUnit**](#getwrongansweredproblemsinunit) | **GET** /api/v1/learning/{unitId}/wrong-answered-notes | 유닛 내 오답 문제 조회|
|[**saveBookmark**](#savebookmark) | **POST** /api/v1/learning/bookmarks | 북마크 저장|
|[**saveLearningSubmission**](#savelearningsubmission) | **POST** /api/v1/learning/lessons/results | 학습 결과 저장|
|[**saveProblemSubmission**](#saveproblemsubmission) | **POST** /api/v1/learning/problems/results | 문제 결과 저장|
|[**submitProblemReport**](#submitproblemreport) | **POST** /api/v1/learning/reports | 문제 신고 제출|

# **deleteBookmark**
> deleteBookmark(bookmarkDeleteRequest)

특정 문제의 북마크를 삭제합니다<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    LearningAPIApi,
    Configuration,
    BookmarkDeleteRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new LearningAPIApi(configuration);

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

# **deleteWrongAnsweredNote**
> deleteWrongAnsweredNote(wrongAnsweredNoteDeleteRequest)

특정 문제의 오답노트를 삭제합니다<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    LearningAPIApi,
    Configuration,
    WrongAnsweredNoteDeleteRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new LearningAPIApi(configuration);

let wrongAnsweredNoteDeleteRequest: WrongAnsweredNoteDeleteRequest; //

const { status, data } = await apiInstance.deleteWrongAnsweredNote(
    wrongAnsweredNoteDeleteRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **wrongAnsweredNoteDeleteRequest** | **WrongAnsweredNoteDeleteRequest**|  | |


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
|**204** | ✅ 오답노트 삭제 성공 |  -  |
|**404** | 🚨 오답노트 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllChapters**
> Array<ChapterDetailResponse> getAllChapters()

유저의 챕터 진행도를 포함한 챕터 목록을 조회합니다.<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    LearningAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LearningAPIApi(configuration);

const { status, data } = await apiInstance.getAllChapters();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<ChapterDetailResponse>**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 챕터 목록 조회 성공 |  -  |
|**404** | 🚨 유저 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllLessonsInUnit**
> LessonDetailResponse getAllLessonsInUnit()

특정 유닛의 레슨 목록을 조회합니다.<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    LearningAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LearningAPIApi(configuration);

let unitId: number; // (default to undefined)

const { status, data } = await apiInstance.getAllLessonsInUnit(
    unitId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **unitId** | [**number**] |  | defaults to undefined|


### Return type

**LessonDetailResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 레슨 목록 조회 성공 |  -  |
|**404** | 🚨 유저 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllProblemsInLesson**
> LessonResponse getAllProblemsInLesson()

특정 레슨을 구성하는 문제 목록을 조회합니다.<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    LearningAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LearningAPIApi(configuration);

let lessonId: number; // (default to undefined)

const { status, data } = await apiInstance.getAllProblemsInLesson(
    lessonId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **lessonId** | [**number**] |  | defaults to undefined|


### Return type

**LessonResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 레슨 문제 목록 조회 성공 |  -  |
|**404** | 🚨 옵션 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllUnitsInChapter**
> UnitDetailResponse getAllUnitsInChapter()

유저의 유닛 진행도를 포함한 유닛 목록을 조회합니다.<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    LearningAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LearningAPIApi(configuration);

let chapterId: number; // (default to undefined)

const { status, data } = await apiInstance.getAllUnitsInChapter(
    chapterId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chapterId** | [**number**] |  | defaults to undefined|


### Return type

**UnitDetailResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 유닛 목록 조회 성공 |  -  |
|**404** | 🚨 유저 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getBookmarkedProblemsInUnit**
> BookmarkedProblemResponse getBookmarkedProblemsInUnit()

특정 유닛에서 사용자가 북마크한 문제 목록을 조회합니다<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    LearningAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LearningAPIApi(configuration);

let unitId: number; // (default to undefined)

const { status, data } = await apiInstance.getBookmarkedProblemsInUnit(
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

# **getWrongAnsweredProblemsInUnit**
> WrongAnsweredProblemsResponse getWrongAnsweredProblemsInUnit()

특정 유닛에서 사용자가 틀린 문제 목록을 조회합니다<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    LearningAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LearningAPIApi(configuration);

let unitId: number; // (default to undefined)

const { status, data } = await apiInstance.getWrongAnsweredProblemsInUnit(
    unitId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **unitId** | [**number**] |  | defaults to undefined|


### Return type

**WrongAnsweredProblemsResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 오답 문제 목록 조회 성공 |  -  |
|**404** | 🚨 옵션 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **saveBookmark**
> saveBookmark(bookmarkSaveRequest)

특정 문제를 북마크에 추가합니다<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    LearningAPIApi,
    Configuration,
    BookmarkSaveRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new LearningAPIApi(configuration);

let bookmarkSaveRequest: BookmarkSaveRequest; //

const { status, data } = await apiInstance.saveBookmark(
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

# **saveLearningSubmission**
> LearningSubmissionSaveResponse saveLearningSubmission(learningSubmissionSaveRequest)

레슨 완료 후 문제 풀이 결과를 저장하고 사용자 레벨을 업데이트합니다<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    LearningAPIApi,
    Configuration,
    LearningSubmissionSaveRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new LearningAPIApi(configuration);

let learningSubmissionSaveRequest: LearningSubmissionSaveRequest; //

const { status, data } = await apiInstance.saveLearningSubmission(
    learningSubmissionSaveRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **learningSubmissionSaveRequest** | **LearningSubmissionSaveRequest**|  | |


### Return type

**LearningSubmissionSaveResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 학습 결과 저장 성공 |  -  |
|**404** | 🚨 레슨 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **saveProblemSubmission**
> saveProblemSubmission(problemSubmissionRequest)

문제 풀이 결과를 저장합니다<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    LearningAPIApi,
    Configuration,
    ProblemSubmissionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new LearningAPIApi(configuration);

let problemSubmissionRequest: ProblemSubmissionRequest; //

const { status, data } = await apiInstance.saveProblemSubmission(
    problemSubmissionRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **problemSubmissionRequest** | **ProblemSubmissionRequest**|  | |


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
|**200** | ✅ 문제 결과 저장 성공 |  -  |
|**404** | 🚨 유저 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **submitProblemReport**
> submitProblemReport(problemReportSubmitRequest)

특정 문제에 대한 오류를 신고합니다<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    LearningAPIApi,
    Configuration,
    ProblemReportSubmitRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new LearningAPIApi(configuration);

let problemReportSubmitRequest: ProblemReportSubmitRequest; //

const { status, data } = await apiInstance.submitProblemReport(
    problemReportSubmitRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **problemReportSubmitRequest** | **ProblemReportSubmitRequest**|  | |


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
|**200** | ✅ 문제 신고 제출 성공 |  -  |
|**404** | 🚨 문제 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

