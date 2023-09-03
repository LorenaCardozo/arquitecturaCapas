import passport from "passport";
import GitHubStrategy from "passport-github2";
import userService from "../models/users.model.js"
import * as dotenv from "dotenv";
import jwt from "passport-jwt";

dotenv.config();

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
        secretOrKey: process.env.KEY_SECRET,
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
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL
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