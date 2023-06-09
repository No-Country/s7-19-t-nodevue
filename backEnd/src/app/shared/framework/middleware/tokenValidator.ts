import { NextFunction, Request, Response } from "express"
import { JwtPayload, verify } from "jsonwebtoken"
import { User } from "../../../../contexts/devSarrolloIt/User/domain/valueObjects/User"
import { UnauthenticatedError } from "../../../../contexts/shared/domain/errors/UnauthenticatedError"

const tokenValidator = (req: Request, _: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]
  if (token) {
    try {
      const payload = verify(token, process.env.JWT_PASS) as JwtPayload

      req.logedInUser = {
        id: payload.id as User["id"]
      }
    } catch {
      throw new UnauthenticatedError()
    }
  }

  next()
}

export { tokenValidator }
