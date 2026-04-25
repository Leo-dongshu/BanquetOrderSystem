<<<<<<< HEAD
import { Request } from 'express';
=======
// Type definitions for Express
import * as express from 'express';
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d

declare global {
  namespace Express {
    interface Request {
<<<<<<< HEAD
      user?: {
        id: number;
        username: string;
        role: string;
      };
    }
  }
}
=======
      user?: any;
    }
  }
}
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
