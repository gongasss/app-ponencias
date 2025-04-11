import AsyncStorage from '@react-native-async-storage/async-storage';

const SCANNED_USERS_KEY = '@scanned_users';

export const getScannedUsers = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(SCANNED_USERS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error reading scanned users:', e);
    return [];
  }
};

export const addScannedUser = async (dni) => {
  try {
    const users = await getScannedUsers();
    if (!users.includes(dni)) {
      const newUsers = [...users, dni];
      await AsyncStorage.setItem(SCANNED_USERS_KEY, JSON.stringify(newUsers));
    }
  } catch (e) {
    console.error('Error adding scanned user:', e);
  }
};

export const clearScannedUsers = async () => {
  try {
    await AsyncStorage.removeItem(SCANNED_USERS_KEY);
  } catch (e) {
    console.error('Error clearing scanned users:', e);
  }
};