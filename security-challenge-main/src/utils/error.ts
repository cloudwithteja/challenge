import express from 'express';

export const handleUnknownError = (res: express.Response) => {
  return (e: Error) => {
    res
      .status(500)
      .json({
        errors: [{
          code: 500,
          message: 'Unknown error',
          details: e.message,
          stack: e.stack
        }]
      })
      .end();
  };
};
