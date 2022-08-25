import { mixpanelTrack } from "../services/mixpanel";
import { SubmitAnalyticsEventRequestType } from "../routes/submitAnalyticsEvent/schema";

export const submitAnalyticsEventController = async ({ title, user_id, properties }: SubmitAnalyticsEventRequestType) => {
  try {
    await mixpanelTrack(title, user_id, properties);
    return "event submitted successfully";
  } catch (error) {
    throw new Error(error as string);
  }
};
