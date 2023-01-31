/** @format */

// singleton axios instance

import axios, { AxiosInstance } from 'axios'

let instance: AxiosInstance

export function getInstance() {
  return (
    instance ||
    (instance = axios.create({
      withCredentials: true,
      baseURL: process.env.REACT_APP_BASE_URL,
    }))
  )
}
