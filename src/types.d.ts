declare module 'express' {
  export interface Request {
    user: {
      name: string
      _id: string
      userName: string
      email: string
      mode: string
    }
  }
}

export interface JwtPayload {
  _id: string
  name: string
  userName: string
  email: string
  mode: string
}
