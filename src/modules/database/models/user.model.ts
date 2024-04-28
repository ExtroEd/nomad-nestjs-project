import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { CollectionName } from '../../../helpers/enums/collection-names.enum';
import { Roles } from '../../../helpers/enums/roles.enum';

@Schema({
  collection: CollectionName.User,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class User {
  _id: Types.ObjectId;

  @ApiProperty({ type: 'string' })
  @Prop({ required: true })
  full_name: string;

  @ApiProperty({ type: 'string' })
  @Prop({ required: true })
  email: string;

  @ApiProperty({ type: 'string' })
  @Prop({ type: 'string', required: true, default: Roles.STUDENT })
  role: Roles;

  @ApiProperty({ type: 'string' })
  @Prop({ type: Types.ObjectId })
  group_id: Types.ObjectId;

  @ApiProperty({ type: 'string' })
  @Prop({ required: true })
  password: string;

  @ApiProperty({ type: 'boolean' })
  @Prop({ default: false })
  is_deleted: boolean;

  @ApiProperty({ type: 'boolean' })
  @Prop({ default: true })
  blocked: boolean;

  @ApiProperty({ type: 'number' })
  @Prop({ default: 0 })
  trys: number;

  @ApiProperty({ type: 'Date' })
  @Prop({ default: 0 })
  date: Date;
}

export type UserDocument = User & mongoose.Document;

export const UserSchema = SchemaFactory.createForClass(User);
