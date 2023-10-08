import { getCategory } from "../controllers/Category";

const express = require('express');
const router = express.Router();

router.get('/', getCategory);


module.exports = router;

