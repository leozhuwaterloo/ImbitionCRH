import NAMES from './names';

const TRANSLATE = {};
TRANSLATE['position with this name already exists.'] = '已经有职位是这个名字了';
TRANSLATE['No active account found with the given credentials'] = '您提供的登录信息有错误';
TRANSLATE['employee with this phone already exists.'] = '已经有员工是这个手机了';
TRANSLATE['department with this name already exists.'] = '已经有岗位是这个名字了';
TRANSLATE['pending employee with this phone already exists.'] = '已经有代注册员工是这个名字了';
TRANSLATE.first_name = '名';
TRANSLATE.last_name = '姓';
TRANSLATE.email = '邮箱';
TRANSLATE.last_login = '上次登录';
TRANSLATE.date_joined = '注册时间';
TRANSLATE.phone = '手机';
TRANSLATE.position = NAMES.POSITION;
TRANSLATE.department = NAMES.DEPARTMENT;
TRANSLATE.user = '用户';
TRANSLATE.recordsummary = '日志';
TRANSLATE.employeerecord = '员工记录';
TRANSLATE.recordfields = '日志记录';
TRANSLATE.positiontree = '岗位树图';
TRANSLATE.departments = '部门';
TRANSLATE.positionrecords = '岗位所需';
TRANSLATE.employees = '员工';
TRANSLATE.positions = '岗位';
TRANSLATE.permissions = '权限';
TRANSLATE.positionpermissions = '职位权限';
TRANSLATE.employee = '员工';
TRANSLATE.username = '账号';
TRANSLATE.oldPassword = '原密码';
TRANSLATE.newPassword = '新密码';
TRANSLATE.newPasswordConfirm = '重复新密码';
TRANSLATE.firstName = '名';
TRANSLATE.lastName = '姓';
TRANSLATE.pendingemployees = '待注册员工';


export default function translate(str) {
  return TRANSLATE[str] || str;
}
