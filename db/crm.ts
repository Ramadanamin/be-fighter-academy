import { getCrmSetting, setCrmSettingIfMissing } from ".";

const OWNER_KEY = "owner_user_id";

export async function claimCrmOwnership(userId: string) {
  setCrmSettingIfMissing(OWNER_KEY, userId);
  return isCrmOwner(userId);
}

export async function isCrmOwner(userId: string) {
  return getCrmSetting(OWNER_KEY) === userId;
}
