import { Migration } from '@mikro-orm/migrations';

export class Migration20240411105334 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `address` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `city` varchar(255) not null, `address` text not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `category` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `name` varchar(255) not null, `description` varchar(8192) not null default \'\') default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `category` add fulltext index `category_name_index`(`name`);');

    this.addSql('create table `product` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `category_id` int unsigned not null, `name` varchar(255) not null, `description` varchar(8192) not null default \'\', `squirrels` int not null default 0, `fats` int not null default 0, `carbohydrates` int not null default 0, `flags` varchar(255) not null default 0, `calories` int not null default 0, `price` float not null, constraint product_price_check check (price >= 0)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `product` add index `product_category_id_index`(`category_id`);');
    this.addSql('alter table `product` add fulltext index `product_name_index`(`name`);');

    this.addSql('create table `product_image` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `product_id` int unsigned not null, `url` text not null, `type` varchar(255) not null default \'\') default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `product_image` add index `product_image_product_id_index`(`product_id`);');

    this.addSql('create table `role` (`id` int unsigned not null auto_increment primary key, `role` enum(\'user\', \'admin\') not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `role` add unique `role_role_unique`(`role`);');

    this.addSql('create table `user` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `name` varchar(255) not null, `email` varchar(255) null, `phone` varchar(255) not null, `password` varchar(255) not null, `is_email_confirmed` tinyint(1) not null default false, `is_phone_confirmed` tinyint(1) not null default false) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `user` add unique `user_email_unique`(`email`);');
    this.addSql('alter table `user` add unique `user_phone_unique`(`phone`);');

    this.addSql('create table `order` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `customer_id` int unsigned not null, `address_id` int unsigned null, `status` varchar(255) not null default \'new\', `comment` text null, `payment_type` varchar(255) not null, `confirmation_token` varchar(255) not null default \'\') default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `order` add index `order_customer_id_index`(`customer_id`);');
    this.addSql('alter table `order` add index `order_address_id_index`(`address_id`);');
    this.addSql('alter table `order` add index `order_confirmation_token_index`(`confirmation_token`);');

    this.addSql('create table `order_item` (`order_id` int unsigned not null, `product_id` int unsigned not null, `amount` int not null default 1, `offered_price` float not null, primary key (`order_id`, `product_id`), constraint order_item_amount_check check (amount > 0), constraint order_item_offered_price_check check (offered_price >= 0)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `order_item` add index `order_item_order_id_index`(`order_id`);');
    this.addSql('alter table `order_item` add index `order_item_product_id_index`(`product_id`);');

    this.addSql('create table `user_roles` (`user_id` int unsigned not null, `role_id` int unsigned not null, primary key (`user_id`, `role_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `user_roles` add index `user_roles_user_id_index`(`user_id`);');
    this.addSql('alter table `user_roles` add index `user_roles_role_id_index`(`role_id`);');

    this.addSql('create table `user_address` (`user_id` int unsigned not null, `address_id` int unsigned not null, primary key (`user_id`, `address_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `user_address` add index `user_address_user_id_index`(`user_id`);');
    this.addSql('alter table `user_address` add index `user_address_address_id_index`(`address_id`);');

    this.addSql('alter table `product` add constraint `product_category_id_foreign` foreign key (`category_id`) references `category` (`id`) on update cascade;');

    this.addSql('alter table `product_image` add constraint `product_image_product_id_foreign` foreign key (`product_id`) references `product` (`id`) on update cascade;');

    this.addSql('alter table `order` add constraint `order_customer_id_foreign` foreign key (`customer_id`) references `user` (`id`) on update cascade;');
    this.addSql('alter table `order` add constraint `order_address_id_foreign` foreign key (`address_id`) references `address` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `order_item` add constraint `order_item_order_id_foreign` foreign key (`order_id`) references `order` (`id`) on update cascade;');
    this.addSql('alter table `order_item` add constraint `order_item_product_id_foreign` foreign key (`product_id`) references `product` (`id`) on update cascade;');

    this.addSql('alter table `user_roles` add constraint `user_roles_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `user_roles` add constraint `user_roles_role_id_foreign` foreign key (`role_id`) references `role` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `user_address` add constraint `user_address_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade;');
    this.addSql('alter table `user_address` add constraint `user_address_address_id_foreign` foreign key (`address_id`) references `address` (`id`) on update cascade;');
  }

}
