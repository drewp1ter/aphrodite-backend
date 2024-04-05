import { Migration } from '@mikro-orm/migrations';

export class Migration20240405163358 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `product_image` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `product_id` int unsigned not null, `url` text not null, `type` varchar(255) not null default \'\') default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `product_image` add index `product_image_product_id_index`(`product_id`);');

    this.addSql('alter table `product_image` add constraint `product_image_product_id_foreign` foreign key (`product_id`) references `product` (`id`) on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `product_image`;');
  }

}
