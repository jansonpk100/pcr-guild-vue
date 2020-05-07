import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import Vue, { VueConstructor } from 'vue'
import { Message } from 'element-ui'

axios.defaults.withCredentials = true

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    config.baseURL = 'api/'
    if (Vue.$cookies.isKey('csrftoken')) {
      config.headers['X-CSRFtoken'] = Vue.$cookies.get('csrftoken')
    }
    return config
  }
)

const ERROR: {[key: string]: string} = {
  'Incorrect username or password.': 'error.incorrectUsernamePassword',
  'User already exists.': 'error.usernameExists',
  'Unauthorized.': 'error.unauthorized',
  'Incorrect password.': 'error.incorrectPassword',
  'The limit of the length of a username is 4~16': 'error.usernameLimit',
  'The limit of the length of a password is 4~24': 'error.passwordLimit',
  'No permission.': 'error.noPermission',
  'User does not exist.': 'error.userNotExist',
  'Character already exists.': 'error.characterExist',
  'Character does not exist.': 'error.characterNotExist'
}

axios.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    return response
  },
  (error: any) => {
    if (error.response.data) {
      Message.error(window.i18n.t(ERROR[error.response.data]) || error.response.data)
      return Promise.reject(error)
    }
    switch (error.response.status) {
      case 400:
        Message.error(window.i18n.t('error.http400') as string)
        break
      case 401:
        localStorage.setItem('islogin', '0')
        Message.error(window.i18n.t('error.http401') as string)
        break
      case 403:
        Message.error(window.i18n.t('error.http403') as string)
        break
      case 404:
        Message.error(window.i18n.t('error.http404') as string)
        break
      default:
        Message.error(window.i18n.t('error.unknown') as string)
        break
    }
    return Promise.reject(error)
  }
)

export function login (username: string, password: string): Promise<AxiosResponse<any>> {
  return axios.post('login/',
    {
      username,
      password
    }
  ).then(response => {
    localStorage.setItem('islogin', '1')
    return response
  }) as Promise<AxiosResponse<any>>
}

export function register (username: string, password: string): Promise<AxiosResponse<any>> {
  return axios.post('register/',
    {
      username,
      password
    }
  ).then(response => {
    localStorage.setItem('islogin', '1')
    return response
  }) as Promise<AxiosResponse<any>>
}

export function logout (): Promise<AxiosResponse<any>> {
  return axios.post('logout/')
    .then(response => {
      localStorage.setItem('islogin', '0')
      return response
    }) as Promise<AxiosResponse<any>>
}

export function remove (username: string): Promise<AxiosResponse<any>> {
  return axios.post('remove/', {
    username
  })
}

export function set_password (password: string, new_password: string): Promise<AxiosResponse<any>> {
  return axios.post('set_password/',
    {
      password,
      new_password
    }
  )
}

export function set_staff (username: string, flag: boolean): Promise<AxiosResponse<any>> {
  return axios.post('set_staff/',
    {
      username,
      flag
    }
  )
}

export function set_detail (id: string, level: number): Promise<AxiosResponse<any>> {
  return axios.post('set_detail/',
    {
      id,
      level
    }
  )
}

export function get_detail (): Promise<AxiosResponse<any>> {
  return axios.post('get_detail/')
}

export function get_detail_all (): Promise<AxiosResponse<any>> {
  return axios.post('get_detail_all/')
}

export function character_add (id: string): Promise<AxiosResponse<any>> {
  return axios.post('character_add/',
    {
      id
    }
  )
}

export function character_edit (character: {
    id: string;
    rank: number;
    star: number;
    max: boolean;
  }): Promise<AxiosResponse<any>> {
  return axios.post('character_edit/',
    character
  )
}

export function character_remove (id: string): Promise<AxiosResponse<any>> {
  return axios.post('character_remove/',
    {
      id
    }
  )
}

export const Http = {
  login,
  register,
  logout,
  remove,
  set_password,
  set_staff,
  set_detail,
  get_detail,
  get_detail_all,
  character_add,
  character_edit,
  character_remove
}

declare module 'vue/types/vue' {
  interface Vue {
    $Http: typeof Http;
  }
}

export default {
  install (vue: VueConstructor) {
    vue.prototype.$Http = Http
  }
}
