/*
export function someMutation (state) {
}
*/
export const updateDrawerState = (state, opened) => {
  console.log('updateDrawerState')
  state.drawerState = opened
}
