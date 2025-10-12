const crypto = require('crypto');
const User = require('../models/userModel');
const { createSendToken } = require('../middleware/authMiddleware');
const LogAtividade = require('../models/logAtividadeModel');

// Registrar atividade do usuário
const registrarAtividade = async (usuarioId, acao, entidade, entidadeId = null, detalhes = {}, req) => {
  try {
    await LogAtividade.create({
      usuarioId,
      acao,
      entidade,
      entidadeId,
      detalhes,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  } catch (error) {
    console.error('Erro ao registrar atividade:', error);
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // 1) Verificar se email e senha foram fornecidos
    if (!email || !senha) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor, forneça email e senha.',
      });
    }

    // 2) Verificar se o usuário existe e a senha está correta
    const user = await User.findOne({ email }).select('+senha');

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Email ou senha incorretos.',
      });
    }

    // 3) Verificar se o usuário está bloqueado
    if (user.estaBloqueado && user.estaBloqueado()) {
      return res.status(401).json({
        status: 'error',
        message: 'Sua conta está temporariamente bloqueada devido a múltiplas tentativas de login. Tente novamente mais tarde.',
      });
    }

    // 4) Verificar se a senha está correta
    const senhaCorreta = await user.verificarSenha(senha, user.senha);

    if (!senhaCorreta) {
      // Incrementar tentativas de login
      await user.incrementarTentativasLogin();

      return res.status(401).json({
        status: 'error',
        message: 'Email ou senha incorretos.',
      });
    }

    // 5) Se tudo estiver ok, resetar tentativas de login e enviar token
    await user.resetarTentativasLogin();

    // 6) Atualizar último login
    user.ultimoLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // 7) Registrar atividade
    await registrarAtividade(user._id, 'login', 'usuario', user._id, {}, req);

    // 8) Enviar token
    createSendToken(user, 200, req, res);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao fazer login. Tente novamente.',
    });
  }
};

// Logout
exports.logout = (req, res) => {
  try {
    // Limpar cookie JWT
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    // Registrar atividade se o usuário estiver autenticado
    if (req.user) {
      registrarAtividade(req.user._id, 'logout', 'usuario', req.user._id, {}, req);
    }

    res.status(200).json({ status: 'success' });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao fazer logout. Tente novamente.',
    });
  }
};

// Obter usuário atual
exports.getMe = (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter dados do usuário.',
    });
  }
};

// Atualizar senha
exports.updatePassword = async (req, res) => {
  try {
    const { senhaAtual, novaSenha, confirmarSenha } = req.body;

    // 1) Verificar se todas as senhas foram fornecidas
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor, forneça todas as senhas necessárias.',
      });
    }

    // 2) Verificar se a nova senha e a confirmação são iguais
    if (novaSenha !== confirmarSenha) {
      return res.status(400).json({
        status: 'error',
        message: 'A nova senha e a confirmação não coincidem.',
      });
    }

    // 3) Obter usuário com senha
    const user = await User.findById(req.user.id).select('+senha');

    // 4) Verificar se a senha atual está correta
    const senhaCorreta = await user.verificarSenha(senhaAtual, user.senha);

    if (!senhaCorreta) {
      return res.status(401).json({
        status: 'error',
        message: 'Sua senha atual está incorreta.',
      });
    }

    // 5) Atualizar senha
    user.senha = novaSenha;
    await user.save();

    // 6) Registrar atividade
    await registrarAtividade(user._id, 'update', 'usuario', user._id, { campo: 'senha' }, req);

    // 7) Enviar novo token
    createSendToken(user, 200, req, res);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao atualizar senha. Tente novamente.',
    });
  }
};

// Solicitar redefinição de senha
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1) Verificar se o email foi fornecido
    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor, forneça seu email.',
      });
    }

    // 2) Verificar se o usuário existe
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Não existe usuário com este email.',
      });
    }

    // 3) Gerar token de redefinição
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.tokenReset = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Token expira em 1 hora
    user.tokenResetExpira = Date.now() + 60 * 60 * 1000;
    
    await user.save({ validateBeforeSave: false });

    // 4) Enviar email com token (implementação simplificada)
    // Na implementação real, você usaria um serviço de email como Nodemailer
    
    // 5) Responder ao cliente
    res.status(200).json({
      status: 'success',
      message: 'Token enviado para o email!',
      // Em ambiente de desenvolvimento, retornar o token para testes
      resetToken,
    });
  } catch (error) {
    // Limpar campos de redefinição em caso de erro
    if (user) {
      user.tokenReset = undefined;
      user.tokenResetExpira = undefined;
      await user.save({ validateBeforeSave: false });
    }

    res.status(500).json({
      status: 'error',
      message: 'Erro ao solicitar redefinição de senha. Tente novamente mais tarde.',
    });
  }
};

// Redefinir senha
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { senha, confirmarSenha } = req.body;

    // 1) Verificar se as senhas foram fornecidas
    if (!senha || !confirmarSenha) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor, forneça a nova senha e a confirmação.',
      });
    }

    // 2) Verificar se as senhas coincidem
    if (senha !== confirmarSenha) {
      return res.status(400).json({
        status: 'error',
        message: 'As senhas não coincidem.',
      });
    }

    // 3) Verificar token e encontrar usuário
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      tokenReset: hashedToken,
      tokenResetExpira: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Token inválido ou expirado.',
      });
    }

    // 4) Atualizar senha e limpar campos de redefinição
    user.senha = senha;
    user.tokenReset = undefined;
    user.tokenResetExpira = undefined;
    await user.save();

    // 5) Registrar atividade
    await registrarAtividade(user._id, 'update', 'usuario', user._id, { campo: 'senha', metodo: 'reset' }, req);

    // 6) Enviar novo token
    createSendToken(user, 200, req, res);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao redefinir senha. Tente novamente.',
    });
  }
};
