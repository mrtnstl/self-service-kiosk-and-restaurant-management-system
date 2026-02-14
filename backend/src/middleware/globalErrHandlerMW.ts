import { ErrorRequestHandler } from "express";

export default (): ErrorRequestHandler => {
    return async (err, _req, res, _next) => {
        // TODO:
        console.log(err.message);
        return res
            .status(400)
            .json({ message: "an error occured. (check logs)" });
    };
};
