export type ProvenanceCategory =
  | 'Live data'
  | 'Historical data'
  | 'Uploaded data'
  | 'Derived analytics'
  | 'ML predictions'
  | 'Unavailable data';

export interface KPIItem {
  key: string;
  label: string;
  label_ja: string;
  value: number;
  unit: string;
  change_pct: number;
  source: string;
  data_status: string;
  last_updated: string;
  data_coverage: string;
}

export interface Destination {
  id: number;
  name: string;
  name_ja: string;
  category: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  description: string;
  official_website?: string;
  total_recorded_visitors?: number;
  latest_daily_visitors?: number;
  data_source: string;
  data_status: string;
}

export interface RailwayStation {
  id: number;
  station_code: string;
  name: string;
  name_ja: string;
  line_name: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  order_index: number;
  data_source: string;
  data_status: string;
}

export interface DataSourceItem {
  id: number;
  name: string;
  category: string;
  endpoint_or_ref: string;
  connection_status: string;
  auth_status: string;
  last_sync: string | null;
  last_error: string | null;
  update_frequency: string;
  data_coverage: string;
  imported_records_count: number;
}

export interface MLModelItem {
  id: number;
  model_name: string;
  target_metric: string;
  algorithm: string;
  version: string;
  training_dataset: string;
  training_period: string;
  mae: number;
  rmse: number;
  mape: number;
  status: string;
  model_path: string;
  last_trained: string | null;
}
