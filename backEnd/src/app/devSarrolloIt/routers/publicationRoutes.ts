import { Router, type Request, type Response } from "express"
import { asyncHandler } from "../../shared/framework/asyncHandler"
import { PublicationFindAllController } from "../controllers/publication/publicationFindAllController"
import { PublicationDeleteController } from "../controllers/publication/publicationDeleteController"
import { CreatePublicationController } from "../controllers/publication/CreatePublicationController"
import { ShowPublicationsController } from "../controllers/publication/ShowPublicationsController"
import { UpdatePublicationController } from "../controllers/publication/UpdatePublicationController"
import { PublicationFindByStack } from "../controllers/publication/publicationFindByStackController"
import { PublicationFindAllCommentsControllers } from "../controllers/publication/publicationFindAllCommentsController"
import { PublicationFindOneController } from "../controllers/publication/publicationFindOneController"


const publicationRouter = Router()

publicationRouter.get(
    "/publications",
    asyncHandler(async (req: Request, res: Response) => {
        const publicationFindAllController = new PublicationFindAllController()
        await publicationFindAllController.run(req, res)
    })
)

publicationRouter.delete(
    "/publications/:id",
    asyncHandler(async (req: Request, res: Response) => {
        const deletePublicationController = new PublicationDeleteController()
        await deletePublicationController.run(req, res)})
)

publicationRouter.post(
    "/publications",
    asyncHandler(async (req: Request, res: Response) => {
        const publicationController = new CreatePublicationController()
        await publicationController.run(req, res)
    })
)
publicationRouter.get(
    "/publicationsOfUser",
    asyncHandler(async (req: Request, res: Response) => {
        const publicationController = new ShowPublicationsController()
        await publicationController.run(req, res)
    })
)


publicationRouter.put(
    "/publications/:publicationid",
    asyncHandler( async(req:Request , res: Response) => {
        const updatepublicationcontroller = new UpdatePublicationController()
        await updatepublicationcontroller.run(req,res)
    })
)

publicationRouter.get(
    "/publicationsByStacks",
    asyncHandler(async (req: Request, res: Response) => {
        const publicationController = new PublicationFindByStack()
        await publicationController.run(req, res)
    })
)

publicationRouter.get(
    "/publications/:id",
    asyncHandler(async (req: Request, res: Response) => {
        const publicationController = new PublicationFindAllCommentsControllers()
        await publicationController.run(req, res)
    })
)

publicationRouter.get(
    "/publicationsbyid/:id",
    asyncHandler(async (req: Request, res: Response) => {
        const publicationController = new PublicationFindOneController()
        await publicationController.run(req, res)
    })
)

export { publicationRouter }