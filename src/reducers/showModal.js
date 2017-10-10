export default function showModal(state = false, action) {
  if (action.type === 'OPEN_MODAL') {
    return true;
  } else if (action.type === 'MODAL_IS_CLOSED') {
    return false;
  }
  return state;
}
