import { UpdateReportAction } from './admin.enum';

export interface IUpdateDailyAnalytic {
  shop: string;
  date: Date;
  action: UpdateReportAction;
}
