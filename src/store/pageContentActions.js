/**
 *
 * @param {array} payload - ['nameOfParam', value]
 *
 */
export const fillPageParams = payload => {
  return {
    type: 'FILL_PAGE_PARAMS',
    payload
  }
}

export const clearPageParams = () => {
  return {
    type: 'CLEAR_PAGE_PARAMS'
  }
}
