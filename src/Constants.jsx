const URL_BASE = 'http://lancertech.net/farm/douchat/index.php';

const URL_BASE_API = URL_BASE+'?s=/Home'
export const URL_API_DEVICE_BIND = URL_BASE_API+'/Device/device_bind'
export const URL_API_DEVICE_UNBIND = URL_BASE_API+'/Device/device_unbind'
export const URL_API_DEVICE_BINDTOUSER = URL_BASE_API+'/Device/bindToUser'
export const URL_API_DEVICE_BINDTOUSER2 = URL_BASE_API+'/Device/bindToUser2'
export const URL_API_DEVICE_GETBYQRCODE= URL_BASE_API+'/Device/getDeviceByQrcode'
export const URL_API_DEVICE_GETBINDDEVICE= URL_BASE_API+'/Device/get_bind_device'
export const URL_API_DEVICE_GETDEVICELIST= URL_BASE_API+'/Device/get_device_list'
export const URL_API_DEVICE_DATAX= URL_BASE_API+'/Device/datax'
export const URL_API_DEVICE_GETDATAXHISTORY= URL_BASE_API+'/Device/getDataxHistory'
export const URL_API_DEVICE_GETDATAXLATESTLIST= URL_BASE_API+'/Device/getDataxLatestList'
export const URL_API_DEVICE_FW_UPLOAD= URL_BASE_API+'/Device/firmwareUpload'
export const URL_API_DEVICE_FW_DELETE= URL_BASE_API+'/Device/firmwareDelete'
export const URL_API_DEVICE_FW_LIST= URL_BASE_API+'/Device/firmwareList'

const URL_BASE_ADDON = URL_BASE+'?s=/addon'
export const URL_ADDON_DEVICE = URL_BASE_ADDON + '/HelloWorld'
