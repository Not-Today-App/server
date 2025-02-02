import {
  AddictionName,
  AddictionType,
  QuitReason,
} from "../schema/addiction.schema.js";

export const addictionsData: Omit<AddictionType, "_id">[] = [
  {
    name: AddictionName.SMOKING,
    symptoms: ["Coughing", "Shortness of breath"],
    treatmentOptions: ["Nicotine patches", "Counseling"],
    triggers: ["Stress", "Social situations"],
    quitReason: QuitReason.MONEY,
  },
  {
    name: AddictionName.GAMBLING,
    symptoms: ["Financial problems", "Anxiety"],
    treatmentOptions: ["Therapy", "Support groups"],
    triggers: ["Boredom", "Alcohol"],
    quitReason: QuitReason.MONEY,
  },
];

//TODO: Add all after
