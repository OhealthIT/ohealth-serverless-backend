import * as Mixpanel from "mixpanel";

let mixpanel: Mixpanel.Mixpanel;

if (process.env.MIXPANEL_TOKEN) {
  const mixpanel_token = process.env.MIXPANEL_TOKEN;
  mixpanel = Mixpanel.init(mixpanel_token);
}

export const mixpanelTrack = async (title: string, user_id: string, data: { [key: string]: any }) => {
  try {
    mixpanel.track(title, {
      ...data,
      user_id,
      distinct_id: user_id || `device_${data.sessionData.deviceId}`,
    });
    return "mixpanel event created";
  } catch (error) {
    throw new Error("Mixpanel import event failed: " + error);
  }
};
