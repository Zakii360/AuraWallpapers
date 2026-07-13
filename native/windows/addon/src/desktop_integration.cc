#include <napi.h>

#ifdef _WIN32
#include <windows.h>

namespace {

HWND FindWorkerW() {
  HWND progman = FindWindowW(L"Progman", nullptr);
  if (progman == nullptr) {
    return nullptr;
  }

  // Asking Progman to spawn a WorkerW behind the desktop icons is an
  // undocumented but long-standing technique. The message itself has no
  // meaningful return value; its side effect is what we need.
  SendMessageTimeoutW(progman, 0x052C, 0, 0, SMTO_NORMAL, 1000, nullptr);

  HWND workerW = nullptr;

  EnumWindows(
      [](HWND window, LPARAM out) -> BOOL {
        HWND shellView = FindWindowExW(window, nullptr, L"SHELLDLL_DefView", nullptr);
        if (shellView != nullptr) {
          HWND candidate = FindWindowExW(nullptr, window, L"WorkerW", nullptr);
          if (candidate != nullptr) {
            *reinterpret_cast<HWND*>(out) = candidate;
          }
        }
        return TRUE;
      },
      reinterpret_cast<LPARAM>(&workerW));

  return workerW;
}

HWND BufferToHwnd(const Napi::Buffer<uint8_t>& buffer) {
  if (buffer.Length() < sizeof(HWND)) {
    return nullptr;
  }
  HWND handle;
  memcpy(&handle, buffer.Data(), sizeof(HWND));
  return handle;
}

}  // namespace

Napi::Value Attach(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 1 || !info[0].IsBuffer()) {
    Napi::TypeError::New(env, "attach expects a native window handle buffer").ThrowAsJavaScriptException();
    return env.Null();
  }

  HWND wallpaperWindow = BufferToHwnd(info[0].As<Napi::Buffer<uint8_t>>());
  if (wallpaperWindow == nullptr) {
    return Napi::Boolean::New(env, false);
  }

  HWND workerW = FindWorkerW();
  if (workerW == nullptr) {
    return Napi::Boolean::New(env, false);
  }

  SetParent(wallpaperWindow, workerW);

  LONG_PTR style = GetWindowLongPtrW(wallpaperWindow, GWL_STYLE);
  SetWindowLongPtrW(wallpaperWindow, GWL_STYLE, style & ~WS_POPUP | WS_CHILD);

  SetWindowPos(wallpaperWindow, nullptr, 0, 0, 0, 0,
               SWP_NOMOVE | SWP_NOSIZE | SWP_NOZORDER | SWP_FRAMECHANGED);

  return Napi::Boolean::New(env, true);
}

Napi::Value Detach(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 1 || !info[0].IsBuffer()) {
    return Napi::Boolean::New(env, false);
  }

  HWND wallpaperWindow = BufferToHwnd(info[0].As<Napi::Buffer<uint8_t>>());
  if (wallpaperWindow == nullptr) {
    return Napi::Boolean::New(env, false);
  }

  SetParent(wallpaperWindow, nullptr);
  return Napi::Boolean::New(env, true);
}

Napi::Value IsWorkerWAvailable(const Napi::CallbackInfo& info) {
  return Napi::Boolean::New(info.Env(), FindWorkerW() != nullptr);
}

Napi::Value IsForegroundFullscreen(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  HWND foreground = GetForegroundWindow();
  if (foreground == nullptr) {
    return Napi::Boolean::New(env, false);
  }

  // The desktop (Progman/WorkerW) being focused means no app is fullscreen.
  wchar_t className[256];
  GetClassNameW(foreground, className, 256);
  if (wcscmp(className, L"Progman") == 0 || wcscmp(className, L"WorkerW") == 0) {
    return Napi::Boolean::New(env, false);
  }

  RECT windowRect;
  if (!GetWindowRect(foreground, &windowRect)) {
    return Napi::Boolean::New(env, false);
  }

  HMONITOR monitor = MonitorFromWindow(foreground, MONITOR_DEFAULTTONEAREST);
  MONITORINFO monitorInfo;
  monitorInfo.cbSize = sizeof(MONITORINFO);
  if (!GetMonitorInfoW(monitor, &monitorInfo)) {
    return Napi::Boolean::New(env, false);
  }

  bool coversMonitor = windowRect.left <= monitorInfo.rcMonitor.left &&
                        windowRect.top <= monitorInfo.rcMonitor.top &&
                        windowRect.right >= monitorInfo.rcMonitor.right &&
                        windowRect.bottom >= monitorInfo.rcMonitor.bottom;

  return Napi::Boolean::New(env, coversMonitor);
}

#else  // !_WIN32

Napi::Value Attach(const Napi::CallbackInfo& info) {
  Napi::Error::New(info.Env(), "aura_desktop is only available on Windows").ThrowAsJavaScriptException();
  return info.Env().Null();
}

Napi::Value Detach(const Napi::CallbackInfo& info) {
  Napi::Error::New(info.Env(), "aura_desktop is only available on Windows").ThrowAsJavaScriptException();
  return info.Env().Null();
}

Napi::Value IsWorkerWAvailable(const Napi::CallbackInfo& info) {
  return Napi::Boolean::New(info.Env(), false);
}

Napi::Value IsForegroundFullscreen(const Napi::CallbackInfo& info) {
  return Napi::Boolean::New(info.Env(), false);
}

#endif

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("attach", Napi::Function::New(env, Attach));
  exports.Set("detach", Napi::Function::New(env, Detach));
  exports.Set("isWorkerWAvailable", Napi::Function::New(env, IsWorkerWAvailable));
  exports.Set("isForegroundFullscreen", Napi::Function::New(env, IsForegroundFullscreen));
  return exports;
}

NODE_API_MODULE(aura_desktop, Init)
