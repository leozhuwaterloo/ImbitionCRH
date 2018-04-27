import NAMES from './names';

const TRANSLATE = {};
TRANSLATE['position with this name already exists.'] = '已经有职位是这个名字了';
TRANSLATE['No active account found with the given credentials'] = '您提供的登录信息有错误';
TRANSLATE['employee with this phone already exists.'] = '已经有员工是这个手机了';
TRANSLATE['department with this name already exists.'] = '已经有岗位是这个名字了';
TRANSLATE.first_name = '名';
TRANSLATE.last_name = '姓';
TRANSLATE.email = '邮箱';
TRANSLATE.last_login = '上次登录';
TRANSLATE.date_joined = '注册时间';
TRANSLATE.phone = '手机';
TRANSLATE.position = NAMES.POSITION;
TRANSLATE.department = NAMES.DEPARTMENT;


export default function translate(str) {
  return TRANSLATE[str] || str;
}
