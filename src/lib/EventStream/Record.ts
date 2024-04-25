import * as EVENT_TYPES from './consts';
import { APARTMENT_DETAILS_VIEW_START, APARTMENT_DETAILS_VIEW_END } from './handlers';

interface EventMap {
  [index: string]: (metadata: Object, payload: any) => Promise<void>;
}

const EventMap: EventMap = {
  [EVENT_TYPES.APARTMENT_DETAILS_VIEW_START]: (metadata: Object, payload: any) => APARTMENT_DETAILS_VIEW_START(metadata, payload),
  [EVENT_TYPES.APARTMENT_DETAILS_VIEW_END]: (metadata: Object, payload: any) => APARTMENT_DETAILS_VIEW_END(metadata, payload),

};

export default (event: string, payload: any) => {
  const metadata = {
    version: '1.0',
    system: 'OffCampusMobile',
    device: 'ios'
  }
  EventMap[event](metadata, payload);
}