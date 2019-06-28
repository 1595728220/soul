set names utf8;
drop database if exists soul;
create database soul charset=utf8;
use soul;
create table chat(
  cid int primary key auto_increment comment "聊天记录编号",
  own_openid varchar(32) comment "消息的发起者",
  recive_openid varchar(32) comment "消息的接收者",
  msg varchar(256) comment "消息",
  msg_time bigint comment "时间",
  own_avatar varchar(256) comment "发起者的头像",
  reciev_avatar varchar(256) comment "接受者的头像",
  own_nick varchar(16) comment "发起者的昵称",
  reciev_nick varchar(16) comment "接受者的昵称"
);


insert into chat values(null, 'otcZZ5OBn4W_F2xIOF7XWC8HvElk', 'otcZZ5GiW9ldjjfSbNx53XJrSFvQ', '在吗', 1561681957113, 'https://wx.qlogo.cn/mmopen/vi_32/9hbKLibO7m910llBueTs56AjRybrI4P38RHmUR4HqSc8VrvH2DXRZ9MWtic2FGNrj9rpJg0Am2KYtHagUrYd8jyw/132', 'https://wx.qlogo.cn/mmopen/vi_32/USxbBCJicEOj0WPMzKia2OqzPWvnZ0icKylHmNeVialbzPhia8dD7FFqdKMFiaPibaF3uowL3b0xmjr73raAwvQ7IuQPw/132', 'John', '小样就这样');
insert into chat values(null, 'otcZZ5GiW9ldjjfSbNx53XJrSFvQ', 'otcZZ5OBn4W_F2xIOF7XWC8HvElk', '不在', 1561681957113, 'https://wx.qlogo.cn/mmopen/vi_32/USxbBCJicEOj0WPMzKia2OqzPWvnZ0icKylHmNeVialbzPhia8dD7FFqdKMFiaPibaF3uowL3b0xmjr73raAwvQ7IuQPw/132', 'https://wx.qlogo.cn/mmopen/vi_32/9hbKLibO7m910llBueTs56AjRybrI4P38RHmUR4HqSc8VrvH2DXRZ9MWtic2FGNrj9rpJg0Am2KYtHagUrYd8jyw/132', '小样就这样', 'John');
insert into chat values(null, 'otcZZ5OBn4W_F2xIOF7XWC8HvElk', 'otcZZ5GiW9ldjjfSbNx53XJrSFvQ', '在吗', 1561681957113, 'https://wx.qlogo.cn/mmopen/vi_32/9hbKLibO7m910llBueTs56AjRybrI4P38RHmUR4HqSc8VrvH2DXRZ9MWtic2FGNrj9rpJg0Am2KYtHagUrYd8jyw/132', 'https://wx.qlogo.cn/mmopen/vi_32/USxbBCJicEOj0WPMzKia2OqzPWvnZ0icKylHmNeVialbzPhia8dD7FFqdKMFiaPibaF3uowL3b0xmjr73raAwvQ7IuQPw/132', 'John', '小样就这样');
insert into chat values(null, 'otcZZ5GiW9ldjjfSbNx53XJrSFvQ', 'otcZZ5OBn4W_F2xIOF7XWC8HvElk', '说了不在', 1561681957113, 'https://wx.qlogo.cn/mmopen/vi_32/USxbBCJicEOj0WPMzKia2OqzPWvnZ0icKylHmNeVialbzPhia8dD7FFqdKMFiaPibaF3uowL3b0xmjr73raAwvQ7IuQPw/132', 'https://wx.qlogo.cn/mmopen/vi_32/9hbKLibO7m910llBueTs56AjRybrI4P38RHmUR4HqSc8VrvH2DXRZ9MWtic2FGNrj9rpJg0Am2KYtHagUrYd8jyw/132', '小样就这样', 'John');
insert into chat values(null, 'otcZZ5OBn4W_F2xIOF7XWC8HvElk', 'otcZZ5GiW9ldjjfSbNx53XJrSFvQ', '在吗', 1561686175341, 'https://wx.qlogo.cn/mmopen/vi_32/9hbKLibO7m910llBueTs56AjRybrI4P38RHmUR4HqSc8VrvH2DXRZ9MWtic2FGNrj9rpJg0Am2KYtHagUrYd8jyw/132', 'https://wx.qlogo.cn/mmopen/vi_32/USxbBCJicEOj0WPMzKia2OqzPWvnZ0icKylHmNeVialbzPhia8dD7FFqdKMFiaPibaF3uowL3b0xmjr73raAwvQ7IuQPw/132', 'John', '小样就这样');
insert into chat values(null, 'otcZZ5OBn4W_F2xIOF7XWC8HvElk', 'otcZZ5GiW9ldjjfSbNx53XJrSFvQ', '真不在啊，那我走了', 1561687022044, 'https://wx.qlogo.cn/mmopen/vi_32/9hbKLibO7m910llBueTs56AjRybrI4P38RHmUR4HqSc8VrvH2DXRZ9MWtic2FGNrj9rpJg0Am2KYtHagUrYd8jyw/132', 'https://wx.qlogo.cn/mmopen/vi_32/USxbBCJicEOj0WPMzKia2OqzPWvnZ0icKylHmNeVialbzPhia8dD7FFqdKMFiaPibaF3uowL3b0xmjr73raAwvQ7IuQPw/132', 'John', '小样就这样');
insert into chat values(null, 'otcZZ5OBn4W_F2xIOF7XWC8HvElk', 'otcZZ5DhDKl2VGbhLaG9KBDJWUQ4', '在吗', 1561681958000, 'https://wx.qlogo.cn/mmopen/vi_32/9hbKLibO7m910llBueTs56AjRybrI4P38RHmUR4HqSc8VrvH2DXRZ9MWtic2FGNrj9rpJg0Am2KYtHagUrYd8jyw/132', 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83errfd28VRgiaLBicxaQNI5bg13BtnjPAx4nbBzXeJqws5icJhmcxMEhgT9BNUMsl9fV4qIYouIcuzNMQ/132', 'John', "I't");
insert into chat values(null, 'otcZZ5DhDKl2VGbhLaG9KBDJWUQ4','otcZZ5OBn4W_F2xIOF7XWC8HvElk',  '老大有什么事吗', 1561681958500, 
'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83errfd28VRgiaLBicxaQNI5bg13BtnjPAx4nbBzXeJqws5icJhmcxMEhgT9BNUMsl9fV4qIYouIcuzNMQ/132',  'https://wx.qlogo.cn/mmopen/vi_32/9hbKLibO7m910llBueTs56AjRybrI4P38RHmUR4HqSc8VrvH2DXRZ9MWtic2FGNrj9rpJg0Am2KYtHagUrYd8jyw/132', "I't",'John');