import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (res, user) => {
  const secret = process.env.JWT_SECRET || 'ridevista_super_secure_jwt_secret_key_2026';
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    secret,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );

  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

export default generateTokenAndSetCookie;
