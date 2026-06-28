import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('shop_info')
@Index('shop_access_token', ['shop', 'accessToken'])
export class ShopInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index('shop_unique', { unique: true })
  shop: string;

  @Column()
  accessToken: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  otherDomain: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  zipcode: string;

  @Column({ nullable: true })
  timezone: string;

  @Column({ nullable: true })
  shopifyPlan: string;

  @Column({ type: 'text' })
  shopJson: string;
}
