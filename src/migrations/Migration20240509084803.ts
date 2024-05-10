import { Migration } from '@mikro-orm/migrations';

export class Migration20240509084803 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `order` drop index `order_confirmation_token_index`;');

    this.addSql('alter table `order` change `confirmation_token` `payment_id` varchar(255) not null default \'\';');
    this.addSql('alter table `order` add index `order_payment_id_index`(`payment_id`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `order` drop index `order_payment_id_index`;');

    this.addSql('alter table `order` change `payment_id` `confirmation_token` varchar(255) not null default \'\';');
    this.addSql('alter table `order` add index `order_confirmation_token_index`(`confirmation_token`);');
  }

}
