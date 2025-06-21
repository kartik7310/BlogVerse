function TryCatch(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        }
        catch (error) {
            console.error("Caught error in TryCatch:", error);
            res.status(500).json({ message: "Something went wrong" });
        }
    };
}
export default TryCatch;
