import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { Tag } from "./useTags";

export const STORAGE_KEY = "PIXEL_TRACKER_SETTINGS";

export const SCALE_TYPES = [
  "ColorBrew-RdYlGn",
  "ColorBrew-RdYlGn-old",
  "ColorBrew-PiYG",
  "ColorBrew-BrBG",
];

const SettingsStateContext = createContext(undefined);

// ATTENTION: If you change the settings state, you need to update
// the export variables also in the DataGate
export interface SettingsState {
  loaded: boolean;
  deviceId: string | null;
  passcodeEnabled: boolean | null;
  passcode: string | null;
  scaleType: typeof SCALE_TYPES[number];
  reminderEnabled: Boolean;
  reminderTime: string;
  analyticsEnabled: boolean;
  actionsDone: IAction[];

  // remove in previous version
  trackBehaviour?: boolean; // replaced with analyticsEnabled
  tags?: Tag[] // moved to useTags()
}

interface IAction {
  title: string;
  date: string;
}

const store = async (settings: Omit<SettingsState, 'loaded'>) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error(e);
  }
};

const load = async (): Promise<SettingsState | null> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    if (value !== null) {
      const newValue = {
        ...JSON.parse(value),
      };
      if (newValue.deviceId === null) {
        newValue.deviceId = uuidv4();
      }
      return newValue;
    }
  } catch (e) {
    console.error(e);
  }

  return null;
};

export const INITIAL_STATE: SettingsState = {
  loaded: false,
  deviceId: null,
  passcodeEnabled: null,
  passcode: null,
  scaleType: "ColorBrew-RdYlGn",
  reminderEnabled: false,
  reminderTime: "18:00",
  analyticsEnabled: true,
  actionsDone: [],
};

function SettingsProvider({ children }: { children: React.ReactNode }) {

  const [settings, setSettings] = useState<SettingsState>(INITIAL_STATE);

  const resetSettings = useCallback(() => {
    setSettings({
      ...INITIAL_STATE,
      deviceId: uuidv4(),
      loaded: true,
    });
  }, [INITIAL_STATE]);

  const importSettings = useCallback((settings: SettingsState) => {
      setSettings({
        ...INITIAL_STATE,
        ...settings,
      });
  }, [INITIAL_STATE]);

  useEffect(() => {
    (async () => {
      const json = await load();
      if(json !== null) {
        setSettings({
          ...INITIAL_STATE,
          ...json,
          loaded: true,
        });
      } else {
        setSettings({
          ...INITIAL_STATE,
          deviceId: uuidv4(),
          loaded: true,
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (settings.loaded) {
      store(_.omit(settings, 'loaded'));
    }
  }, [JSON.stringify(settings)]);

  const addActionDone = useCallback((actionTitle: IAction["title"]) => {
    setSettings((settings) => ({
      ...settings,
      actionsDone: [
        ...settings.actionsDone,
        {
          title: actionTitle,
          date: new Date().toISOString(),
        },
      ],
    }));
  }, []);

  const hasActionDone = useCallback(
    (actionTitle: IAction["title"]) => {
      return settings.actionsDone.some(
        (action) => action.title === actionTitle
      );
    },
    [settings.actionsDone]
  );

  const value = {
    settings,
    setSettings,
    resetSettings,
    importSettings,
    addActionDone,
    hasActionDone,
  };

  return (
    <SettingsStateContext.Provider value={value}>
      {children}
    </SettingsStateContext.Provider>
  );
}

function useSettings(): {
  settings: SettingsState;
  setSettings: (
    settings: SettingsState | ((settings: SettingsState) => SettingsState)
  ) => void;
  resetSettings: () => void;
  importSettings: (settings: SettingsState) => void;
  addActionDone: (action: IAction["title"]) => void;
  hasActionDone: (actionTitle: IAction["title"]) => boolean;
} {
  const context = useContext(SettingsStateContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

export { SettingsProvider, useSettings };
