import { Migration } from '@mikro-orm/migrations';

export class Migration20240426211421 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `address` (`id` int unsigned not null auto_increment primary key, `created_at` datetime null default current_timestamp, `updated_at` datetime null default current_timestamp, `city` varchar(255) not null, `address` text not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `category` (`id` int unsigned not null auto_increment primary key, `created_at` datetime null default current_timestamp, `updated_at` datetime null default current_timestamp, `iiko_id` varchar(36) null, `order` int null, `is_deleted` tinyint(1) null default false, `name` varchar(255) not null, `description` varchar(8192) not null default \'\') default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `category` add unique `category_iiko_id_unique`(`iiko_id`);');
    this.addSql('alter table `category` add fulltext index `category_name_index`(`name`);');

    this.addSql('create table `category_image` (`id` int unsigned not null auto_increment primary key, `created_at` datetime null default current_timestamp, `updated_at` datetime null default current_timestamp, `category_id` int unsigned not null, `url` varchar(512) not null, `type` varchar(255) not null default \'\') default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `category_image` add index `category_image_category_id_index`(`category_id`);');
    this.addSql('alter table `category_image` add unique `category_image_url_unique`(`url`);');

    this.addSql('create table `product` (`id` int unsigned not null auto_increment primary key, `created_at` datetime null default current_timestamp, `updated_at` datetime null default current_timestamp, `iiko_id` varchar(36) null, `order` int null, `is_deleted` tinyint(1) null default false, `category_id` int unsigned not null, `name` varchar(255) not null, `description` varchar(8192) null default \'\', `measure_unit` varchar(80) null default \'\', `weight` float null default 0, `proteins` int null default 0, `fats` int null default 0, `carbohydrates` int null default 0, `flags` varchar(255) null default 0, `calories` int null default 0, `price` float not null, constraint product_weight_check check (weight >= 0), constraint product_price_check check (price >= 0)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `product` add unique `product_iiko_id_unique`(`iiko_id`);');
    this.addSql('alter table `product` add index `product_category_id_index`(`category_id`);');
    this.addSql('alter table `product` add fulltext index `product_name_index`(`name`);');

    this.addSql('create table `product_image` (`id` int unsigned not null auto_increment primary key, `created_at` datetime null default current_timestamp, `updated_at` datetime null default current_timestamp, `product_id` int unsigned not null, `url` varchar(512) not null, `type` varchar(255) not null default \'\') default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `product_image` add index `product_image_product_id_index`(`product_id`);');
    this.addSql('alter table `product_image` add unique `product_image_url_unique`(`url`);');

    this.addSql('create table `role` (`id` int unsigned not null auto_increment primary key, `role` enum(\'user\', \'admin\') not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `role` add unique `role_role_unique`(`role`);');

    this.addSql('create table `tag` (`id` int unsigned not null auto_increment primary key, `tag` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `tag` add unique `tag_tag_unique`(`tag`);');

    this.addSql('create table `product_tag` (`product_id` int unsigned not null, `tag_id` int unsigned not null, primary key (`product_id`, `tag_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `product_tag` add index `product_tag_product_id_index`(`product_id`);');
    this.addSql('alter table `product_tag` add index `product_tag_tag_id_index`(`tag_id`);');

    this.addSql('create table `user` (`id` int unsigned not null auto_increment primary key, `created_at` datetime null default current_timestamp, `updated_at` datetime null default current_timestamp, `name` varchar(255) not null, `email` varchar(255) null, `phone` varchar(255) not null, `password` varchar(255) not null, `is_email_confirmed` tinyint(1) not null default false, `is_phone_confirmed` tinyint(1) not null default false) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `user` add unique `user_email_unique`(`email`);');
    this.addSql('alter table `user` add unique `user_phone_unique`(`phone`);');

    this.addSql('create table `order` (`id` int unsigned not null auto_increment primary key, `created_at` datetime null default current_timestamp, `updated_at` datetime null default current_timestamp, `customer_id` int unsigned not null, `address_id` int unsigned null, `status` varchar(255) not null default \'new\', `comment` text null, `payment_type` varchar(255) not null, `confirmation_token` varchar(255) not null default \'\') default character set utf8mb4 engine = InnoDB;');
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

    this.addSql('alter table `category_image` add constraint `category_image_category_id_foreign` foreign key (`category_id`) references `category` (`id`) on update cascade;');

    this.addSql('alter table `product` add constraint `product_category_id_foreign` foreign key (`category_id`) references `category` (`id`) on update cascade;');

    this.addSql('alter table `product_image` add constraint `product_image_product_id_foreign` foreign key (`product_id`) references `product` (`id`) on update cascade;');

    this.addSql('alter table `product_tag` add constraint `product_tag_product_id_foreign` foreign key (`product_id`) references `product` (`id`) on update cascade;');
    this.addSql('alter table `product_tag` add constraint `product_tag_tag_id_foreign` foreign key (`tag_id`) references `tag` (`id`) on update cascade;');

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
