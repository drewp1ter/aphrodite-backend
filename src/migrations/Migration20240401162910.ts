import { Migration } from '@mikro-orm/migrations';

export class Migration20240401162910 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `role` (`id` int unsigned not null auto_increment primary key, `role` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `user` (`id` int unsigned not null auto_increment primary key, `username` varchar(255) not null, `email` varchar(255) not null, `phone` varchar(255) null default \'\', `password` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `user` add unique `user_email_unique`(`email`);');

    this.addSql('create table `user_roles` (`user_id` int unsigned not null, `role_id` int unsigned not null, primary key (`user_id`, `role_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `user_roles` add index `user_roles_user_id_index`(`user_id`);');
    this.addSql('alter table `user_roles` add index `user_roles_role_id_index`(`role_id`);');

    this.addSql('alter table `user_roles` add constraint `user_roles_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `user_roles` add constraint `user_roles_role_id_foreign` foreign key (`role_id`) references `role` (`id`) on update cascade on delete cascade;');
  }

}
