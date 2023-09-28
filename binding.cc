#include <napi.h>
#include <windows.h>

class TelemetryAddon : public Napi::Addon<TelemetryAddon> {
public:
  TelemetryAddon(Napi::Env env, Napi::Object exports) {
    DefineAddon(exports, {
      InstanceMethod("read", &TelemetryAddon::Read),
    });
  }

  ~TelemetryAddon() {
    if (hMapFile == nullptr) {
      return;
    }

    CloseHandle(hMapFile);
  }

private:
  HANDLE hMapFile = nullptr;
  LPVOID pMapView = nullptr;

  Napi::Value Read(const Napi::CallbackInfo& info) {
    if (hMapFile == nullptr) {
      hMapFile = OpenFileMappingA(FILE_MAP_READ, false, "ManiaPlanet_Telemetry");

      if (hMapFile == nullptr) {
        throw Napi::Error::New(info.Env(), "Unable to open file mapping");
      }
    }

    if (pMapView == nullptr) {
      pMapView = MapViewOfFile(hMapFile, FILE_MAP_READ, 0, 0, 4096);

      if (pMapView == nullptr) {
        throw Napi::Error::New(info.Env(), "Unable to map the file");
      }
    }

    return Napi::ArrayBuffer::New(info.Env(), pMapView, 4096);
  }
};

NODE_API_ADDON(TelemetryAddon)
