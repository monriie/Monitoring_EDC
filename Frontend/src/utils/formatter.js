export const formatCurrency = (amount) => {
  if (!amount) return 'Rp 0'
  return `Rp ${amount.toLocaleString('id-ID')}`
}

export const formatNumber = (num) => {
  if (!num) return '0'
  return num.toLocaleString('id-ID')
}