
export type BuildMode = 'production' | 'development'
export enum BuildProject {
  FRONTEND  = 'frontend',
  JEST      = 'jest'
}


export interface BuildPaths {
  entry   : string
  build   : string
  html    : string
  favicon : string
  src     : string
}


export interface BuildEnv {
  mode   : BuildMode
  port   : number
  isAnal : boolean
  apiUrl : string
}


export interface BuildOptions {
  mode    : BuildMode
  paths   : BuildPaths
  isDev   : boolean
  isAnal  : boolean
  port    : number
  apiUrl  : string
  project : BuildProject
}
