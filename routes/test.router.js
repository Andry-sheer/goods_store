import { Router } from "express";

const router = Router();

router.get('/', (req, res)=> {
  res.json({
    status : 200,
    message : "Server work"
  })
});

export default router;