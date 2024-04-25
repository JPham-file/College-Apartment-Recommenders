import { record } from '@aws-amplify/analytics/kinesis-firehose'
import { APARTMENT_DETAILS_VIEW_END } from '../consts';

interface Payload {
  userId: string;
  sessionId: string;
  apartmentProperty: Object;
  apartmentUnit: Object;
  totalTime?: Number;
  timeUnit?: string;
}

export default async (metadata: Object, payload: Payload) => {
  const metrics = {
    timestamp: new Date().getTime(),
    weight: 0.2,
    totalTime: payload.totalTime,
    timeUnit: payload.timeUnit,
  }

  record({
    streamName: process.env.EXPO_PUBLIC_ANALYTICS_STREAM_NAME || '',
    data: {
      type: APARTMENT_DETAILS_VIEW_END,
      metadata,
      userId: payload.userId,
      sessionId: payload.sessionId,
      apartmentProperty: payload.apartmentProperty,
      apartmentUnit: payload.apartmentUnit,
      rawPayload: payload,
      metrics,
    }
  });
}