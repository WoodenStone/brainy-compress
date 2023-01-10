/** @format */
import { useSnackbar, VariantType } from 'notistack'

export const useNotification = (duration = 1500, horizontal = 'right', vertical = 'top') => {
  const { enqueueSnackbar } = useSnackbar()

  const notice = (message: string, variant: VariantType) => {
    return enqueueSnackbar(message, {
      variant,
      autoHideDuration: duration,
      anchorOrigin: {
        horizontal: horizontal as any,
        vertical: vertical as any,
      },
    })
  }

  return { notice }
}
