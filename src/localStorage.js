export const loadState = () => {
  console.log('loadState');
  try {
      const serializedState = localStorage.getItem('state'); // eslint-disable-line
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.log(err);
  }
  return undefined;
};

export const saveState = (state) => {
  console.log('saveState');
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState); // eslint-disable-line
  } catch (err) {
    console.log(err);
  }
  return undefined;
};
