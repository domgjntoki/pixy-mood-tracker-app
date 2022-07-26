import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from "react";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'PIXEL_TRACKER_SETTINGS'

const SettingsStateContext = createContext(undefined)

export type Tag = {
  id: string;
  title: string;
  color: 'slate' | 'stone' | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'teal' | 'sky' | 'blue' | 'indigo' | 'purple' | 'pink';
}

export interface SettingsWebhookEntry {
  url: string,
  date: string,
  body: string,
  statusCode?: number,
  statusText?: string,
  isError: boolean,
  errorMessage?: string,
}

export interface SettingsState {
  deviceId: string | null,
  passcodeEnabled: boolean | null,
  passcode: string | null,
  webhookEnabled: Boolean,
  webhookUrl: string,
  webhookHistory: SettingsWebhookEntry[],
  scaleType: 'ColorBrew-RdYlGn' | 'ColorBrew-PiYG',
  reminderEnabled: Boolean,
  reminderTime: string,
  trackBehaviour: boolean,
  tags: Tag[],
}

const initialState: SettingsState = {
  deviceId: null,
  passcodeEnabled: null,
  passcode: null,
  webhookEnabled: false,
  webhookUrl: '',
  webhookHistory: [],
  scaleType: 'ColorBrew-RdYlGn',
  reminderEnabled: false,
  reminderTime: '18:00',
  trackBehaviour: true,
  tags: [{
    id: '1',
    title: 'Struggles ☔️',
    color: 'purple',
  }, {
    id: '2',
    title: 'Happy ☺️',
    color: 'orange',
  }, {
    id: '3',
    title: 'Work 💼',
    color: 'sky',
  }, {
    id: '4',
    title: 'Exercise 🏃',
    color: 'green',
  }, {
    id: '5',
    title: 'Friends 🤗',
    color: 'yellow',
  }],
}

function SettingsProvider({children}: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(initialState)

  const setSettingsProxy = async (settingsOrSettingsFunction: SettingsState | Function) => {
    
    const newSettings = typeof settingsOrSettingsFunction === 'function' ? 
      settingsOrSettingsFunction(settings) : 
      settingsOrSettingsFunction;

    setSettings(newSettings)

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings))
    } catch (e) {
      console.error(e)
    }
  }
  
  const resetSettings = () => {
    console.log('reset settings')
    setSettingsProxy(initialState)
  }
  
  useEffect(() => {
    const load = async () => {
      const json = await AsyncStorage.getItem(STORAGE_KEY)
      if (json !== null) {
        const newSettings: SettingsState = {
          ...initialState,
          ...JSON.parse(json)
        }
        if(newSettings.deviceId === null) {
          newSettings.deviceId = uuidv4()
        }
        setSettings(newSettings)
      } else {
        setSettingsProxy({
          ...initialState,
          deviceId: uuidv4(),
        })
      }
    }

    try {
      load()
    } catch(e) {
      console.log('Error loading settings', e)
    }
  }, [])

  const value = { 
    settings, 
    setSettings: setSettingsProxy, 
    resetSettings 
  };
  
  return (
    <SettingsStateContext.Provider value={value}>
      {children}
    </SettingsStateContext.Provider>
  )
}

function useSettings(): { 
  settings: SettingsState, 
  setSettings: (settings: SettingsState) => void, 
  resetSettings: () => void,
} {
  const context = useContext(SettingsStateContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

export { SettingsProvider, useSettings };
