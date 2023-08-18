import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

let baseUrl = ''

if (import.meta.env.DEV) {
  const href = new URL(window.location.href)
  href.port = '8080'
  href.pathname = '/api/v1/'
  baseUrl = href.toString()
}

if (import.meta.env.PROD) {
  baseUrl = 'http://localhost:8080/api/v1/'
}

const request = axios.create({
  baseURL: baseUrl, // edit it!
  headers: {
    'Content-type': 'application/json',
  },
  timeout: 6000,
})

request.interceptors.request.use(
  (config) => {
    NProgress.start()
    return config
  },
  (error) => {
    NProgress.done()
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response) => {
    NProgress.done()
    return response
  },
  (error) => {
    NProgress.done()
    return Promise.reject(error)
  }
)

export default request
