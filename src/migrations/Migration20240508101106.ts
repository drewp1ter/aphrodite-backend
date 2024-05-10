import { Migration } from '@mikro-orm/migrations';

export class Migration20240508101106 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `order` add `items_hash` varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `order` drop column `items_hash`;');
  }

}
