import { Migration } from '@mikro-orm/migrations';

export class Migration20240403185200 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `order` (`id` int unsigned not null auto_increment primary key, `user_id` int unsigned not null, `address_id` int unsigned null, `status` varchar(255) not null default \'new\', `comment` text null, `payment_type` varchar(255) not null, `updated_at` datetime not null, `created_at` datetime not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `order` add index `order_user_id_index`(`user_id`);');
    this.addSql('alter table `order` add index `order_address_id_index`(`address_id`);');

    this.addSql('create table `order_item` (`order_id` int unsigned not null, `product_id` int unsigned not null, `amount` int not null default 1, primary key (`order_id`, `product_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `order_item` add index `order_item_order_id_index`(`order_id`);');
    this.addSql('alter table `order_item` add index `order_item_product_id_index`(`product_id`);');

    this.addSql('alter table `order` add constraint `order_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade;');
    this.addSql('alter table `order` add constraint `order_address_id_foreign` foreign key (`address_id`) references `address` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `order_item` add constraint `order_item_order_id_foreign` foreign key (`order_id`) references `order` (`id`) on update cascade;');
    this.addSql('alter table `order_item` add constraint `order_item_product_id_foreign` foreign key (`product_id`) references `product` (`id`) on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `order_item` drop foreign key `order_item_order_id_foreign`;');

    this.addSql('drop table if exists `order`;');

    this.addSql('drop table if exists `order_item`;');
  }

}
