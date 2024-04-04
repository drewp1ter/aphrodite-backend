import { Migration } from '@mikro-orm/migrations';

export class Migration20240404191316 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `address` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `city` varchar(255) not null, `address` text not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `product_group` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `name` varchar(255) not null, `description` varchar(8192) not null default \'\') default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `product_group` add index `fulltext`(`name`);');

    this.addSql('create table `product` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `group_id` int unsigned not null, `name` varchar(255) not null, `description` varchar(8192) not null default \'\', `squirrels` float not null default 0, `fats` float not null default 0, `carbohydrates` float not null default 0, `flags` smallint not null default 0, `calories` int not null default 0, `price` float not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `product` add index `product_group_id_index`(`group_id`);');
    this.addSql('alter table `product` add index `fulltext`(`name`);');

    this.addSql('create table `user` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `name` varchar(255) not null, `email` varchar(255) not null default \'\', `phone` varchar(255) not null, `password` varchar(255) not null, `is_email_confirmed` tinyint(1) not null default false, `is_phone_confirmed` tinyint(1) not null default false, `is_admin` tinyint(1) not null default false) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `user` add unique `user_phone_unique`(`phone`);');

    this.addSql('create table `order` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `user_id` int unsigned not null, `address_id` int unsigned null, `status` varchar(255) not null default \'new\', `comment` text null, `payment_type` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `order` add index `order_user_id_index`(`user_id`);');
    this.addSql('alter table `order` add index `order_address_id_index`(`address_id`);');

    this.addSql('create table `order_item` (`order_id` int unsigned not null, `product_id` int unsigned not null, `amount` int not null default 1, primary key (`order_id`, `product_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `order_item` add index `order_item_order_id_index`(`order_id`);');
    this.addSql('alter table `order_item` add index `order_item_product_id_index`(`product_id`);');

    this.addSql('create table `user_address` (`user_id` int unsigned not null, `address_id` int unsigned not null, primary key (`user_id`, `address_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `user_address` add index `user_address_user_id_index`(`user_id`);');
    this.addSql('alter table `user_address` add index `user_address_address_id_index`(`address_id`);');

    this.addSql('alter table `product` add constraint `product_group_id_foreign` foreign key (`group_id`) references `product_group` (`id`) on update cascade;');

    this.addSql('alter table `order` add constraint `order_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade;');
    this.addSql('alter table `order` add constraint `order_address_id_foreign` foreign key (`address_id`) references `address` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `order_item` add constraint `order_item_order_id_foreign` foreign key (`order_id`) references `order` (`id`) on update cascade;');
    this.addSql('alter table `order_item` add constraint `order_item_product_id_foreign` foreign key (`product_id`) references `product` (`id`) on update cascade;');

    this.addSql('alter table `user_address` add constraint `user_address_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade;');
    this.addSql('alter table `user_address` add constraint `user_address_address_id_foreign` foreign key (`address_id`) references `address` (`id`) on update cascade;');
  }

}
