import { Migration } from '@mikro-orm/migrations';

export class Migration20240402192743 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `product_group` (`id` int unsigned not null auto_increment primary key, `name` varchar(255) not null, `description` varchar(8192) not null default \'\', `updated_at` datetime not null, `created_at` datetime not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `product_group` add fulltext index `product_group_name_index`(`name`);');

    this.addSql('create table `product` (`id` int unsigned not null auto_increment primary key, `group_id` int unsigned not null, `name` varchar(255) not null, `description` varchar(8192) not null default \'\', `squirrels` float not null default 0, `fats` float not null default 0, `carbohydrates` float not null default 0, `flags` int not null default 0, `calories` int not null default 0, `price` float not null, `updated_at` datetime not null, `created_at` datetime not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `product` add index `product_group_id_index`(`group_id`);');
    this.addSql('alter table `product` add fulltext index `product_name_index`(`name`);');

    this.addSql('create table `role` (`id` int unsigned not null auto_increment primary key, `role` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `user` (`id` int unsigned not null auto_increment primary key, `username` varchar(255) not null, `email` varchar(255) not null, `phone` varchar(255) null default \'\', `password` varchar(255) not null, `updated_at` datetime not null, `created_at` datetime not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `user` add unique `user_email_unique`(`email`);');

    this.addSql('create table `address` (`id` int unsigned not null auto_increment primary key, `user_id` int unsigned not null, `city` varchar(255) not null, `address` text not null, `is_default` tinyint(1) not null default false, `updated_at` datetime not null, `created_at` datetime not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `address` add index `address_user_id_index`(`user_id`);');

    this.addSql('create table `user_roles` (`user_id` int unsigned not null, `role_id` int unsigned not null, primary key (`user_id`, `role_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `user_roles` add index `user_roles_user_id_index`(`user_id`);');
    this.addSql('alter table `user_roles` add index `user_roles_role_id_index`(`role_id`);');

    this.addSql('alter table `product` add constraint `product_group_id_foreign` foreign key (`group_id`) references `product_group` (`id`) on update cascade;');

    this.addSql('alter table `address` add constraint `address_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade;');

    this.addSql('alter table `user_roles` add constraint `user_roles_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `user_roles` add constraint `user_roles_role_id_foreign` foreign key (`role_id`) references `role` (`id`) on update cascade on delete cascade;');
  }

}
