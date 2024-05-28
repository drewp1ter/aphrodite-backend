import { Migration } from '@mikro-orm/migrations';

export class Migration20240525084621 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `category` add `additional_info` varchar(255) null default \'\';');

    this.addSql('alter table `product` add `additional_info` varchar(255) null default \'\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table `category` drop column `additional_info`;');

    this.addSql('alter table `product` drop column `additional_info`;');
  }

}
