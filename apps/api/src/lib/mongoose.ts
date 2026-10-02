import { Schema, type SchemaOptions } from 'mongoose';

/** Standard options: timestamps, `id` instead of `_id`, no `__v` in API responses. */
export function baseSchemaOptions(hiddenFields: string[] = []): SchemaOptions {
  return {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret._id;
        for (const field of hiddenFields) delete ret[field];
        return ret;
      },
    },
  };
}

export const localizedTextSchema = new Schema({ en: String, ta: String }, { _id: false });
