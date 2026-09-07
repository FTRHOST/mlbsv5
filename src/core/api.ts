/**
 * Native C-API Il2Cpp Bindings & Memory Helpers
 */

export interface Il2CppCExports {
  targetLib: Module | null;
  domain_get: ((...args: any[]) => NativePointer) | null;
  domain_get_assemblies: ((...args: any[]) => NativePointer) | null;
  assembly_get_image: ((...args: any[]) => NativePointer) | null;
  image_get_name: ((...args: any[]) => NativePointer) | null;
  image_get_class_count: ((...args: any[]) => UInt64) | null;
  image_get_class: ((...args: any[]) => NativePointer) | null;
  class_get_name: ((...args: any[]) => NativePointer) | null;
  class_get_parent: ((...args: any[]) => NativePointer) | null;
  class_get_method_from_name: ((...args: any[]) => NativePointer) | null;
  class_get_field_from_name: ((...args: any[]) => NativePointer) | null;
  field_static_get_value: ((...args: any[]) => void) | null;
  field_get_offset: ((...args: any[]) => number) | null;
  object_get_class: ((...args: any[]) => NativePointer) | null;
  class_get_methods: ((...args: any[]) => NativePointer) | null;
  method_get_name: ((...args: any[]) => NativePointer) | null;
}

export const il2cppApi: Il2CppCExports = {
  targetLib: null,
  domain_get: null,
  domain_get_assemblies: null,
  assembly_get_image: null,
  image_get_name: null,
  image_get_class_count: null,
  image_get_class: null,
  class_get_name: null,
  class_get_parent: null,
  class_get_method_from_name: null,
  class_get_field_from_name: null,
  field_static_get_value: null,
  field_get_offset: null,
  object_get_class: null,
  class_get_methods: null,
  method_get_name: null,
};

export function initIl2CppApi(libName: string): boolean {
  const mod = Process.findModuleByName(libName);
  if (!mod) return false;

  il2cppApi.targetLib = mod;

  function n(
    name: string,
    ret: NativeFunctionReturnType,
    args: NativeFunctionArgumentType[],
  ): any {
    const addr = mod!.findExportByName(name);
    return addr ? new NativeFunction(addr, ret, args) : null;
  }

  il2cppApi.domain_get = n("il2cpp_domain_get", "pointer", []);
  il2cppApi.domain_get_assemblies = n("il2cpp_domain_get_assemblies", "pointer", [
    "pointer",
    "pointer",
  ]);
  il2cppApi.assembly_get_image = n("il2cpp_assembly_get_image", "pointer", ["pointer"]);
  il2cppApi.image_get_name = n("il2cpp_image_get_name", "pointer", ["pointer"]);
  il2cppApi.image_get_class_count = n("il2cpp_image_get_class_count", "uint64", ["pointer"]);
  il2cppApi.image_get_class = n("il2cpp_image_get_class", "pointer", ["pointer", "uint64"]);
  il2cppApi.class_get_name = n("il2cpp_class_get_name", "pointer", ["pointer"]);
  il2cppApi.class_get_parent = n("il2cpp_class_get_parent", "pointer", ["pointer"]);
  il2cppApi.class_get_method_from_name = n("il2cpp_class_get_method_from_name", "pointer", [
    "pointer",
    "pointer",
    "int",
  ]);
  il2cppApi.class_get_field_from_name = n("il2cpp_class_get_field_from_name", "pointer", [
    "pointer",
    "pointer",
  ]);
  il2cppApi.field_static_get_value = n("il2cpp_field_static_get_value", "void", ["pointer", "pointer"]);
  il2cppApi.field_get_offset = n("il2cpp_field_get_offset", "uint32", ["pointer"]);
  il2cppApi.object_get_class = n("il2cpp_object_get_class", "pointer", ["pointer"]);
  il2cppApi.class_get_methods = n("il2cpp_class_get_methods", "pointer", ["pointer", "pointer"]);
  il2cppApi.method_get_name = n("il2cpp_method_get_name", "pointer", ["pointer"]);

  return il2cppApi.domain_get !== null;
}

const stringAllocCache = new Map<string, NativePointer>();

export function getCachedUtf8String(str: string): NativePointer {
  let p = stringAllocCache.get(str);
  if (!p) {
    p = Memory.allocUtf8String(str);
    stringAllocCache.set(str, p);
  }
  return p;
}

export function readCsharpString(ptr: NativePointer): string {
  if (!ptr || ptr.isNull()) return "";
  try {
    const len = ptr.add(0x10).readInt();
    if (len <= 0 || len > 200) return "";
    return ptr.add(0x14).readUtf16String(len) || "";
  } catch (e) {
    return "";
  }
}

export function getOffset(klass: NativePointer, fieldName: string): number {
  if (!klass || klass.isNull() || !il2cppApi.class_get_field_from_name || !il2cppApi.field_get_offset) {
    return -1;
  }
  let currClass = klass;
  while (currClass && !currClass.isNull()) {
    try {
      const fieldNamePtr = getCachedUtf8String(fieldName);
      const field: NativePointer = il2cppApi.class_get_field_from_name(
        currClass,
        fieldNamePtr,
      );
      if (field && !field.isNull()) {
        return Number(il2cppApi.field_get_offset(field));
      }
      if (il2cppApi.class_get_parent) {
        currClass = il2cppApi.class_get_parent(currClass);
      } else {
        break;
      }
    } catch (e) {
      break;
    }
  }
  return -1;
}

export function getFirstPosFromList(listPtr: NativePointer): number {
  try {
    if (!listPtr || listPtr.isNull()) return -1;
    let itemsPtr = listPtr.add(Process.pointerSize * 2).readPointer();
    if (!itemsPtr || itemsPtr.isNull()) return -1;
    let dataOffset = Process.pointerSize === 8 ? 0x20 : 0x10;
    return itemsPtr.add(dataOffset).readU32();
  } catch (e) {
    return -1;
  }
}

export function getMethodNative(
  klass: NativePointer,
  methodName: string,
  argsCount: number,
  retType: NativeFunctionReturnType,
  argTypes: NativeFunctionArgumentType[],
): NativeFunction<any, any> | null {
  if (!klass || klass.isNull() || !il2cppApi.class_get_method_from_name) return null;
  try {
    const methodNamePtr = getCachedUtf8String(methodName);
    const mPtr: NativePointer = il2cppApi.class_get_method_from_name(
      klass,
      methodNamePtr,
      argsCount,
    );
    if (!mPtr || mPtr.isNull()) return null;
    const codePtr: NativePointer = mPtr.readPointer();
    if (!codePtr || codePtr.isNull()) return null;
    return new NativeFunction(codePtr, retType, argTypes);
  } catch (e) {
    return null;
  }
}

export function getMethodNativeHierarchy(
  klass: NativePointer,
  methodName: string,
  argsCount: number,
  retType: NativeFunctionReturnType,
  argTypes: NativeFunctionArgumentType[],
): NativeFunction<any, any> | null {
  if (!klass || klass.isNull() || !il2cppApi.class_get_method_from_name) return null;
  let currClass = klass;
  while (currClass && !currClass.isNull()) {
    try {
      const methodNamePtr = getCachedUtf8String(methodName);
      const mPtr: NativePointer = il2cppApi.class_get_method_from_name(
        currClass,
        methodNamePtr,
        argsCount,
      );
      if (mPtr && !mPtr.isNull()) {
        const codePtr: NativePointer = mPtr.readPointer();
        if (codePtr && !codePtr.isNull()) {
          return new NativeFunction(codePtr, retType, argTypes);
        }
      }
      if (il2cppApi.class_get_parent) {
        currClass = il2cppApi.class_get_parent(currClass);
      } else {
        break;
      }
    } catch (e) {
      break;
    }
  }
  return null;
}
