import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists in the database
                let user = await User.findOne({ googleId: profile.id });

                if (user) return done(null, user);

                //Check if user already registered with normally
                user = await User.findOne({email: profile.emails[0].value});
                if (user) {
                    user.googleId = profile.id;
                    user.avatar = profile.photos[0]?.value;
                    await user.save();
                    return done(null, user);
                } 


                //Create nre user 
                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    avatar: profile.photos[0]?.value,
                    password: Math.random().toString(36), // dummy password, won't be used for authentication
                })
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
)


export default passport;