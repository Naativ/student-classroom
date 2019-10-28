import moment from 'moment'
import i18n from '@/i18n'

export const rules = {
  required: [v => !!v || i18n.t('validation.field.required')],
  email: [
    v => !!v || i18n.t('validation.field.required'),
    v => /^\w+([+.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || i18n.t('validation.valid.email')
  ],
  password: [
    v => !!v || i18n.t('validation.field.required'),
    v => (v && v.length > 8) || i18n.t('validation.valid.password')
  ],
  birthday: [
    v => !!v || i18n.t('validation.field.required'),
    v => (v && moment(v, i18n.t('system.date.format')).isValid()) || i18n.t('validation.date.format')
  ]
}
