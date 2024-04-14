import exp from 'constants';

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
  visible: boolean;
  id?: string;
}

export interface Genre {
  name: string;
  description: string;
  id?: string;
}

export interface Tag {
  tag_name: string;
  id?: string;
}

export interface FileType {
  type_name: string;
  id?: string
}

export interface SuperMetadata {
  metadata_name: string;
  id?: string;
}

export interface Metadata {
  file_id: string;
  metadata_id: string;
  metadata_value: string;
  id?: string;
}

export interface User {
  first_name: string;
  second_name: string;
  email: string;
  username: string;
  registration_date: Date;
  status: boolean;
  position: string;
  id?: string;
}

export interface View {
  file_id: string;
  user_id: string;
  view_date: Date;
  id?: string;
  criteria: string;
  value: number;
  start_date: Date;
  end_date: Date;
}

export interface Comment {
  file_id: string;
  user_id: string;
  comment_text: string;
  id?: string;
}

export interface FileMetadata {
  file_id: string;
  metadata_id: string;
  matadata_value: string;
  id?: string;
}