import { il2cppApi, initIl2CppApi } from "./api.js";
import { debugLog } from "../utils/logger.js";

const TARGET_LIB = "liblogic.so";

export interface MappedClasses {
  kSystemData: NativePointer;
  kLogicManager: NativePointer;
  kUIRankHero: NativePointer;
  kLogicFightData: NativePointer;
  kShowFightData: NativePointer;
  kTimerBase: NativePointer;
  kEndCtrl: NativePointer;
  kGameMain: NativePointer;
}

export function startStealthBootstrap(
  onReady: (classes: MappedClasses) => void,
): void {
  debugLog("Bootstrap", `Monitoring for ${TARGET_LIB}...`);
  waitForLogicLibStealth(onReady);
}

function waitForLogicLibStealth(onReady: (classes: MappedClasses) => void): void {
  const mod = Process.findModuleByName(TARGET_LIB);
  if (!mod) {
    setTimeout(() => waitForLogicLibStealth(onReady), 1000);
    return;
  }

  if (!initIl2CppApi(TARGET_LIB)) {
    debugLog("Bootstrap", "Failed initializing C-API bindings.");
    setTimeout(() => waitForLogicLibStealth(onReady), 1000);
    return;
  }

  const il2cpp_init = mod.findExportByName
    ? mod.findExportByName("il2cpp_init")
    : (Module as any).findExportByName(TARGET_LIB, "il2cpp_init");

  const tryStart = () => {
    const classes = mapIl2CppClasses();
    if (classes) {
      onReady(classes);
    } else {
      setTimeout(tryStart, 1000);
    }
  };

  if (il2cpp_init) {
    const il2cpp_domain_get = mod.findExportByName
      ? mod.findExportByName("il2cpp_domain_get")
      : (Module as any).findExportByName(TARGET_LIB, "il2cpp_domain_get");

    let isInitialized = false;
    if (il2cpp_domain_get) {
      try {
        const get_domain = new NativeFunction(il2cpp_domain_get, "pointer", []);
        const domain = get_domain();
        if (domain && !domain.isNull()) {
          isInitialized = true;
        }
      } catch (e) {}
    }

    if (isInitialized) {
      debugLog("Bootstrap", "Il2Cpp runtime is ready. Scanning classes...");
      tryStart();
    } else {
      debugLog("Bootstrap", "Waiting for il2cpp_init to complete...");
      const listener = Interceptor.attach(il2cpp_init, {
        onLeave: function () {
          listener.detach();
          debugLog("Bootstrap", "il2cpp_init finished. Starting hooks...");
          setTimeout(tryStart, 200);
        },
      });
    }
  } else {
    setTimeout(tryStart, 1000);
  }
}

function mapIl2CppClasses(): MappedClasses | null {
  const domain: NativePointer = il2cppApi.domain_get!();
  if (!domain || domain.isNull()) return null;

  const assembliesOut = Memory.alloc(8);
  const assemblies: NativePointer = il2cppApi.domain_get_assemblies!(
    domain,
    assembliesOut,
  );
  if (!assemblies || assemblies.isNull()) return null;

  let image: NativePointer = NULL;
  for (let i = 0; i < 100; i++) {
    try {
      const assembly: NativePointer = assemblies
        .add(i * Process.pointerSize)
        .readPointer();
      if (!assembly || assembly.isNull()) continue;

      const img: NativePointer = il2cppApi.assembly_get_image!(assembly);
      if (!img || img.isNull()) continue;

      const imgNamePtr: NativePointer = il2cppApi.image_get_name!(img);
      if (!imgNamePtr || imgNamePtr.isNull()) continue;

      const imgName = imgNamePtr.readCString();
      if (imgName === "Assembly-CSharp.dll") {
        image = img;
        break;
      }
    } catch (e) {
      break;
    }
  }

  if (!image || image.isNull()) return null;

  let classes: MappedClasses = {
    kSystemData: NULL,
    kLogicManager: NULL,
    kUIRankHero: NULL,
    kLogicFightData: NULL,
    kShowFightData: NULL,
    kTimerBase: NULL,
    kEndCtrl: NULL,
    kGameMain: NULL,
  };

  const classCount = Number(il2cppApi.image_get_class_count!(image));
  for (let j = 0; j < classCount; j++) {
    try {
      const k: NativePointer = il2cppApi.image_get_class!(image, j);
      if (!k || k.isNull()) continue;

      const namePtr: NativePointer = il2cppApi.class_get_name!(k);
      if (!namePtr || namePtr.isNull()) continue;

      const name = namePtr.readCString();
      if (name === "SystemData") classes.kSystemData = k;
      if (name === "LogicBattleManager") classes.kLogicManager = k;
      if (name === "UIRankHero") classes.kUIRankHero = k;
      if (name === "LogicFightData") classes.kLogicFightData = k;
      if (name === "ShowFightData") classes.kShowFightData = k;
      if (name === "TimerBase") classes.kTimerBase = k;
      if (name === "LogicBattleEndCtrl") classes.kEndCtrl = k;
      if (name === "GameMain") classes.kGameMain = k;
    } catch (e) {}
  }

  debugLog("Bootstrap", "Il2Cpp classes mapped successfully.");
  return classes;
}
