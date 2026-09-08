import { getCachedUtf8String, il2cppApi, readCsharpString } from "../core/api.js";
import { debugLog } from "../utils/logger.js";

let fieldVerReal: NativePointer | null = null;
let fieldInnerVer: NativePointer | null = null;
const persistentVerPtr = Memory.alloc(Process.pointerSize);

function resolveStaticField(kGameMain: NativePointer, fieldName: string): NativePointer | null {
  if (!kGameMain || kGameMain.isNull() || !il2cppApi.class_get_field_from_name) return null;
  try {
    const fp: NativePointer = il2cppApi.class_get_field_from_name(
      kGameMain,
      getCachedUtf8String(fieldName),
    );
    if (fp && !fp.isNull()) return fp;
  } catch (e) {}
  return null;
}

function readStaticString(field: NativePointer | null): string {
  if (!field || field.isNull() || !il2cppApi.field_static_get_value) return "";
  try {
    il2cppApi.field_static_get_value(field, persistentVerPtr);
    const strPtr = persistentVerPtr.readPointer();
    if (!strPtr || strPtr.isNull()) return "";
    return readCsharpString(strPtr);
  } catch (e) {
    return "";
  }
}

export function setupVersionHook(kGameMain: NativePointer): void {
  if (!kGameMain || kGameMain.isNull()) return;
  try {
    fieldVerReal = resolveStaticField(kGameMain, "m_sInnerVerRealForBattle");
    fieldInnerVer = resolveStaticField(kGameMain, "m_strInnerVer");
    if (fieldVerReal || fieldInnerVer) {
      debugLog("Version", "GameMain version field resolved (stealth static read).");
    }
  } catch (e) {}
}

export function getVersionInGame(): string {
  const v = readStaticString(fieldVerReal);
  if (v) return v;
  return readStaticString(fieldInnerVer);
}
