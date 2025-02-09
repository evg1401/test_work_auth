import { Router } from 'express';
import auth from './auth.js';
import info from './info.js';

export default () => {
    return new Router()
        .use('/auth', auth)
        .use('/info', info)
}