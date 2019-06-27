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
  own_avatar varchar(128) comment "发起者的头像",
  reciev_avatar varchar(128) comment "接受者的头像",
  own_nick varchar(16) comment "发起者的昵称",
  reciev_nick varchar(16) comment "接受者的昵称"
);