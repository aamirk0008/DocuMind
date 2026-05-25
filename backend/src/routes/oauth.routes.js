import { Router } from 'express'
import passport from 'passport'
import { issueTokens } from '../services/token.service.js'

const router = Router()

//Redirect user to Google for authentication
router.get('/google', 
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
    })
)


// Google Callback route
router.get('/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${process.env.CLIENT_URL}/auth?error=oauth_failed`,
    }),
    async (req, res) => {
        try {
            const user = req.user;
            const { accessToken, refreshToken } = issueTokens(user._id.toString());

            user.refreshTokens.push(refreshToken);
            await user.save();

            // Set refresh token cookie 
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'none', // for cross-site cookie
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            })

            // Redirect to frontend with access token in URL
            res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${accessToken}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&id=${user._id}`);
        } catch (err) {
            console.error('OAuth callback error:', err);
            return res.redirect(`${process.env.CLIENT_URL}/auth?error=oauth_failed`);
        }
    }
)


export default router;