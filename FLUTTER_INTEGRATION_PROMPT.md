# Flutter Integration Prompt — Copilot দিয়ে ব্যবহার করো

> তোমার CoU Bus Tracker Flutter app এ Remote Config integration add করতে হবে যাতে Super Admin Panel থেকে base URL / app version / maintenance mode control করা যায়। নিচের prompt টা তোমার Flutter project root এ একটা `.md` file হিসেবে save করো (যেমন `FLUTTER_REMOTE_CONFIG_TASK.md`), তারপর Copilot Chat এ open করে বলো: **"Please implement the requirements in @FLUTTER_REMOTE_CONFIG_TASK.md"**

---

## 📋 Copy-paste ready prompt for Copilot

```markdown
# CoU Bus Tracker — Remote Config Integration

## Goal
Add Remote Configuration support to the Flutter app so it can be controlled
from the new Super Admin Panel. The Flutter app should fetch runtime config
from the backend on every launch and apply:
1. **Maintenance mode** → full-screen blocking overlay if enabled
2. **App version check** → force-update dialog if user's version is too old
3. **API base URL** → swap Dio base URL dynamically so we don't need to
   release a new app version when the backend URL changes

## Backend contract (already implemented)

GET http://localhost:8080/api/config    (no auth required)

Response JSON:
{
  "apiBaseUrl":        "http://localhost:8080/api",
  "latestAppVersion":  "1.2.0",
  "minimumAppVersion": "1.0.0",
  "forceUpdate":       false,
  "updateMessage":     "নতুন ভার্সন পাওয়া গেছে! আপডেট করুন।",
  "playStoreUrl":      "https://play.google.com/store/apps/details?id=com.cou.bustracker",
  "maintenanceMode":   false,
  "maintenanceMessage":"অ্যাপটি রক্ষণাবেক্ষণে আছে। শীঘ্রই ফিরে আসছি।"
}

## Existing project conventions (follow these)

- State management: **Riverpod 2.x** with `StateNotifierProvider` /
  `FutureProvider`
- HTTP: **Dio** with a single `ApiClient` in `lib/core/api_client.dart`
- Routing: **go_router**
- Storage: `flutter_secure_storage` for JWT, `shared_preferences` for cache
- Theme: existing custom theme in `lib/app/theme.dart`
- Bengali-first UI: use existing translation keys if any; otherwise hardcode
  Bengali strings
- Models live in `lib/shared/models/`
- Repositories live in `lib/features/<feature>/<feature>_repository.dart`

## Tasks

### Task 1 — Add RemoteConfig model

Create `lib/shared/models/remote_config.dart`:

```dart
import 'package:json_annotation/json_annotation.dart';

part 'remote_config.g.dart';

@JsonSerializable()
class RemoteConfig {
  final String apiBaseUrl;
  final String latestAppVersion;
  final String minimumAppVersion;
  final bool forceUpdate;
  final String updateMessage;
  final String playStoreUrl;
  final bool maintenanceMode;
  final String maintenanceMessage;

  const RemoteConfig({
    required this.apiBaseUrl,
    required this.latestAppVersion,
    required this.minimumAppVersion,
    required this.forceUpdate,
    required this.updateMessage,
    required this.playStoreUrl,
    required this.maintenanceMode,
    required this.maintenanceMessage,
  });

  factory RemoteConfig.fromJson(Map<String, dynamic> json) =>
      _$RemoteConfigFromJson(json);

  Map<String, dynamic> toJson() => _$RemoteConfigToJson(this);

  factory RemoteConfig.defaults() => const RemoteConfig(
    apiBaseUrl: 'https://cou-bus-tracker-backend-admin-frontend.onrender.com/api',
    latestAppVersion: '1.0.0',
    minimumAppVersion: '1.0.0',
    forceUpdate: false,
    updateMessage: 'নতুন ভার্সন পাওয়া গেছে! আপডেট করুন।',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.cou.bustracker',
    maintenanceMode: false,
    maintenanceMessage: 'অ্যাপটি রক্ষণাবেক্ষণে আছে। শীঘ্রই ফিরে আসছি।',
  );
}
```

Run `flutter pub run build_runner build --delete-conflicting-outputs`.

### Task 2 — Add RemoteConfigRepository

Create `lib/features/remote_config/remote_config_repository.dart`:

```dart
import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../shared/models/remote_config.dart';

class RemoteConfigRepository {
  static const _cacheKey = 'remote_config_json_v1';
  static const _fetchTimeoutSec = 5;

  final Dio _publicDio; // Dio instance WITHOUT auth interceptor (we use a
                         // raw Dio for this endpoint because the call is
                         // public and we want it to work even when logged out)

  RemoteConfigRepository(this._publicDio);

  Future<RemoteConfig> fetch({bool useCacheOnError = true}) async {
    try {
      final res = await _publicDio.get(
        '/config',
        options: Options(
          receiveTimeout: const Duration(seconds: _fetchTimeoutSec),
          sendTimeout: const Duration(seconds: _fetchTimeoutSec),
        ),
      );
      final cfg = RemoteConfig.fromJson(res.data as Map<String, dynamic>);
      await _persist(cfg);
      return cfg;
    } catch (e) {
      if (useCacheOnError) {
        final cached = await _readCache();
        if (cached != null) return cached;
      }
      return RemoteConfig.defaults();
    }
  }

  Future<void> _persist(RemoteConfig cfg) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_cacheKey, jsonEncode(cfg.toJson()));
  }

  Future<RemoteConfig?> _readCache() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_cacheKey);
    if (raw == null) return null;
    try {
      return RemoteConfig.fromJson(jsonDecode(raw) as Map<String, dynamic>);
    } catch (_) {
      return null;
    }
  }
}
```

### Task 3 — Add public Dio instance in api_client.dart

In `lib/core/api_client.dart`, add a second Dio instance WITHOUT the
auth/refresh interceptors:

```dart
/// Public Dio for unauthenticated calls (no JWT attached).
Dio createPublicDio() {
  final dio = Dio(BaseOptions(
    baseUrl: 'https://cou-bus-tracker-backend-admin-frontend.onrender.com/api',
    connectTimeout: const Duration(seconds: 15),
    receiveTimeout: const Duration(seconds: 15),
    headers: {'Accept': 'application/json'},
  ));
  return dio;
}
```

This default URL is the fallback only — the live URL comes from RemoteConfig.

### Task 4 — Wire Riverpod providers

In `lib/features/providers.dart` (or a new `lib/features/remote_config/providers.dart`):

```dart
final publicDioProvider = Provider<Dio>((ref) => createPublicDio());

final remoteConfigRepositoryProvider = Provider<RemoteConfigRepository>(
  (ref) => RemoteConfigRepository(ref.watch(publicDioProvider)),
);

final remoteConfigProvider = FutureProvider<RemoteConfig>((ref) async {
  return ref.watch(remoteConfigRepositoryProvider).fetch();
});
```

Also expose a sync getter that reads cached config without awaiting (for
splash screen fast-path):

```dart
Future<RemoteConfig> readCachedRemoteConfig() async {
  final prefs = await SharedPreferences.getInstance();
  final raw = prefs.getString('remote_config_json_v1');
  if (raw == null) return RemoteConfig.defaults();
  try {
    return RemoteConfig.fromJson(jsonDecode(raw) as Map<String, dynamic>);
  } catch (_) {
    return RemoteConfig.defaults();
  }
}
```

### Task 5 — Dynamic Dio base URL

The existing main `Dio` in `api_client.dart` needs its `baseUrl` to be
updatable at runtime. Add a setter:

```dart
class ApiClient {
  final Dio _dio;
  String get baseUrl => _dio.options.baseUrl;
  set baseUrl(String value) {
    _dio.options.baseUrl = value;
  }
  // ... existing methods
}
```

In the main app bootstrap (after fetching remote config):

```dart
final cfg = await ref.read(remoteConfigProvider.future);
ref.read(apiClientProvider).baseUrl = cfg.apiBaseUrl;
```

This way the rest of the app keeps using the existing `apiClientProvider`
without modification.

### Task 6 — Splash-screen gating

In your splash screen (`lib/features/splash/`), after the existing 3s
animation finishes, before navigating:

```dart
final cfg = await ref.read(remoteConfigProvider.future);

// 1. Apply base URL
ref.read(apiClientProvider).baseUrl = cfg.apiBaseUrl;

// 2. Check maintenance
if (cfg.maintenanceMode) {
  // navigate to /maintenance (full-screen route) and stop here
  return;
}

// 3. Check version
final currentVersion = await _getCurrentAppVersion(); // from package_info_plus
if (_isVersionLessThan(currentVersion, cfg.minimumAppVersion) ||
    (cfg.forceUpdate && _isVersionLessThan(currentVersion, cfg.latestAppVersion))) {
  // navigate to /force-update (full-screen route) and stop here
  return;
}

// Optional: soft update snackbar
if (_isVersionLessThan(currentVersion, cfg.latestAppVersion)) {
  // show a non-blocking snackbar with "Update" action -> launchUrl(cfg.playStoreUrl)
}

// proceed with normal navigation (auth check, etc.)
```

`_isVersionLessThan` helper (semver compare):

```dart
int _compareSemver(String a, String b) {
  final pa = a.split('.').map(int.parse).toList();
  final pb = b.split('.').map(int.parse).toList();
  for (var i = 0; i < 3; i++) {
    final diff = (pa[i] - pb[i]);
    if (diff != 0) return diff;
  }
  return 0;
}
bool _isVersionLessThan(String current, String required) =>
    _compareSemver(current, required) < 0;
```

### Task 7 — Full-screen routes

Add two new routes in `lib/app/router.dart`:

- `/maintenance` → renders `MaintenanceScreen` (full-screen, Bengali message
  from config, no exit button)
- `/force-update` → renders `ForceUpdateScreen` (Bengali message, single
  "আপডেট করুন" button that calls `launchUrl(cfg.playStoreUrl,
  mode: LaunchMode.externalApplication)`)

### Task 8 — Add `package_info_plus` dependency

Add to `pubspec.yaml`:
```yaml
dependencies:
  package_info_plus: ^8.0.2
  url_launcher: ^6.3.1   # if not already present
```

Run `flutter pub get`.

### Task 9 — Make sure existing code paths still work

- After splash, before any feature screen calls the API, ensure
  `apiClientProvider`'s baseUrl has been updated. Simplest: do the update
  in the splash screen itself (Task 6 step 1).
- Cache-first: if the user has no network on launch, they still see the
  last known config (or defaults).

## Acceptance criteria

1. ✅ On first launch (no cache), app fetches `/api/config`, stores it, and
   uses the returned `apiBaseUrl` for all subsequent API calls.
2. ✅ When the Super Admin Panel flips `maintenance_mode` to `true`, the next
   app launch shows the maintenance screen instead of normal UI.
3. ✅ When the Super Admin Panel bumps `minimum_app_version` and enables
   `force_update`, users on the old version see the force-update screen.
4. ✅ When the Super Admin Panel changes `api_base_url`, the next app
   launch uses the new URL (no app store update required).
5. ✅ When the device is offline, the app launches with the last cached
   config (or defaults) and continues to work as before.
6. ✅ Notice broadcasting works out-of-the-box (no Flutter changes needed —
   the existing `/api/notices/active` endpoint already returns notices
   created by Super Admin Panel).

## Out of scope (do NOT implement)

- Push notifications via FCM
- Multi-language UI for the update prompt
- Remote-config versioning / A/B testing
```

---

## ✅ তোমার next steps

1. **Backend start করো:**
   ```bash
   cd "d:\Java Development\CoU Bus Tracker\Backend"
   ./mvnw spring-boot:run
   ```
   Logs এ দেখবে: `Migrating schema ... to version 16 - create super admins and app config`
   আর: `Seeded default super admin: superadmincou@gmail.com`

2. **Quick smoke test (curl):**
   ```bash
   # Public config
   curl http://localhost:8080/api/config

   # Super admin login
   curl -X POST http://localhost:8080/api/super-admin/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"superadmincou@gmail.com","password":"Admin@123"}'
   ```

3. **Super Admin Panel চালু করো:**
   ```bash
   cd "d:\Java Development\CoU Bus Tracker\super_admin"
   npm install
   npm run dev
   ```
   Browser এ `http://localhost:5174` open করো, login করো।

4. **Flutter app এ Copilot দিয়ে integrate করো:**
   - উপরের prompt কপি করে তোমার Flutter project এ `FLUTTER_REMOTE_CONFIG_TASK.md` হিসেবে save করো
   - Copilot Chat এ বলো: **"Please implement the requirements in @FLUTTER_REMOTE_CONFIG_TASK.md"**

5. **আমাকে report করো** যে কোন step এ সমস্যা হচ্ছে — fix করে দেব।
