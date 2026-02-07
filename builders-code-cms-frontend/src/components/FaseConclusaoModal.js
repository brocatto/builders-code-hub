import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FaseConclusaoModal = ({ isOpen, faseName, onConfirm, onCancel }) => {
  const [observacoes, setObservacoes] = useState('');

  const handleConfirm = () => {
    onConfirm(observacoes);
    setObservacoes('');
  };

  const handleCancel = () => {
    setObservacoes('');
    onCancel();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="glassmorphism rounded-xl p-8 max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-display font-bold mb-4 text-gradient">
              Concluir Fase
            </h3>
            <p className="text-secondary-text mb-2">
              Marcando como concluída:
            </p>
            <p className="font-semibold mb-4 text-white">"{faseName}"</p>

            <div className="mb-6">
              <label
                htmlFor="observacoes"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Observações (opcional)
              </label>
              <textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Descreva o que foi feito nesta fase..."
              />
            </div>

            <p className="text-secondary-text text-sm mb-4">
              Um log será criado automaticamente para registrar esta conclusão.
            </p>

            <div className="flex space-x-4">
              <button
                onClick={handleCancel}
                className="flex-1 glassmorphism px-4 py-2 rounded-lg hover:bg-primary/10 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors text-white"
              >
                Confirmar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FaseConclusaoModal;
