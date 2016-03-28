const URL_BASE = 'http://lancertech.net/farm/douchat/index.php';

const URL_BASE_API = URL_BASE+'?s=/Home'
export const URL_API_DEVICE_BIND = URL_BASE_API+'/Device/device_bind'
export const URL_API_DEVICE_UNBIND = URL_BASE_API+'/Device/device_unbind'
export const URL_API_DEVICE_BINDTOUSER = URL_BASE_API+'/Device/bindToUser'
export const URL_API_DEVICE_GETBYQRCODE= URL_BASE_API+'/Device/getDeviceByQrcode'
export const URL_API_DEVICE_GETBINDDEVICE= URL_BASE_API+'/Device/get_bind_device'
const URL_BASE_ADDON = URL_BASE+'?s=/addon'
export const URL_ADDON_DEVICE = URL_BASE_ADDON + '/HelloWorld'
