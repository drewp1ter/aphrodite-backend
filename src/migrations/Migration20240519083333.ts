import { Migration } from '@mikro-orm/migrations';

export class Migration20240519083333 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `delivery_price` (`id` int unsigned not null auto_increment primary key, `created_at` datetime null default current_timestamp, `updated_at` datetime null default current_timestamp, `value` varchar(255) null default \'\', `name` varchar(255) not null, `price` float not null, constraint delivery_price_price_check check (price >= 0)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `delivery_price` add unique `delivery_price_name_unique`(`name`);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `delivery_price`;');
  }

}
