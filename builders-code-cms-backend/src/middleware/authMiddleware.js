const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// Middleware para verificar se o usuário está autenticado
exports.protect = async (req, res, next) => {
  try {
    // 1) Verificar se o token existe
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Você não está logado. Por favor, faça login para obter acesso.',
      });
    }

    // 2) Verificar se o token é válido
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Verificar se o usuário ainda existe
    const User = require('../models/userModel');
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'O usuário associado a este token não existe mais.',
      });
    }

    // 4) Verificar se o usuário está ativo
    if (!currentUser.ativo) {
      return res.status(401).json({
        status: 'error',
        message: 'Esta conta foi desativada. Entre em contato com o administrador.',
      });
    }

    // 5) Verificar se o usuário está bloqueado
    if (currentUser.estaBloqueado && currentUser.estaBloqueado()) {
      return res.status(401).json({
        status: 'error',
        message: 'Sua conta está temporariamente bloqueada. Tente novamente mais tarde.',
      });
    }

    // Conceder acesso à rota protegida
    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: 'Token inválido ou expirado. Por favor, faça login novamente.',
    });
  }
};

// Middleware para restringir acesso com base na função do usuário
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Você não tem permissão para realizar esta ação.',
      });
    }
    next();
  };
};

// Gerar token JWT
exports.signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Enviar token como resposta
exports.createSendToken = (user, statusCode, req, res) => {
  const token = exports.signToken(user._id);
  
  // Opções para cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  // Enviar cookie
  res.cookie('jwt', token, cookieOptions);

  // Remover senha da saída
  user.senha = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
