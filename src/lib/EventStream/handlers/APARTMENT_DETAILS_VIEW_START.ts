import { record } from '@aws-amplify/analytics/kinesis-firehose'
import { APARTMENT_DETAILS_VIEW_START } from '../consts';

interface Payload {
  userId: string,
  sessionId: string,
  apartmentProperty: Object,
  apartmentUnit: Object,
}

export default async (metadata: Object, payload: Payload) => {
  const metrics = {
    timestamp: new Date().getTime(),
    weight: 0.2,
  }

  record({
    streamName: process.env.EXPO_PUBLIC_ANALYTICS_STREAM_NAME || '',
    data: {
      type: APARTMENT_DETAILS_VIEW_START,
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