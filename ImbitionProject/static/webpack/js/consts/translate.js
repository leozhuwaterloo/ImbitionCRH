const TRANSLATE = {};
TRANSLATE['position with this name already exists.'] = '已经有职位是这个名字了';
TRANSLATE['No active account found with the given credentials'] = '您提供的登录信息有错误';

export default function translate(str) {
  return TRANSLATE[str] || str;
}
