import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CategoriasList from './categorias/CategoriasList';
import CategoriasForm from './categorias/CategoriasForm';

// Esta é uma versão unificada opcional que pode gerenciar tanto a lista quanto o formulário
// Por enquanto, exportamos apenas a lista, pois o roteamento já está configurado

export default CategoriasList;