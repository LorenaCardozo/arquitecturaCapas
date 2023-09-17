import passport from "passport";
import GitHubStrategy from "passport-github2";
import userService from "../dao/mongo/models/users.model.js";
import jwt from "passport-jwt";
import { KEY_SECRET, CLIENT_ID, CLIENT_SECRET, CALLBACK_URL } from "../config/config.js"


const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) { //comprobamos que hay alguna cookie que tomar
        token = req.cookies['coderCookieToken']
    }
    return token;
};

const initializePassport = () => {

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: KEY_SECRET,
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        }
        catch (err) {
            return done(err);
        }
    }
    )
    );

    passport.use('github', new GitHubStrategy(
        {
            clientID: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            callbackURL: CALLBACK_URL
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userService.findOne({ email: profile._json.email });

                if (!user) {
                    let newUser = {
                        username: profile._json.name || profile._json.twitter_username || profile._json.email,
                        email: profile._json.email,
                        password: ''
                    }

                    let result = await userService.create(newUser);
                    done(null, result);
                } else {
                    done(null, user);
                }
            } catch (error) {
                return done(error);
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });

}

export default initializePassport;