import { Router } from "express";
import { body, param } from "express-validator";
import authenticate from "@/middleware/authenticate";
import authorize from "@/middleware/authorize";
import validationError from "@/middleware/validationError";
import * as gameController from "@/controllers/v2/game/game_multiplayer";
import attachSocket from '@/middleware/socket';

const router = Router();

/**
 * @openapi
 * /api/v2/games:
 *   post:
 *     summary: Créer une nouvelle partie multijoueur
 *     tags: [Game]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bet, timeout]
 *             properties:
 *               bet:
 *                 type: integer
 *                 minimum: 1
 *               timeout:
 *                 type: integer
 *                 minimum: 10
 *                 description: Temps en secondes avant expiration
 *     responses:
 *       201:
 *         description: Partie créée
 */
router.post(
  '/',
  authenticate,
  authorize(['user']),
  body('bet').isInt({ min: 1 }).withMessage('Bet is required'),
  body('timeout').isInt({ min: 10 }).withMessage('Timeout (in seconds) is required'),
  validationError,
  attachSocket,
  gameController.createGame,
);

/**
 * @openapi
 * /api/v2/games:
 *   get:
 *     summary: Lister les parties
 *     tags: [Game]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des parties
 */
router.get(
  '/',
  authenticate,
  authorize(['user', 'admin']),
  validationError,
  gameController.getAllGames,
);

/**
 * @openapi
 * /api/v2/games/{id}/join:
 *   post:
 *     summary: Rejoindre une partie
 *     tags: [Game]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Partie rejointe
 *       400:
 *         description: Partie non disponible ou solde insuffisant
 */
router.post(
  '/:id/join',
  authenticate,
  authorize(['user']),
  param('id').isMongoId(),
  validationError,
  attachSocket,
  gameController.joinGame,
);

/**
 * @openapi
 * /api/v2/games/{id}/play:
 *   post:
 *     summary: Jouer un tour dans une partie multijoueur
 *     tags: [Game]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tour joué, état du jeu mis à jour
 *       400:
 *         description: Mauvais statut ou tour
 *       403:
 *         description: Pas le tour du joueur
 */
router.post(
  '/:id/play',
  authenticate,
  authorize(['user']),
  param('id').isMongoId(),
  validationError,
  attachSocket,
  gameController.playTurn,
);

/**
 * @openapi
 * /api/v2/games/history:
 *   get:
 *     summary: Historique de toutes les parties auxquelles j'ai participé
 *     tags: [Game]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des parties de l'utilisateur
 */
router.get(
  '/history',
  authenticate,
  authorize(['user']),
  gameController.getGameHistory
);

export default router;
