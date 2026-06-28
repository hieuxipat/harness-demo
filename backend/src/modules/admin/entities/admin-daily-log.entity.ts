import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('admin_daily_log')
export class AdminDailyLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  @Index('created_date', { unique: true })
  createdDate: Date | string;

  @Column({ default: 0 })
  totalUser: number;

  @Column({ default: 0 })
  installedUser: number;

  @Column({ default: 0 })
  uninstalledUser: number;

  @Column({ default: 0 })
  uninstallInDay: number;
}
