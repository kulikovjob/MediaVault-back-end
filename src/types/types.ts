export enum MediaTypes {
  Image = 1,
  Video,
  Audio,
  Document,
}

export enum ApplicationPhaces {
  Development = 'development',
  Production = 'production',
}

export interface File {
  file_name: string;
  file_path: string;
  upload_date: Date;
  uploader_id: string;
  file_type_id: string;
  avg_rating: string;
  metadata: unknown;
  visible: boolean;
  id?: string;
}
