import { SetMetadata } from "@nestjs/common";
import { PERMISSION_METADATA } from "src/utils/default-setting";

export function HasPermission(permissions: string | string[]): any {
  return SetMetadata(PERMISSION_METADATA, permissions)
}