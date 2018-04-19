export default function translate(str) {
  switch (str) {
    case 'first_name': return '名';
    case 'last_name': return '姓';
    case 'email': return '邮箱';
    case 'last_login': return '上次登录';
    case 'date_joined': return '注册日期';
    case 'phone': return '手机';
    case 'permission_group': return '权限';
    case 'position with this name already exists.': return '已经有职位是这个名字了';
    case 'No active account found with the given credentials': return '用户名或密码错误';
    default: return str;
  }
}
