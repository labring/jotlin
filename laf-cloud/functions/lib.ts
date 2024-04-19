import cloud from '@lafjs/cloud'
import { Db } from 'mongodb'

export const db = cloud.mongo.db as unknown as Db
