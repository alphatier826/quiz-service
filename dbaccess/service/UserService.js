const User = require("./../model/users.model");

exports.UserService = {
    getAll: function () {
        return new Promise(async (resolve, reject) => {
            try {
                User.find({}, function (err, users) {
                    if(err) reject(err);
                    else {
                        users.map(user => delete user._doc.password );
                        resolve(users);
                    }
                });
            } catch (error) { reject(error) }
        });
    },
    create: function (reqUserObj) {
        return new Promise(async (resolve, reject) => {
            try {
                let user = new User(reqUserObj);
                user.save().then((savedUser) => {
                    resolve(savedUser);
                }).catch((err) => {
                    reject(err);
                });
            } catch (error) { reject(error) }
        });
    },
    loginValidate: function (reqBody) {
        return new Promise(async (resolve, reject) => {
            try {
                User.findOne({ email: reqBody.email, password: reqBody.password }, function (err, userDetails) {
                    if (err) {
                        reject(err);
                    } else if (!userDetails) {
                        reject({ status: 'FAILED', message: "You have entered an invalid email or password" });
                    } else {
                        delete userDetails._doc.password;
                        resolve({ status: 'SUCCESS', userDetails });
                    }
                });
            } catch (error) { reject(error) }
        });
    }
}