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
    failureRedirect: `${process.env.CLIENT_URL}/auth/callback?error=oauth_failed`,
  }),
  async (req, res) => {
    try {
      const user = req.user;
      const { accessToken, refreshToken } = issueTokens(user._id.toString());

      user.refreshTokens.push(refreshToken);
      await user.save();

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Redirect to frontend callback with all data
      const params = new URLSearchParams({
        token: accessToken,
        name: user.name,
        email: user.email,
        id: user._id.toString(),
      });

      res.redirect(`${process.env.CLIENT_URL}/auth/callback?${params}`);
    } catch (err) {
      console.error('OAuth callback error:', err);
      res.redirect(`${process.env.CLIENT_URL}/auth/callback?error=oauth_failed`);
    }
  }
);


export default router;