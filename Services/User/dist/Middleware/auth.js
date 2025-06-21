import jwt from "jsonwebtoken";
export async function auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            res.status(401).json({ message: "Please login - No auth header" });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decodeValue = jwt.verify(token, process.env.SECRETE_JWT);
        if (!decodeValue) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        req.user = decodeValue.id;
        req.userName = decodeValue.username;
        next();
    }
    catch (error) {
        console.error("jwt verification error", error);
    }
}
