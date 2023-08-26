import passport from "passport";
import GitHubStrategy from "passport-github2";
import userService from "../models/users.model.js"

const initializePassport = () => {

    passport.use('github', new GitHubStrategy(
        {
            clientID: "Iv1.cfb3b02ec2720dad",
            clientSecret: "5c9c40213c67744791c8e728e275ea9206853ad3",
            callbackURL: "http://localhost:8080/api/sessions/githubcallback"
        }, async (accessToken, refreshToken, profile, done) => {
            try { 

                //console.log('LOREEEEEEEEE', profile);
                let user = await userService.findOne({email:profile._json.email})

                if (!user){
                    let newUser = {
                        username: profile._json.name,
                        email: profile._json.email,
                        password:''
                    }

                    let result = await userService.create(newUser);
                    done(null, result);
                }
                else
                {
                    done(null, user);
                }

                //console.log('USEEEEEEEEEREEE', user);

            } catch (error) { 
                return done(error);
            }
        }

    ))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userService.findById(id);
        done(null, user);
    })

}

export default initializePassport;