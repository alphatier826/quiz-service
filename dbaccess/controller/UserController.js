const { UserService } = require("./../service/UserService.js");

exports.UserController = {
    init: function (express) {
        var router = express.Router();

        /* Get All Users */
        router.get("", (req, res) => returnResponse(req, res, UserService.getAll()));
        
        /* Create User */
        router.post("", (req, res) => returnResponse(req, res, UserService.create(req.body)));

        /* Validate User */
        router.post("/login", (req, res) => returnResponse(req, res, UserService.loginValidate(req.body)));

        return router;
    }
};